import { Request, Response } from "express";
import Especialista from "../models/especialista";
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/generar-JWT';
import jwt from 'jsonwebtoken';
import { sendMail } from "../helpers/send-mail";
import { mailRecuperacionPassword } from "../helpers/plantilla-mail";

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        const especialista = await Especialista.findOne({
            where: {
                email: email
            },
            include: [{
                all: true
            }]
        })
        if (!especialista) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            })
        }

        const validPassword = bcrypt.compareSync(password, especialista.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            })
        }

        const token = generarJWT(especialista.id);
        especialista.set({ password: '' });

        res.json({
            especialista,
            token
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

export const renewToken = async (req: Request, res: Response) => {

    const id = req.especialistaAutenticado;

    // Generar el TOKEN - JWT
    try {
        const token = await generarJWT(id);
        const especialista = await Especialista.findByPk(id, {

            attributes: { exclude: ['password'] },

        });


        res.json({
            token,
            especialista
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}
export const forgotPassword = async (req: Request, res: Response) => {

    const { email } = req.body;
    const message: string = "Revisa tu correo, hemos enviado un link para resetar el password";

    let verificationLink: string = '';
    let emailStatus: string = 'OK';
    let token:string='';
    const especialista = await Especialista.findOne({
        where: { email: email }
    });
    if (!especialista) {
        emailStatus = 'error'
        return res.status(400).json({ message,email })
    }
    try {

        token = jwt.sign({ especialistaId: especialista.id },
            process.env.SECRETPRIVATEKEY || '',
            { expiresIn: '10m' })
        verificationLink = `${process.env.LINK}${token}`;

    } catch (error) {
        emailStatus = 'error'
        res.status(400).json({ message })
    }
    //send Mail

    try {
        await sendMail({
            asunto: 'Recuperación password en portal web Nativos Tierra',
            nombreDestinatario: especialista.nombre,
            mailDestinatario: especialista.email,
            mensaje: `Hola, ${especialista.nombre} le enviamos un link para recuperar su contraseña`,
            html: mailRecuperacionPassword(especialista.nombre, verificationLink)
        })
    } catch (error) {
        emailStatus = 'error';
        return res.status(500).json({ message: 'Algo ha ido mal' })

    }

    try {        
        await especialista?.set({resetToken:token})
        await especialista?.save();
        res.json({ message, emailStatus,verificationLink });
    } catch (error) {
        emailStatus = 'error';
        res.status(500).json({ message: 'Algo no ha ido bien' });
    }

    //res.json({ message, emailStatus })

}


export const createNewPassword = async (req: Request, res: Response) => {

    const { password } = req.body;
    const resetToken = req.header('resetToken');

    if (!(resetToken && password)||(resetToken.trim()==='')) {
        return res.status(400).json({
            message: 'Todos los campos son requeridos',           
        })
    }
    let especialista;
    try {

        jwt.verify(resetToken, process.env.SECRETPRIVATEKEY || '');
        especialista = await Especialista.findOne({
            where: { resetToken: resetToken }
        })

    } catch (error) {
        return res.status(500).json({ message: "Algo no ha ido bien" })
    }
    try {
        const salt = bcrypt.genSaltSync();
        await especialista?.set({ password: bcrypt.hashSync(password, salt) })
        await especialista?.save();
        res.json({
            'message': "Contraseña establecida",            
        })
    } catch (error) {
        return res.status(500).json({
            'message':'Algo ha ido mal'
        })
    }




}