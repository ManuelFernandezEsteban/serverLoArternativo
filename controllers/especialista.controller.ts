import { Request, Response } from "express";
import { Op } from "sequelize";
import Actividad from "../models/actividades";
import Especialista from "../models/especialista";
import Plan from "../models/planes";
import bcrypt from 'bcryptjs';




export const getEspecialistas = async (req: Request, res: Response) => {
    const { especialidad } = req.params;

    const especialistas = await Especialista.findAll({
       include:[Actividad,Plan],
       where:{
        actividadeId:especialidad
       },
       
    })

    res.json({
        especialistas
    })
}

export const getEspecialista = async (req: Request, res: Response) => {

    const { id } = req.params; 
    /*
        const especialista = await Especialista.findOne({
            where:{
                id:id
            }
        }) */

    const especialista = await Especialista.findByPk(id);
    if (especialista) {
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

        const existeEmail = await Especialista.findOne({
            where: {
                email: body.email
            }
        });
        if (existeEmail) {
            return res.status(400).json({
                msg: 'Ya existe un especialista con el email ' + body.email
            })
        }
        //Encriptar contraseña y guardar especialista
        const salt = bcrypt.genSaltSync();      
        const especialista = Especialista.build(body);
        especialista.set({password:bcrypt.hashSync(body.password,salt)})
        await especialista.save();
        res.json(especialista);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }


}

export const putEspecialista = async (req: Request, res: Response) => {

    const { body } = req;
    const { id } = req.params

    try {

        const especialista = await Especialista.findByPk(id);

        if (!especialista) {
            return res.status(404).json({
                msg: 'No existe un especialista con el id ' + id
            })
        }
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
        res.json(especialista);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }
}

export const deleteEspecialista = async (req: Request, res: Response) => {

    const { id } = req.params;
    const especialista = await Especialista.findByPk(id);

    if (!especialista) {
        return res.status(404).json({
            msg: 'No existe un especialista con el id ' + id
        })
    }
    //eliminacion logica
    //await especialista.update( { estado: false });
    //eliminacion fisica
    await especialista.destroy();

    res.json({
        msg: 'deleteEspecialista',
        id
    })
}