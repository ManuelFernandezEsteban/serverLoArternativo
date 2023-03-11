import { Request, Response } from "express";
import Herramientas from '../models/herramientas';
import UsaHerramientas from '../models/usa_herramientas';
import Especialista from '../models/especialista'; 

export const getHerramientaById = async (req: Request, res: Response) => {

    const { id } = req.params;


    const herramienta = await Herramientas.findByPk(id)
    res.json({
        herramienta
    })


}

export const getEspecialistasByHerramientas = async (req: Request, res: Response) => {
    const { actividad } = req.params;

    const {herramientas} = req.body;

    try {       

        const especialistas= await Especialista.findAll({            
            include:{
                model: UsaHerramientas,
                where:{
                    HerramientaId:herramientas
                }
            }, 
                     
        })
        
        res.json({
            especialistas            
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error
        })        
    }   
}


export const getHerramientasByEspecialista = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
        const usaHerramientas = await UsaHerramientas.findAll({
            where: {
                EspecialistaId: id
            },
            include: [{
                model: Herramientas,
            }]
        })
        res.json({
            usaHerramientas
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error
        })

    }
}

export const getHerramientasByActividad = async (req: Request, res: Response) => {

    const { actividad } = req.params;

    try {
        const herramientas = await Herramientas.findAll({
            where: {
                ActividadeId: actividad
            },
        })
        res.json({
            herramientas
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error
        })

    }
}
