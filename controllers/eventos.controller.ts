import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import Evento from '../models/eventos';
import { createFolder } from '../helpers/createFolder';
import Moneda from '../models/monedas';
import { createPrice, createPriceEvento, createProductEvento, deleteProductEvento, desactivarPrice, updateProductEvento } from '../helpers/createPrice';
import Stripe from "stripe";
import dayjs from 'dayjs';

import Compras_eventos_por_finalizar from '../models/compras_eventos_por_finalizar';
import Cliente from '../models/clientes';
import Suscripciones from '../models/suscripciones';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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

    //console.log(fecha_limite);


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
                PlaneId: { [Op.notIn]: [0,1] }
            },

        }],
        order: [
            ['createdAt', 'ASC'],
        ]
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

    console.log('Post Evento ', body.EspecialistaId);


    if (now > fecha) {
        return res.status(401).json({
            msg: 'Fecha invalida'
        })
    }

    if (body.ActividadeId != 10) { // especialista para publicar eventos nativos tierra y revista

        const suscripcion = await Suscripciones.findOne({
            where: { EspecialistaId: body.EspecialistaId }
        })

        let fecha_inicio_periodo_pago;
        let fecha_fin_periodo_pago;
        if (suscripcion) {
            const suscripcionAStripe = await stripe.subscriptions.retrieve(suscripcion.dataValues.id_stripe_subscription);
            if (suscripcionAStripe.status === 'canceled') {
                return res.status(400).json({
                    error: `El especialista con id ${body.EspecialistaId} no tiene una suscripción activa`
                });
            }
            fecha_fin_periodo_pago = dayjs.unix(suscripcionAStripe.current_period_end).toDate();
            fecha_inicio_periodo_pago = dayjs.unix(suscripcionAStripe.current_period_start).toDate();
            if ((fecha < fecha_inicio_periodo_pago) || (fecha > fecha_fin_periodo_pago)) {
                return res.status(401).json({
                    msg: 'La fecha del evento solo puede estar dentro del periodo de suscripción'
                })
            }
        } else {
            return res.status(400).json({
                error: `El especialista con id ${body.EspecialistaId} no tiene una suscripción activa`
            });
        }

        const { count } = await Evento.findAndCountAll({

            include: [{
                model: Especialista                
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
    if (evento.dataValues.esVendible) {

        const idProductEvent = await createProductEvento(evento);
        console.log(idProductEvent);
        const idPriceEvent = await createPrice(idProductEvent, evento.dataValues.precio, evento.dataValues.monedaId);
        await evento.update({
            idProductEvent,
            idPriceEvent
        })
    }

    try {

        createFolder(`eventos/${evento.dataValues.id}`);
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
                if (!evento.dataValues.idProductEvent){
                    //hay que crear el producto y el precio 
                    const idProductEvent = await createProductEvento(evento);
                    const idPriceEvent = await createPriceEvento(idProductEvent, body.precio, body.monedaId);
                    await evento.update({
                        idProductEvent,
                        idPriceEvent
                    })
                }
                const precioAnterior = evento.dataValues.precio;
                if (precioAnterior != body.precio) {
                    let idPriceEvent = await desactivarPrice(evento.dataValues.idPriceEvent);
                    idPriceEvent = await createPriceEvento(evento.dataValues.idProductEvent, body.precio, body.moneda);
                    await evento.update(
                        { idPriceEvent }
                    )
                    console.log(idPriceEvent)
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

export const getVentasEvento = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {

        const compras_eventos_no_finalizadas = await Compras_eventos_por_finalizar.findAll({
            include: [
                {
                    model: Evento
                },
                {
                    model: Cliente
                }
            ],
            where: {
                EventoId: id
            }
        })

        if (compras_eventos_no_finalizadas.length === 0) {
            return res.status(400).json({
                error: 'No hay ventas para ese evento'
            })
        }
        res.json({
            compras_eventos_no_finalizadas
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'No hay ventas para ese evento'
        })
    }

}