import jwt from 'jsonwebtoken';
import { Request, Response } from "express";



export const validarJWT = (req:Request,res:Response,next:()=>void)=>{

    const token = req.header('x-token');

    if (!token){
        return res.status(401).json({
            msg:'No viene token en la petición'
        })
    }

    try {

        const {id} = jwt.verify(token,process.env.SECRETPRIVATEKEY||'');      
              

        req.especialistaAutenticado=id;
        next(); 
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:'Token no válido'
        })
    }
    
    
}

