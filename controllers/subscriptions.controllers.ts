import { Request, Response } from "express";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
import dayjs from 'dayjs';
import Suscripciones from "../models/suscripciones";
import Plan from "../models/planes";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15', });

export const getSubscription = async (req: Request, res: Response) => {

    const especialista = req.params.id;

    try {

        const suscripcion = await Suscripciones.findOne({ where: { EspecialistaId: especialista } })

        if (!suscripcion) {
            return res.status(400).json({
                error: 'El especialista no tiene suscripción'
            })
        }
        const subscription = await stripe.subscriptions.retrieve(
            suscripcion.dataValues.id_stripe_subscription
        );

        if (!subscription) {
            return res.status(400).json({
                error: 'No existe esa suscripcion'
            })
        }
        const plan = await Plan.findByPk(suscripcion.dataValues.planeId);
        const { created, current_period_end, current_period_start, status} = subscription;
        const createdAt = dayjs.unix(created).toDate()
        const current_period_end_Date = dayjs.unix(current_period_end).toDate().toLocaleDateString('es-Es');
        const current_period_start_Date = dayjs.unix(current_period_start).toDate().toLocaleDateString('es-Es');
        const tipoSuscripcion = plan?.dataValues.nombre;
        return res.json({
            createdAt, current_period_end_Date, current_period_start_Date, status, tipoSuscripcion
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }


}

export const deleteSubscription = async (req: Request, res: Response) => {
    const idSubscription = req.params.id;

    try {

        const subscription = await stripe.subscriptions.retrieve(
            idSubscription
        );

        if (subscription.status === 'canceled') {

            return res.status(400).json({
                msg: "La suscripción ya está cancelada"
            })
        }

        let suscripcionEliminada;
        if (subscription) {

            suscripcionEliminada = await stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: true
            });

            return res.json({
                suscripcionEliminada
            })

        } else {
            res.status(400).json({
                error: "La suscripción no existe"
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }
}
