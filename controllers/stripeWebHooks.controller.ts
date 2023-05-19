
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
import { mailCompraCliente, mailCompraEspecialista, mailRegistro } from "../helpers/plantilla-mail";
import Server from "../models/server";
import Sesiones_compra_suscripciones from "../models/sesiones_compra_suscripcion";

import Suscripciones from "../models/suscripciones";
import { crearFactura } from "../helpers/crearFacturas";
import Planes from "../models/planes";
import dayjs from 'dayjs';
import { Data } from '../interfaces/checkout-sesion.interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
});

export const stripeWebHooks = async (req: Request, res: Response) => {

    const payload = req.body;
    const firma = req.headers['stripe-signature'];
    try {
        const event = await stripe.webhooks.constructEventAsync(payload, firma!, process.env.STRIPE_WEBHOOK_SECRET!);
        let sesion;
        switch (event.type) {

            case 'checkout.session.completed':
                sesion = event.data.object;
                await onCheckoutSesionComplete(sesion);
                break;
            case 'customer.subscription.deleted':
                sesion = event.data.object;
                await onDeleteSubscription(sesion.id);
                break;
            case 'account.updated':
                sesion = event.data.object;
                break;
            case 'payout.paid':
                sesion = event.data.object;
                break;
            default:
                break;
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

const onDeleteSubscription = async (subscriptionId: string) => {

    try {

        const especialista = await Especialista.findOne({
            where: { token_pago: subscriptionId }
        });
        if (especialista) {

            await borrarCuentaConectada(especialista.dataValues.cuentaConectada);

            const suscripcion = await Suscripciones.destroy({
                where: { EspecialistaId: especialista.dataValues.id }
            })

            especialista.set({ planeId: 0, cuentaConectada: null });

            await especialista.save();
        } else {
            throw new Error(`Error completando cancelación, el especialista no se encuentra`);
        }

    } catch (error) {
        console.log(error);
        throw new Error(`Error completando cancelación ${error}`);
    }

}

const borrarCuentaConectada = async (cuenta: string) => {

    try {
        const deleted = await stripe.accounts.del(cuenta);
        if (deleted) {
            return true;

        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
    }


}



const onCheckoutSesionComplete = async (sesion: any) => {

    const sesionReferenceId = sesion.client_reference_id;
    //console.log('sesion.checkout.complete evento:', sesionReferenceId);

    try {
        const sesion_compra_evento = await Sesiones_compra_eventos.findByPk(sesionReferenceId);

        if (sesion_compra_evento) {
            const evento = await Evento.findByPk(sesion_compra_evento.dataValues.EventoId);
            const cliente = await Cliente.findByPk(sesion_compra_evento.dataValues.ClienteId);
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
                ClienteId: sesion_compra_evento.dataValues.ClienteId,
                EventoId: evento.dataValues.id,
                EspecialistaId: evento.dataValues.EspecialistaId,
                ok_cliente: false,
                ok_especialista: false,
                payment_intent: sesion.payment_intent,
                pagada: false,
                //        token_seguridad:token_seguridad
            });


            console.log('compra por finalizar', compra_por_finalizar.dataValues.id);

            const token = jwt.sign({ sesion_compra: compra_por_finalizar.dataValues.id },
                process.env.SECRETPRIVATEKEY || '',
                { expiresIn: '15d' }
            );
            
            
            await enviarMailCompraCliente(compra_por_finalizar, token);
            await enviarMailCompraEspecialista(compra_por_finalizar, token);

            enviarMensajeWebSocket('sesion_compra_finalizada', sesionReferenceId);
            console.log('sesion' + sesionReferenceId + ' pagada');
            /*  server.io.on('connection', cliente => {
                  console.log('cliente conectado ', cliente.id)
                  cliente.emit('sesion_compra_finalizada evento', sesionReferenceId)
              })*/

        } else {
            const sesion_compra_suscripcion = await Sesiones_compra_suscripciones.findByPk(sesionReferenceId);
            //console.log('sesion.checkout.complete suscripcion:',sesion);
            if (sesion_compra_suscripcion) {// es una suscripcion
                const especialista = await Especialista.findByPk(sesion_compra_suscripcion.dataValues.EspecialistaId);
                if (!especialista) {
                    throw new Error("Error, el especialista no se encuentra")
                }
                const subscription = await stripe.subscriptions.retrieve(sesion.subscription);

                const suscripcionAnterior = await Suscripciones.findOne({ where: { EspecialistaId: especialista.dataValues.id } });

                if (suscripcionAnterior) {
                    //comprobamos si tenía una suscripción anterior, 
                    //si es así cancelamos la antigua y modificamos la tabla
                    //console.log(subscription);                    

                    //cancelamos antigua en stripe
                    try {
                        //cancelamos antigua en stripe
                        await stripe.subscriptions.del(suscripcionAnterior.dataValues.id_stripe_subscription);
                        //modificamos la tabla
                        await suscripcionAnterior.update({
                            EspecialistaId: especialista.dataValues.id,
                            planeId: sesion_compra_suscripcion.dataValues.planeId,
                            id_stripe_subscription: subscription.id
                        });

                    } catch (error) {
                        console.log(error);
                        throw new Error('Error en la sesion de stripe al cancelar la antigua suscripción')
                    }
                } else {//en otro caso creamos un nuevo registro en la tabla suscripciones
                    await Suscripciones.create({
                        EspecialistaId: especialista.dataValues.id,
                        planeId: sesion_compra_suscripcion.dataValues.planeId,
                        id_stripe_subscription: subscription.id
                    });
                    await sendMail({
                        asunto: 'Registro como especialista en el Portal Web Nativos Tierra',
                        nombreDestinatario: especialista.dataValues.nombre,
                        mailDestinatario: especialista.dataValues.email,
                        mensaje: `Hola, ${especialista.dataValues.nombre} su resgistro ha sido completado`,
                        html: mailRegistro(especialista.dataValues.nombre)
                    })
                }
                await especialista.update({
                    stripeId: sesion.customer,
                    planeId: sesion_compra_suscripcion.dataValues.planeId
                });
                const plan = await Planes.findByPk(sesion_compra_suscripcion.dataValues.planeId);
                //crearFacturaSuscripcion(especialista.dataValues.stripeId,0,[plan?.dataValues.priceId]);
                enviarMensajeWebSocket('compra_suscripcion_finalizada', especialista.dataValues.id);
            } else {
                throw new Error('no existe la referencia');
            }
        }
    } catch (error) {
        console.log(error);
        throw new Error(`Error completando sesion ${error}`);

    }
}

const enviarMensajeWebSocket = (tipoMensaje: string, mensaje: string) => {
    const server = Server.instance;
    console.log(tipoMensaje, mensaje);
    server.io.on('connection', cliente => {
        console.log('cliente conectado ', cliente.id)
        cliente.emit(tipoMensaje, mensaje)
    })
}


const enviarMailCompraCliente = async (sesion_compra: any, token: string) => {

    const link = `${process.env.LINK_VERIFICAR_COMPRAS}${token}`;
    try {
        let especialista = await Especialista.findByPk(sesion_compra.EspecialistaId);
        let evento = await Evento.findByPk(sesion_compra.EventoId);
        let cliente = await Cliente.findByPk(sesion_compra.ClienteId);
        await sendMail({
            asunto: 'Compra de evento en Nativos Tierra',
            nombreDestinatario: cliente?.dataValues.nombre,
            mailDestinatario: cliente?.dataValues.email,
            mensaje: `Hola, ${cliente?.dataValues.nombre} enviamos información del evento adquirido`,
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
            nombreDestinatario: especialista?.dataValues.nombre,
            mailDestinatario: especialista?.dataValues.email,
            mensaje: `Hola, ${especialista?.dataValues.nombre} enviamos información del cliente que ha adquirido su evento ${evento.evento}`,
            html: mailCompraEspecialista(especialista, evento, cliente, link),
        })
    } catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
}



















