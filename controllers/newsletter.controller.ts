import { Request, Response } from "express";
import NewsLetter from "../models/newsletter";
import { sendMail } from "../helpers/send-mail";
import { mailSuscripcion } from '../helpers/plantilla-mail';
import { login } from './auth.controller';



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

    const { body } = req;
    try {
        const user = NewsLetter.build(body);
        user.save();
        await sendMail({
            asunto: 'Suscripción a newsletter',
            nombreDestinatario: body.nombre,
            mailDestinatario: body.email,
            mensaje: `Hola, ${body.nombre} su suscripción ha sido completada`,
            html: mailSuscripcion(body.nombre)
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

export const deleteUserNews = async (req: Request, res: Response) => {
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

