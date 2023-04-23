
import { Request, Response, } from "express";
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import Stripe from "stripe";
import Sesiones_compra_eventos from '../models/sesion_compra_evento';
import Compras_eventos_no_finalizadas from "../models/compras_eventos_por_finalizar";
import Evento from "../models/eventos";
import Especialista from '../models/especialista';
import { sendMail } from "../helpers/send-mail";
import Cliente from "../models/clientes";
import { mailCompraCliente, mailCompraEspecialista } from "../helpers/plantilla-mail";
import Server from "../models/server";
import Sesiones_compra_suscripciones from "../models/sesiones_compra_suscripcion";
import {v4 as uuidv4} from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
});

export const stripeWebHooks = async (req: Request, res: Response) => {

    const payload = req.body;
    const firma = req.headers['stripe-signature'];
    try {
        const event = await stripe.webhooks.constructEventAsync(payload, firma!, process.env.STRIPE_WEBHOOK_SECRET!);
        
        if ((event.type === 'checkout.session.completed') ){
            
            const sesion = event.data.object;
            await onCheckoutSesionComplete(sesion);
        }if (event.type==='customer.subscription.deleted'){
            const sesion = event.data.object;
            await onDeleteSubscription(sesion.id);
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Webhook error',
            error
        })
    }

    res.json({
        recieved: true
    })

}
 
const onDeleteSubscription= async(subscriptionId:string)=>{

    try {
        
        const especialista = await Especialista.findOne({
            where:{token_pago:subscriptionId}
        });
        if (especialista){
            especialista.set({planId:1});
            await especialista.save();
        }else{
            throw new Error(`Error completando cancelación, el especialista no se encuentra`);
        }

    } catch (error) {
        console.log(error);
        throw new Error(`Error completando cancelación ${error}`);
    }

}

const onCheckoutSesionComplete = async (sesion: any) => {

    const sesionReferenceId = sesion.client_reference_id;
    //console.log('sesion.checkout.complete evento:', sesionReferenceId);

    try {
        const sesion_compra_evento = await Sesiones_compra_eventos.findByPk(sesionReferenceId);
        if (sesion_compra_evento) {
            const evento = await Evento.findByPk(sesion_compra_evento?.EventoId);
            const cliente = await Cliente.findByPk(sesion_compra_evento?.ClienteId);
            if (!evento) {
                throw new Error(`Error completando sesion, el evento no se encuentra`);
            }
            if (!cliente) {
                throw new Error(`Error completando sesion, el cliente no se encuentra`);
            }
            //cliente.set({idStripe:sesion.customer});
            //await cliente.save();
            sesion_compra_evento.set({ completada: 1 });
            await sesion_compra_evento.save();
        

            const compra_por_finalizar = await Compras_eventos_no_finalizadas.create({
                ClienteId: sesion_compra_evento.ClienteId,
                EventoId: evento.id,
                EspecialistaId: evento.EspecialistaId,
                ok_cliente: false,
                ok_especialista: false,
                payment_intent: sesion.payment_intent,
                pagada:false,
        //        token_seguridad:token_seguridad
            });
           

            console.log('compra por finalizar', compra_por_finalizar.id);

            const token = jwt.sign({ sesion_compra: compra_por_finalizar.id },
                process.env.SECRETPRIVATEKEY || '',
                { expiresIn: '15d' }
            );
            //realizar factura evento comprado
            if (cliente.idStripe) {
                const date = new Date(Date.now());
                console.log(date);
                const factura = await stripe.invoices.create({
                    collection_method: 'send_invoice',
                    customer: cliente.idStripe,
                    days_until_due: 0

                });
                const lineaFactura = await stripe.invoiceItems.create({
                    customer: cliente.idStripe,
                    price: evento.idPriceEvent,
                    invoice: factura.id,
                    quantity: 1,

                })

                await stripe.invoices.finalizeInvoice(factura.id);                
                await stripe.invoices.sendInvoice(factura.id);
            }
            await enviarMailCompraCliente(compra_por_finalizar, token);
            await enviarMailCompraEspecialista(compra_por_finalizar, token);

        } else {
            const sesion_compra_suscripcion = await Sesiones_compra_suscripciones.findByPk(sesionReferenceId);
            //console.log('sesion.checkout.complete suscripcion:',sesion);
            if (sesion_compra_suscripcion) {// es una suscripcion
                const especialista = await Especialista.findByPk(sesion_compra_suscripcion.EspecialistaId);
                if (!especialista) {
                    throw new Error("Error, el especialista no se encuentra")
                }
                let fecha_fin = new Date(Date.now());
                fecha_fin.setMonth(fecha_fin.getMonth() + 1)
                especialista.set({
                    token_pago: sesion.subscription,
                    stripeId: sesion.customer,
                    fecha_pago_actual: new Date(Date.now()),
                    fecha_fin_suscripcion: fecha_fin,
                    planeId: sesion_compra_suscripcion.planeId
                }); 
                await especialista.save();

            } else {
                throw new Error('no existe la referencia');
            }
        }

        //emision compra finalizada al frontend
        const server = Server.instance;
        server.io.on('connection', cliente => {
            console.log('cliente conectado ', cliente.id)
            cliente.emit('sesion_compra_finalizada', sesionReferenceId)
        })
        console.log('sesion' + sesionReferenceId + ' pagada');



    } catch (error) {
        console.log(error);
        throw new Error(`Error completando sesion ${error}`);

    }
}

const enviarMailCompraCliente = async (sesion_compra: any, token: string) => {

    const link = `${process.env.LINK_VERIFICAR_COMPRAS}${token}`;
    try {
        let especialista = await Especialista.findByPk(sesion_compra.EspecialistaId);
        let evento = await Evento.findByPk(sesion_compra.EventoId);
        let cliente = await Cliente.findByPk(sesion_compra.ClienteId);
        await sendMail({
            asunto: 'Compra de evento en Nativos Tierra',
            nombreDestinatario: cliente?.nombre,
            mailDestinatario: cliente?.email,
            mensaje: `Hola, ${cliente?.nombre} enviamos información del evento adquirido`,
            html: mailCompraCliente(especialista, evento, cliente, link),
        })
    } catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
}

const enviarMailCompraEspecialista = async (sesion_compra: any, token: string) => {
    const link = `${process.env.LINK_VERIFICAR_COMPRAS_ESPECIALISTAS}${token}`;
    try {
        let especialista = await Especialista.findByPk(sesion_compra.EspecialistaId);
        let evento = await Evento.findByPk(sesion_compra.EventoId);
        let cliente = await Cliente.findByPk(sesion_compra.ClienteId);
        await sendMail({
            asunto: 'Compra de evento en Nativos Tierra',
            nombreDestinatario: especialista?.nombre,
            mailDestinatario: especialista?.email,
            mensaje: `Hola, ${especialista?.nombre} enviamos información del cliente que ha adquirido su evento ${evento.evento}`,
            html: mailCompraEspecialista(especialista, evento, cliente, link),
        })
    } catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
}



















