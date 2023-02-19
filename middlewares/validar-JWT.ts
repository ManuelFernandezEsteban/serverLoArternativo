import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { body } from 'express-validator';



export const validarJWT = (req:Request,res:Response,next:()=>void)=>{

    const token = req.header('x-token'); 
    if (!token){
        return res.status(401).json({
            msg:'No viene token en la petición!'
        })
    }
    try {

        const respuesta = jwt.verify(token,process.env.SECRETPRIVATEKEY!);  

        console.log(respuesta.id);

        req.especialistaAutenticado=respuesta.id;
        
        next(); 
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:'Token no válido'
        })
    }
    
    
}

