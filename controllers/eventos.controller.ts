import { Request, Response } from 'express';
import Especialista from '../models/especialista';
import Evento from '../models/eventos';

export const getEvento = async (req: Request, res: Response) => {

    const { id } = req.params;

    const evento = await Evento.findByPk(id);

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
        include:Especialista,
        where:{
            especialistaid:especialista
        }
    });

    res.json({
        eventos
    })

}

