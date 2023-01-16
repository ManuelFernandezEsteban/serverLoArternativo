import { Request,Response } from "express";
import Plan from "../models/planes";

export const getPlan = async (req:Request,res:Response) => {

    const {id}=req.params;
    const plan = await Plan.findByPk(id);
    if (plan){
        res.json({
            plan
        });
    }else{
        res.status(404).json({
            msg:`No existe un plan con id ${id}`
        })

    }
}

export const getPlanes = async (req:Request,res:Response)=>{

    const planes = await Plan.findAll();
    res.json({planes});
}
