import { Request, Response } from "express";
import Stripe from "stripe";
import Evento from "../models/eventos";
import Sesiones_compra_eventos from "../models/sesion_compra_evento";
import dotenv from 'dotenv';
dotenv.config();



const key:string = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
})


interface RequestInfo {
    eventoId: string;
    callbackUrl: string;
    clienteId:string;
}


export const createCheckoutSession = async (req: Request, res: Response) => {

    const info: RequestInfo = {
        eventoId: req.body.eventoId,
        clienteId:req.body.clienteId,
        callbackUrl: req.body.callbackUrl
    }
    
    const evento = await Evento.findByPk(info.eventoId);
    if (evento) {
        try {
            let sesionConfig;
            const sesion_compra_evento = await Sesiones_compra_eventos.create({
                ClienteId:info.clienteId,
                EventoId:info.eventoId,
                completada:false                                
            })  
            if (evento.idPriceEvent!=null) {
                sesionConfig = setupCompraDeEvento(info,evento.idPriceEvent,sesion_compra_evento.id);
                
            }   
            //console.log(sesionConfig);
            const sesion = await stripe.checkout.sessions.create(sesionConfig);
                      
            console.log("Comprando evento con id:", info.eventoId);

            res.status(200).json({
                stripeCheckoutSesionId: sesion.id,
                url: sesion.url,
                stripePublicKey: process.env.STRIPE_PUBLIC_KEY
            })
        } catch (error) {
            console.log('Error inesperado durante la compra del curso', error);
            res.status(500).json({
                error: 'No hemos podido iniciar la sesion en stripe para comprar el evento'
            })
        }
    }

}

const setupCompraDeEvento = (info: RequestInfo,price:string,sesion_compra_eventoId:string) => {

    console.log(info)
    const config = setupBaseSesionConfig(info,sesion_compra_eventoId);
    config.line_items = [
        {
            price: price,
            quantity: 1,
        },
    ];
    return config;
}

const setupBaseSesionConfig = (info: RequestInfo,sesion_compra_eventoId:string) => {
    console.log(info)
    const config: any = {
        success_url: `${info.callbackUrl}/?resultadoCompra=success&sesion_compra_eventoId=${sesion_compra_eventoId}`,
        cancel_url: `${info.callbackUrl}/?resultadoCompra=failed`,
        payment_method_types: ['card'],
        mode: 'payment',
        client_reference_id:sesion_compra_eventoId
    }
    return config;
}

