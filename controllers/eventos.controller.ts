import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import Evento from '../models/eventos';
import { createFolder } from '../helpers/createFolder';
import Moneda from '../models/monedas';
import { createPriceEvento, createProductEvento, deleteProductEvento, updateProductEvento } from '../helpers/createPrice';
import Stripe from "stripe";
import dayjs from 'dayjs';
//import Evento from '../models/eventos';

const stripe = new Stripe('sk_test_51MdWNyH0fhsN0DplHuBpE5C4jNFyPTVJfYz6kxTFeMmaQ94Uqjou6MuH8SwpB82nc56vnTHAyoZjazLTX8Iigk5z000zusfDjr', {
    apiVersion: '2022-11-15'
})
export const getEvento = async (req: Request, res: Response) => {

    const { id } = req.params;

    const evento = await Evento.findByPk(id, {
        include: [
            {
                model: Especialista,
                attributes: { exclude: ['password'] }
            },
            {
                model: Actividad
            },
            {
                model: Moneda
            }
        ]
    });

    if (evento) {
        res.json({
            evento
        })
    } else {
        res.status(404).json({
            msg: `No existe un evento con id ${id}`
        })
    }

}

export const getEventosEspecialista = async (req: Request, res: Response) => {

    const { especialista } = req.params;

    const eventos = await Evento.findAll({
        where: {
            especialistaid: especialista,
        }
    });

    res.json({
        eventos
    })
}

export const getEventosActividad = async (req: Request, res: Response) => {

    const { actividad } = req.params;
    let { limit = 5, desde = 0 } = req.query;

    if (limit) {
        if (isNaN(parseInt(limit as string))) {
            limit = 5
        }

    }
    if (desde) {
        if (isNaN(parseInt(desde as string))) {
            desde = 0
        }
    }
    const fecha_inicio = new Date(Date.now());
    const fecha_limite = new Date(Date.now());
    fecha_limite.setDate(fecha_limite.getDate() + 15);

    console.log(fecha_limite);


    const { count, rows } = await Evento.findAndCountAll({

        where: {
            actividadeId: actividad,
            fecha: {
                [Op.lte]: fecha_limite,
                [Op.gte]: fecha_inicio
            },


        },
        include: [{
            model: Especialista,
            attributes: { exclude: ['password'] },
            where: {
                PlaneId: 2
            }
        }]

        ,
        limit: Number(limit),
        offset: Number(desde)
    })
    const eventos = rows
    res.json({
        eventos,
        count
    })
}

export const postEvento = async (req: Request, res: Response) => {

    const now = new Date(Date.now());
    const fecha = new Date(req.body.fecha);
    const { body } = req;

    //console.log(body);


    if (now > fecha) {
        return res.status(401).json({
            msg: 'Fecha invalida'
        })
    }

    if (body.ActividadeId != 10) { // especialista para publicar eventos nativos tierra y revista

        const idSuscripcion = await Especialista.findByPk(body.EspecialistaId, {
            attributes: ['token_pago']
        })
        let fecha_inicio_periodo_pago;
        let fecha_fin_periodo_pago;
        if (idSuscripcion) {
            const suscripcion = await stripe.subscriptions.retrieve(idSuscripcion.dataValues.token_pago);
            if ((suscripcion.status === 'active') || (suscripcion.status === 'trialing')) {
                fecha_fin_periodo_pago = dayjs.unix(suscripcion.current_period_end).toDate();
                fecha_inicio_periodo_pago = dayjs.unix(suscripcion.current_period_start).toDate();
                if ((fecha < fecha_inicio_periodo_pago) || (fecha > fecha_fin_periodo_pago)) {
                    return res.status(401).json({
                        msg: 'La fecha del evento solo puede estar dentro del periodo de suscripción'
                    })
                }
            } else {
                throw new Error(`El especilista con id ${body.EspecialistaId} no tiene un plan permitido`);
            }

        } else {
            throw new Error(`El especilista con id ${body.EspecialistaId} no tiene un plan permitido`);
        }

        const { count } = await Evento.findAndCountAll({

            include: [{
                model: Especialista,
                attributes: ['fecha_pago_actual', 'fecha_fin_suscripcion']
            }],
            where: {
                especialistaId: body.EspecialistaId,
                fecha: { [Op.between]: [fecha_inicio_periodo_pago, fecha_fin_periodo_pago] },
            }
        })

        if (count >= 2) {
            return res.status(401).json({
                msg: 'El especialista ya ha publicado dos eventos este mes'
            })
        }
    }
    const evento = await Evento.create(body);
    if (evento.esVendible) {

        const idProductEvent = await createProductEvento(evento);
        console.log(idProductEvent);
        const idPriceEvent = await createPriceEvento(idProductEvent, evento.precio, evento.monedaId);
        await evento.update({
            idProductEvent,
            idPriceEvent
        })
    }

    try {

        createFolder(`eventos/${evento.id}`);
        res.json({
            evento
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error,

        })
    }

}
export const putEvento = async (req: Request, res: Response) => {

    const now = new Date(Date.now());
    const fecha = new Date(req.body.fecha);
    const { id } = req.params;
    const { body } = req;

    if (now > fecha) {
        return res.status(401).json({
            msg: 'Fecha invalida'
        })
    }
    try {

        const evento = await Evento.findByPk(id);

        if (evento) {

            if (body.esVendible) {
                const precioAnterior = evento.precio;
                if (precioAnterior != body.precio  || !(evento.esVendible)) {
                    const idPriceEvent = await createPriceEvento(evento.idProductEvent, evento.precio, evento.moneda);
                    await evento.update(
                        { idPriceEvent }
                    )
                }
            }

            await evento.update(body);

            await updateProductEvento(evento);
            res.json({
                evento
            })
        } else {
            return res.status(404).json({
                msg: `El evento con id ${id} no existe`
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }


}

export const deleteEvento = async (req: Request, res: Response) => {

    const { id } = req.params;

    const evento = await Evento.findByPk(id);

    if (evento) {
        try {
            evento.destroy();
            res.json({
                evento
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg: error
            })
        }

    } else {
        return res.status(404).json({
            msg: `El evento con id ${id} no existe`
        })
    }



}