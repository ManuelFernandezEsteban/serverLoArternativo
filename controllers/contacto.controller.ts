import { Request, Response } from "express";
import { mailConsulta } from "../helpers/plantilla-mail";
import { body } from 'express-validator';
import { sendMail } from "../helpers/send-mail";



export const enviarConsulta = async (req: Request, res: Response) => {

    const {body} = req

    try {

        await sendMail({
            asunto: 'Consulta desde Portal Web Nativos Tierra',
            nombreDestinatario: body.nombre,
            mailDestinatario: `${body.email},${process.env.USER_SMTP}`,
            mensaje: `Hola, ${body.nombre} hemos enviado su consulta`,
            html: mailConsulta(body.nombre,body.mensaje)
        }).then(()=>{
            res.status(200).json({ 
                msg:'mensaje enviado'
            })
        }).catch(()=>{
            res.status(500).json({
                msg:'Error, el mensaje no se ha enviado'
            })
        })

        
    } catch (error) {
        
    }


}