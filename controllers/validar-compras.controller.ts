import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Compras_eventos_por_finalizar from "../models/compras_eventos_por_finalizar";
import Cliente from "../models/clientes";
import Especialista from '../models/especialista';
import dotenv from 'dotenv';
import Stripe from "stripe";
import Evento from "../models/eventos";
import Moneda from "../models/monedas";
import { sendMail } from "../helpers/send-mail";
import { mailTransferenciaEspecialista } from "../helpers/plantilla-mail";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
});
export const validarCompraCliente = async (req: Request, res: Response) => {

    const token = req.header('token');
    const body = req.body;
    if (!token) {
        return res.status(401).json({
            msg: 'No viene token en la petición!'
        })
    }
    try {
        const respuesta = jwt.verify(token, process.env.SECRETPRIVATEKEY!);

        const guarda = respuesta.sesion_compra;
        const sesion_compra = await Compras_eventos_por_finalizar.findByPk(guarda);
        if (!sesion_compra) {
            return res.status(500).json({
                msg: 'No existe la sesion de compra'
            })
        }
        let cliente = await Cliente.findByPk(sesion_compra.dataValues.ClienteId);

        if (!cliente) {
            return res.status(500).json({
                msg: 'No existe el cliente'
            })
        }

        let clienteBD = await Cliente.findOne({
            where: {
                email: body.email
            }
        })
        if (cliente.dataValues.id === clienteBD?.dataValues.id) {
            sesion_compra.set({ ok_cliente: true });
            let transfer;
            if (sesion_compra.dataValues.ok_especialista) {
                if (!sesion_compra.dataValues.pagada) {
                    transfer = await pagar(sesion_compra);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado',
                transfer
            })
        } else {
            return res.status(500).json({
                msg: 'Algo no ha ido bien con su validación'
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo no ha ido bien'
        })
    }

}


export const validarCompraEspecialista = async (req: Request, res: Response) => {
    const token = req.header('token');
    const body = req.body;

    if (!token) {
        return res.status(401).json({
            msg: 'No viene token en la petición!'
        })
    }
    try {
        const respuesta = jwt.verify(token, process.env.SECRETPRIVATEKEY!);
        const guarda = respuesta.sesion_compra;
        const sesion_compra = await Compras_eventos_por_finalizar.findByPk(guarda);
        if (!sesion_compra) {
            return res.status(500).json({
                msg: 'No existe la sesion de compra'
            })
        }

        const especialistaBD = await Especialista.findOne({
            where: {
                email: body.email
            }
        })
        if (!especialistaBD) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            })
        }

        const validPassword = bcrypt.compareSync(body.password, especialistaBD.dataValues.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            })
        }

        let especialista = await Especialista.findByPk(sesion_compra.dataValues.EspecialistaId);
        if (!especialista) {
            return res.status(500).json({
                msg: 'No existe el especialista'
            })
        }
        if (especialista.dataValues.id === especialistaBD.dataValues.id) {
            sesion_compra.set({ ok_especialista: true });
            let transfer;
            if (sesion_compra.dataValues.ok_cliente) {
                if (!sesion_compra.dataValues.pagada) {
                    transfer =  await pagar(sesion_compra);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado',
                transfer
            })
        } else {
            return res.status(500).json({
                msg: 'Algo no ha ido bien con su validación'
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo no ha ido bien'
        })
    }

}

const pagar = async (sesion_compra: any) => {

    try {
        const evento = await Evento.findByPk(sesion_compra.EventoId);
        const especialista = await Especialista.findByPk(sesion_compra.EspecialistaId);
        if (!especialista){
            return new Error('El especialista no existe');
        }
        if (!evento){
            return new Error('El evento no existe');
        }
        
        const moneda = await Moneda.findByPk(evento.dataValues.monedaId);
        if (!moneda){ 
            return new Error('La moneda no existe');
        }
        //TODO: calcular comisión en función del tipo de suscripción

        const comisiones = [5,10]

        const amount=evento.dataValues.precio*100 * (1-(comisiones[especialista.dataValues.PlaneId-1]/100));
        const transfer = await stripe.transfers.create({
            amount,
            currency: moneda.dataValues.moneda,
            destination: especialista.dataValues.cuentaConectada,
            description:sesion_compra.payment_intent,
        
        });
        enviarMailPagoEspecialista(sesion_compra,amount,moneda.dataValues.moneda);
        return transfer;
    } catch (error) {
        console.log(error);
    }

}

const enviarMailPagoEspecialista = async (sesion:any,amount:number,moneda:string) => {
    
    try {
        let especialista = await Especialista.findByPk(sesion.EspecialistaId);
        let evento = await Evento.findByPk(sesion.EventoId);
        let cliente = await Cliente.findByPk(sesion.ClienteId);
        if (!especialista){
            return new Error('El especialista no existe');
        }
        if (!evento){
            return new Error('El evento no existe');
        }
        await sendMail({
            asunto: `Pago venta del evento ${evento.dataValues.evento}`,
            nombreDestinatario: especialista.dataValues.nombre,
            mailDestinatario: especialista.dataValues.email,
            mensaje: `Hola, ${especialista?.dataValues.nombre}, hemos procedido a realizar la transferencia del importe de la venta del ${evento.dataValues.evento} a su cuenta.`,
            html: mailTransferenciaEspecialista(especialista, evento,cliente,amount,moneda),
        })
    } catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
}
