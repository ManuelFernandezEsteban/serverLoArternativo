import { Request, Response } from "express";


export const cargarArchivo = (req:Request,res:Response)=>{

    res.json({
        msg:'carga de archivo'
    })

}