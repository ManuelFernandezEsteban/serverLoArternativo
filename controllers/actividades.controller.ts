import { Request, Response } from "express";
import { Op } from "sequelize";
import Actividad from "../models/actividades";
import Categoria_actividad from "../models/herramientas";

export const getActividad = async (req:Request,res:Response)=>{

    const {id} = req.params;
    const actividad = await Actividad.findByPk(id);
    if (actividad){
        res.json({
            actividad 
        })
    }else{
        res.status(404).json({
            msg:`No existe una actividad con el id ${id}`            
        })
    }
}

export const getActividades = async(req:Request,res:Response)=>{
    
    const actividades = await Actividad.findAll(
        {
            include:[
                {
                    model:Categoria_actividad
                }
            ],
            
            where:
                {
                    id:{[Op.not]:10}        
                }
        }
    );
    res.json({
        actividades  
    })
}
 