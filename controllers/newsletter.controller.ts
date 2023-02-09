import { Request, Response } from "express";
import NewsLetter from "../models/newsletter";

import { correoConfirmacionSuscripcion } from "../helpers/send-mail";


export const getUserNews = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await NewsLetter.findByPk(id);

        if (user) {
            res.json({
                user
            })
        } else {
            res.status(404).json({
                msg: `No existe un usuario con id ${id}`
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })

    }
}

export const getAllUserNews = async (req: Request, res: Response) => {

    try {
        const users = await NewsLetter.findAll();
        res.json({
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })

    }
}

export const postUserNews = async (req: Request, res: Response) => {

    const {body} = req;
    try {

        const user = NewsLetter.build(body);
        user.save();

        await correoConfirmacionSuscripcion({
            asunto:'Suscripción a newsletter',
            nombreDestinatario:body.nombre,
            mailDestinatario:body.email,
            mensaje:`Hola, ${body.nombre} su suscripción ha sido completada`
        })

        res.json({
            user
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }
}
 
export const deleteUserNews = async (req: Request, res: Response)=>{
    const { id } = req.params;
    try {
        const user = await NewsLetter.findByPk(id);

        if (user) {
            user.destroy();
            res.json({
                user
            })
            
        } else {
            res.status(404).json({
                msg: `No existe un usuario con id ${id}`
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })

    }
}

