import { Request, Response } from 'express';
import { Model } from 'sequelize';
import Actividad from '../models/actividades';
import Especialista from '../models/especialista';
import Evento from '../models/eventos';

export const getEvento = async (req: Request, res: Response) => {

    const { id } = req.params;

    const evento = await Evento.findByPk(id,{
        include:[
            {
                model:Especialista,
                attributes:{exclude:['password']}
            },
            {
                model:Actividad
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
        include:[ Especialista,Actividad],
        where:{
            especialistaid:especialista
        }
    });

    res.json({
        eventos
    })

}

