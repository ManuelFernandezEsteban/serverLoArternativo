import { validationResult } from "express-validator/src/validation-result";
import { Request, Response } from "express";


const validarCampos = (req:Request,res:Response,next: () => void) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors
        })
    }
    next();
}

export {validarCampos}