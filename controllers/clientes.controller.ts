import { Request, Response } from "express";
import Cliente from "../models/clientes";
import Sesiones_compra_eventos from "../models/sesion_compra_evento";

export const postCliente = async (req:Request,res:Response)=>{

    const {body} =req;

    try{        
        let cliente = await Cliente.findOne({
            where:{
                email:body.email
            }
        })
        if (!cliente){
            cliente = await Cliente.create(body);            
        }
        res.status(200).json(cliente);
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error
        })
    }
 
}

export const getCliente = async (req:Request, res:Response)=>{

    const {id} = req.params;

    
    const cliente = await Cliente.findByPk(id,{
        include:[Sesiones_compra_eventos]
    })
    if (cliente){
        res.status(200).json(cliente);
    }else{
        res.status(400).json({
            msg:`No existe un cliente con id ${id}`
        })
    }

    
}
