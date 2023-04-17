import { Request, Response } from "express";
import Stripe from "stripe";
import Evento from "../models/eventos";
import Sesiones_compra_eventos from "../models/sesion_compra_evento";
import Cliente from "../models/clientes";
import Especialista from "../models/especialista";
import Sesiones_compra_suscripcion from '../models/sesiones_compra_suscripcion';
import Plan from "../models/planes";
import Sesiones_compra_suscripciones from "../models/sesiones_compra_suscripcion";
import dotenv from 'dotenv';
dotenv.config();



const key: string = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
})


interface RequestInfo {
    eventoId: string;
    callbackUrl: string;
    clienteId: string;
    plan: string;
    especialista: string;
}


export const createCheckoutSession = async (req: Request, res: Response) => {

    const info: RequestInfo = {
        eventoId: req.body.eventoId,
        clienteId: req.body.clienteId,
        callbackUrl: req.body.callbackUrl,
        plan: req.body.plan,
        especialista: req.body.especialista
    }

    if (info.eventoId) {
        const evento = await Evento.findByPk(info.eventoId);
        if (evento) {
            try {

                const cliente = await Cliente.findByPk(info.clienteId);
                if (!cliente) {
                    throw new Error("El cliente no existe");
                }

                let sesionConfig;
                const sesion_compra_evento = await Sesiones_compra_eventos.create({
                    ClienteId: info.clienteId,
                    EventoId: info.eventoId,
                    completada: false
                })
                if (evento.idPriceEvent != null) {
                    sesionConfig = setupCompraDeEvento(info, evento.idPriceEvent, sesion_compra_evento.id, cliente.stripeId);

                }
                //console.log(sesionConfig);
                const sesion = await stripe.checkout.sessions.create(sesionConfig);
                sesion_compra_evento.set({ checkout_stripe: sesion.id });
                await sesion_compra_evento.save();
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
    } else if (info.plan) {
        console.log(info)

        try {
            const especialista = await Especialista.findByPk(info.especialista);
            if (!especialista) {
                throw new Error("El especialista no existe");
            }
            const plan = await Plan.findByPk(info.plan);
            if (!plan) {
                throw new Error("El plan no existe");
            }

            let sesionConfig;
            const sesion_compra_suscripcion = await Sesiones_compra_suscripciones.create({
                EspecialistaId: info.especialista,
                planeId: info.plan,
                completada: false,
            })
            let config = setupSuscripcion(info, sesion_compra_suscripcion.id, especialista.stripeId, plan.priceId)
            const sesion = await stripe.checkout.sessions.create(config);
            sesion_compra_suscripcion.set({ checkout_stripe: sesion.id });
            await sesion_compra_suscripcion.save();
            console.log("Iniciando suscripción para especialista:", info.especialista);

            res.status(200).json({
                stripeCheckoutSesionId: sesion.id,
                url: sesion.url,
                stripePublicKey: process.env.STRIPE_PUBLIC_KEY
            })
        } catch (error) {
            console.log('Error inesperado durante la suscripción', error);
            res.status(500).json({
                error: 'No hemos podido iniciar la sesion en stripe para iniciar la suscripción'
            })
        }
    }


}

const setupSuscripcion = (info: RequestInfo, sesion_compra_suscripcion: string, StripeIdEspecialista: string, price: string) => {

    console.log(info, sesion_compra_suscripcion);
    const config = setupBaseSesionConfig(info, sesion_compra_suscripcion, StripeIdEspecialista);
    config.mode = 'subscription';    

    config.subscription_data = {
        items: [{ plan: price }],
        trial_settings: {end_behavior: {missing_payment_method: 'cancel'}},
        trial_period_days: 60,
       

    }
    return config;
}

const setupCompraDeEvento = (info: RequestInfo, price: string, sesion_compra_eventoId: string, clienteStripeId: string) => {

    console.log(info)
    const config = setupBaseSesionConfig(info, sesion_compra_eventoId, clienteStripeId);
    config.line_items = [
        {
            price,
            quantity: 1,
        },
    ];
    return config;
}

const setupBaseSesionConfig = (info: RequestInfo, sesion_compra_eventoId: string, clienteStripeId: string) => {
    console.log(info)
    const config: any = {
        success_url: `${info.callbackUrl}/?resultadoCompra=success&sesion_compra_eventoId=${sesion_compra_eventoId}`,
        cancel_url: `${info.callbackUrl}/?resultadoCompra=failed`,
        payment_method_types: ['card'],
        mode: 'payment',
        client_reference_id: sesion_compra_eventoId
    }
    if (clienteStripeId) {
        config.customer = clienteStripeId;
    }
    return config;
}

