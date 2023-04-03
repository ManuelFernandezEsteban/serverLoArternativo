import { Request, Response } from "express";
import Stripe from "stripe";
import Evento from "../models/eventos";


const key = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe('sk_test_51MdWNyH0fhsN0DplHuBpE5C4jNFyPTVJfYz6kxTFeMmaQ94Uqjou6MuH8SwpB82nc56vnTHAyoZjazLTX8Iigk5z000zusfDjr', {
    apiVersion: '2022-11-15'
})


interface RequestInfo {
    eventoId: string;
    callbackUrl: string;
}


export const createCheckoutSession = async (req: Request, res: Response) => {

    const info: RequestInfo = {
        eventoId: req.body.eventoId,
        callbackUrl: req.body.callbackUrl
    }
    
    const evento = await Evento.findByPk(info.eventoId);
    if (evento) {
        try {
            let sesionConfig;
            if (evento.idPriceEvent!=null) {
                sesionConfig = setupCompraDeEvento(info,evento.idPriceEvent);
                
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

const setupCompraDeEvento = (info: RequestInfo,price:string) => {

    console.log(info)
    const config = setupBaseSesionConfig(info);
    config.line_items = [
        {
            price: price,
            quantity: 1,
        },
    ];
    return config;
}

const setupBaseSesionConfig = (info: RequestInfo) => {
    console.log(info)
    const config: any = {
        success_url: `${info.callbackUrl}/?resultadoCompra=success`,
        cancel_url: `${info.callbackUrl}/?resultadoCompra=failed`,
        payment_method_types: ['card'],
        mode: 'payment',
        
    }
    return config;
}

