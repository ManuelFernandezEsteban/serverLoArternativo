import { Request, Response } from "express";
import Especialista from "../models/especialista";
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/generar-JWT';


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

    const  id  = req.especialistaAutenticado;

    // Generar el TOKEN - JWT
    try {
        const token = await generarJWT(id);
        const especialista = await Especialista.findByPk(id,{
      
            attributes:{exclude:['password']},
            
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
