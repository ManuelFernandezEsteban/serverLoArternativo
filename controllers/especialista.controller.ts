import { Request, Response } from "express";
import { Op } from "sequelize";
import Actividad from "../models/actividades";
import Especialista from '../models/especialista';
import Plan from "../models/planes";
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/generar-JWT';
 



export const getEspecialistas = async (req: Request, res: Response) => {
    const { especialidad } = req.params;
    let { limit = 5, desde = 0 } = req.query;

    if (limit){
        if (isNaN(parseInt(limit as string))){
            limit=5
        }       
         
    }
    if (desde){
        if (isNaN(parseInt(desde as string))){
            desde=0
        }
    }
    const { count, rows } = await Especialista.findAndCountAll({
        attributes:{exclude:['password']},
        include: [Actividad, Plan],

        where: {
            actividadeId: especialidad
        },
        offset: Number(desde),
        limit: Number(limit)
    })
    const especilistas = rows;

    res.json({        
        especilistas,
        count 
    })
}

export const getEspecialista = async (req: Request, res: Response) => {

    const { id } = req.params;
    const especialista = await Especialista.findByPk(id,{
        attributes:{exclude:['password']}
    });

    if (especialista) {
        //especialista.set({password:''});
        res.json({
            especialista
        })
    } else {
        res.status(404).json({
            msg: `No existe un usuario con id ${id}`
        })
    }


}

export const postEspecialista = async (req: Request, res: Response) => {

    const { body } = req;

    try {
        //Encriptar contraseña y guardar especialista
        const salt = bcrypt.genSaltSync();
        const especialista = await Especialista.create(body);
        especialista.set({ password: bcrypt.hashSync(body.password, salt) })
        await especialista.save();
        especialista.set({ password:''})
        const token= generarJWT(especialista.id);
        
        res.json({
            especialista,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }


}

export const putEspecialista = async (req: Request, res: Response) => {

    const { body } = req;
    const { id } = req.params;
    const idEspecilistaAutenticado = req.especialistaAutenticado;   

    if (idEspecilistaAutenticado!==id){
        return res.status(500).json({ 
            msg: 'El token no es válido',
        })
    }


    try {

        const especialista = await Especialista.findByPk(id);
        if (especialista) {
            if (body.email) {
                const existeEmail = await Especialista.findOne({
                    where: {
                        email: body.email,
                        [Op.not]: {
                            id: id
                        }
                    }
                });
                if (existeEmail) {
                    return res.status(400).json({
                        msg: 'Ya existe un especialista con el email ' + body.email
                    })
                }

            }

            await especialista.update(body);
            if (body.password) {
                const salt = bcrypt.genSaltSync();
                await especialista.update({ password: bcrypt.hashSync(body.password, salt) });
            }
            especialista.set({ password: '' });
            res.json({especialista});

        }else{
            return res.status(404).json({
                msg: `El id ${id} no se encuentra en la BD`
            })
        }

    }

    catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: error,
        })
    }
}

export const deleteEspecialista = async (req: Request, res: Response) => {

    //soft delete

    const { id } = req.params;
    const especialista = await Especialista.findByPk(id);

    if (!especialista) {
        return res.status(404).json({
            msg: 'No existe un especialista con el id ' + id
        })
    }

    await especialista.destroy();

    res.json({        
        id
    })
} 