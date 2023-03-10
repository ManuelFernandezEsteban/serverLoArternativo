import { Request, Response } from "express";
import Herramientas from '../models/herramientas';
import UsaHerramientas from '../models/usa_herramientas';
import Especialista from '../models/especialista';
import { Op } from "sequelize";

export const getHerramientaById = async (req: Request, res: Response) => {

    const { id } = req.params;


    const herramienta = await Herramientas.findByPk(id)
    res.json({
        herramienta
    })


}


export const getHerramientasByEspecialista = async (req: Request, res: Response) => {

    const { id } = req.params;

    const usaHerramientas = await UsaHerramientas.findAll({
        where:{
            EspecialistaId:id 
        },
        include:[{
            model:Herramientas,            
        }]
    })
    res.json({
        usaHerramientas
    })


}
