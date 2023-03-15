import { body } from 'express-validator';
import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import NewsLetter from '../models/newsletter';
import Plan from '../models/planes';

export const esActividadValida = async (ActividadeId: number = 0) => {
    const existeActividad = await Actividad.findByPk(ActividadeId);
    if (!existeActividad) {
        throw new Error('No existe una actividad con id ' + ActividadeId)
    }
}

export const esPlanValido = async (PlaneId: number = 0) => {
    try {
        if (isNaN(PlaneId)){
            throw new Error('No es un plan válido')
        }

        const existePlan = await Plan.findByPk(PlaneId);
        console.log(PlaneId)
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

export const planPermitidoEvento = async (EspecialistaId: string='') => {
    const plan = await Especialista.findByPk(EspecialistaId, {
        attributes: ['fecha_fin_suscripcion']
    })
    console.log(EspecialistaId);
    if (!(plan?.dataValues.fecha_fin_suscripcion ) || (plan?.dataValues.fecha_fin_suscripcion<Date.now()) ){

        throw new Error(`El especilista con id ${EspecialistaId} no tiene un plan permitido`);

    }
}


export const planPermitido = async (especialista: string) => {
    const plan = await Especialista.findByPk(especialista, {
        attributes: ['fecha_fin_suscripcion']
    })
    if (!(plan?.dataValues.fecha_fin_suscripcion ) || (plan?.dataValues.fecha_fin_suscripcion<Date.now()) ){

        throw new Error(`El especilista con id ${especialista} no tiene un plan permitido`);


    }
}

export const existeEmailNews = async (email:string)=>{
    const existe = await NewsLetter.findOne({
        where: {
            email: email
        }
    });
    if (existe) {

        throw new Error('Ya existe un usuario registrado con el email ' + email)

    }
}

export const politicaAceptada = async (privacidad:boolean)=>{
    if (!privacidad){
        throw new Error('Debe aceptar la política de privacidad')
    }
}

export const condicionesAceptada = async (condiciones:boolean)=>{
    if (!condiciones){
        throw new Error('Debe aceptar las condiciones de uso')
    }
}


//exports = {esActividadValida,esPlanValido}