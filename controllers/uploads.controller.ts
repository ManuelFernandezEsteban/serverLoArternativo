import { Request, Response } from "express";


export const cargarArchivo = (req:Request,res:Response)=>{

    const file = req.files?.length;

    res.json({        
        msg:file
    })

}