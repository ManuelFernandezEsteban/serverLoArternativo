import { body } from 'express-validator';
import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import NewsLetter from '../models/newsletter';
import Plan from '../models/planes';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
import dayjs, { Dayjs } from 'dayjs';
import Suscripciones from '../models/suscripciones';


const stripe = new Stripe(process.env.apiKeyStripe || '', { apiVersion: '2022-11-15', });

export const esActividadValida = async (ActividadeId: number = 0) => {
    const existeActividad = await Actividad.findByPk(ActividadeId);
    if (!existeActividad) {
        throw new Error('No existe una actividad con id ' + ActividadeId)
    }
}

export const esPlanValido = async (PlaneId: number = 0) => {
    try {
       /* if (isNaN(PlaneId)) {
            throw new Error('No es un plan válido')
        }*/

        const existePlan = await Plan.findByPk(PlaneId);        
        if (!existePlan) {
            throw new Error('No existe un plan con id ' + PlaneId)
        }
    } catch (error) {
        throw new Error('No es un plan válido')
    }

}


export const existeEmail = async (email: string = '') => {

    const existe = await Especialista.findOne({
        where: {
            email: email
        }
    });
    if (existe) {

        throw new Error('Ya existe un usuario registrado con el email ' + email)

    }

}
export const existeEspecialistaEvento = async (EspecialistaId: string = '') => {

    const existeEspecialista = await Especialista.findByPk(EspecialistaId);

    if (!existeEspecialista) {
        throw new Error('No existe un especialista con el id ' + EspecialistaId);

    }
}


export const existeUsuario = async (id: number = 0) => {

    const existeEspecialista = await Especialista.findByPk(id);

    if (!existeEspecialista) {
        throw new Error('No existe un especialista con el id ' + id);

    }
}

export const planPermitidoEvento = async (EspecialistaId: string) => {

    planPermitido(EspecialistaId);
/*
    try {
        const idSuscripcion = await Especialista.findByPk(EspecialistaId, {
            attributes: ['token_pago']
        });
        if (idSuscripcion?.dataValues.token_pago != null) {

            const suscripcion = await stripe.subscriptions.retrieve(idSuscripcion.dataValues.token_pago);
            const hoy = Date.now();
            const fechaSuscripcionCumplida = dayjs.unix(suscripcion.current_period_end).isBefore(hoy);
            if ((suscripcion.status === 'canceled') && (fechaSuscripcionCumplida)) {
                throw new Error(`El especilista con id ${EspecialistaId} no tiene un plan permitido fechaFinSuscripcion`)
            }
        } else {
            throw new Error(`El especilista con id ${EspecialistaId} no tiene un plan permitido no existe suscripcion`);
        }
    } catch (error) {
        console.log(error);
    }
*/
}

export const planPermitido = async (especialista: string) => {
    //console.log(especialista,'plan permitido');
    try {
        const suscripcion = await Suscripciones.findOne({
            where: { EspecialistaId: especialista }
        });

        if (suscripcion?.dataValues.id_stripe_subscription) {
            const suscripcionStripe = await stripe.subscriptions.retrieve(suscripcion?.dataValues.id_stripe_subscription);
            if (suscripcionStripe) {
                //const hoy = Date.now();
                //const fechaSuscripcionCumplida = dayjs.unix(suscripcionStripe.current_period_end).isBefore(hoy);
                if (suscripcionStripe.status === 'canceled')  {
                    throw new Error(`El especilista con id ${especialista} no tiene una suscripción activa`)
                }
            }

        } else {
            throw new Error(`El especilista con id ${especialista} no tiene una suscripcion activa`);
        }
    } catch (error) {
        console.log(error);
    }

}

/*

export const planPermitido = async (especialista: string) => {
    console.log(especialista,'plan permitido');
    try {
        const idSuscripcion = await Especialista.findByPk(especialista, {
            attributes: ['token_pago']
        });
       
        if (idSuscripcion?.dataValues.token_pago!=null){ 
            const suscripcion = await stripe.subscriptions.retrieve(idSuscripcion.dataValues.token_pago);           
            const hoy = Date.now();
            const fechaSuscripcionCumplida = dayjs.unix(suscripcion.current_period_end).isBefore(hoy);
            if ( (suscripcion.status==='canceled') && (fechaSuscripcionCumplida) ){
                throw new Error(`El especilista con id ${especialista} no tiene un plan permitido fechaFinSuscripcion`)
            }               
        }else{
            throw new Error(`El especilista con id ${especialista} no tiene un plan permitido no existe suscripcion`);
        }        
    } catch (error) {
        console.log(error);
    }
    
}
*/
export const existeEmailNews = async (email: string) => {
    const existe = await NewsLetter.findOne({
        where: {
            email: email
        }
    });
    if (existe) {

        throw new Error('Ya existe un usuario registrado con el email ' + email)

    }
}

export const politicaAceptada = async (privacidad: boolean) => {
    if (!privacidad) {
        throw new Error('Debe aceptar la política de privacidad')
    }
}

export const condicionesAceptada = async (condiciones: boolean) => {
    if (!condiciones) {
        throw new Error('Debe aceptar las condiciones de uso')
    }
}


//exports = {esActividadValida,esPlanValido}