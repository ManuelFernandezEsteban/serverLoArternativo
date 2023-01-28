import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import Evento from '../models/eventos';

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

    const fecha_limite = new Date(Date.now());
    fecha_limite.setDate(fecha_limite.getDate() + 15);

    console.log(fecha_limite);


    const { count, rows } = await Evento.findAndCountAll({

        where: {
            actividadeId: actividad,
            fecha: { [Op.lte]: fecha_limite }
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

    if (now > fecha) {
        return res.status(401).json({
            msg: 'Fecha invalida'
        })
    }

    const resultado = await Especialista.findByPk(body.EspecialistaId, {
        attributes: ['fecha_pago_actual', 'fecha_fin_suscripcion']
    })


    const { count } = await Evento.findAndCountAll({

        include: [{
            model: Especialista,
            attributes: ['fecha_pago_actual', 'fecha_fin_suscripcion']
        }],
        where: {
            especialistaId: body.EspecialistaId,
            fecha: { [Op.between]: [resultado?.dataValues.fecha_pago_actual, resultado?.dataValues.fecha_fin_suscripcion] },
        }
    })

    if (count >= 2) {
        return res.status(401).json({
            msg: 'El especialista ya ha publicado dos eventos este mes'
        })
    }

    try {

        const evento = await Evento.create(body);
        res.json({
            evento
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error
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

            await evento.update(body);

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