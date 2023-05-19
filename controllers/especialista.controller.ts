import { Request, Response } from "express";
import { Op } from "sequelize";
import Actividades from "../models/actividades";
import Especialista from '../models/especialista';
import Planes from "../models/planes";
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/generar-JWT';
import { createFolder } from '../helpers/createFolder';
import UsaHerramientas from '../models/usa_herramientas';
import dotenv from 'dotenv';
import Stripe from "stripe";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
});



export const getEspecialistasPagination = async (req: Request, res: Response) => {
    const { especialidad } = req.params;
    let { limit = 5, desde = 0 } = req.query;

    if (limit) {
        if (isNaN(parseInt(limit as string))) {
            limit = 5
        }

    }
    if (desde) {
        if (isNaN(parseInt(desde as string))) {
            desde = 0
        }
    }
    const { count, rows } = await Especialista.findAndCountAll({

        attributes: { exclude: ['password'] },
        include: [Actividades, Planes, UsaHerramientas],

        where: {
            actividadeId: especialidad,
            planeId:{[Op.ne]:0}
        },
        order: ['createdAt', 'DESC'],
        group: 'PlaneId',

        offset: Number(desde),
        limit: Number(limit)
    })
    const especialistas = rows;

    res.json({
        especialistas,
        count
    })
}

export const getEspecialistas = async (req: Request, res: Response) => {
    const { especialidad } = req.params;

    const { rows, count } = await Especialista.findAndCountAll({
        
        attributes: { exclude: ['password'] },
        include: [Actividades, Planes, UsaHerramientas],

        where: {
            actividadeId: especialidad,
            planeId:{[Op.ne]:0}

        },
        //group:['planeId']

        order: [
            ['planeId', 'DESC'],
            ['createdAt', 'ASC'],

        ],

    })
    const especialistas = rows;

    res.json({
        especialistas,
        count
    })
}

export const getEspecialista = async (req: Request, res: Response) => {

    const { id } = req.params;


    const especialista = await Especialista.findByPk(id, {

        attributes: { exclude: ['password'] },
        include: [Actividades, Planes, UsaHerramientas],

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
        await especialista.set({ password: bcrypt.hashSync(body.password, salt) })
        await especialista.save();
        
        const token = generarJWT(especialista.dataValues.id);
        const herramientas = body.UsaHerramientas;
        if (herramientas) {
            if (herramientas.length > 0) {
                herramientas.forEach(async (herramienta: any) => {
                    const usaHerrmienta = await UsaHerramientas.create({
                        EspecialistaId: especialista.dataValues.id,
                        HerramientaId: herramienta,
                        ActividadeId: especialista.dataValues.ActividadeId
                    })
                    await especialista.save();
                });
            }
        }
        createFolder(`especialistas/${especialista.dataValues.id}`);
        createFolder(`especialistas/${especialista.dataValues.id}/profile`);       

        res.json({
            token,
            especialista
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

    if (idEspecilistaAutenticado !== id) {
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
            try {
                const herramientasAEliminar = await UsaHerramientas.destroy({
                    where: {
                        EspecialistaId: id
                    }
                })

            } catch (error) {
                console.log(error);
                res.status(500).json({

                    error
                })
            }

            await especialista.update(body)
            await especialista.save();
            const herramientas = body.UsaHerramientas;
            if (herramientas) {
                if (herramientas.length > 0) {
                    herramientas.forEach(async (herramienta: any) => {
                        const usaHerrmienta = await UsaHerramientas.create({
                            EspecialistaId: especialista.dataValues.id,
                            HerramientaId: herramienta,
                            ActividadeId: especialista.dataValues.ActividadeId
                        })
                        await especialista.save();
                    });
                }
            }
            res.json({ especialista });

        } else {

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
    try {
        if (!especialista) {
            return res.status(404).json({
                msg: 'No existe un especialista con el id ' + id
            })
        }

        await especialista.destroy();

        res.json({
            id
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }


}
/*
export const patchEspecialista = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    const { PlaneId } = body;

    try {
        const especialista = await Especialista.findByPk(id);
        if (!especialista) {
            return res.status(404).json({
                msg: 'No existe un especialista con el id ' + id
            })
        } else {
            //Plata
            if (PlaneId === 1) {
                await especialista.update({ PlaneId: PlaneId });

            } else {
                //oro
                let fecha_fin = new Date(Date.now());
                fecha_fin.setMonth(fecha_fin.getMonth() + 1)

                await sendMail({
                    asunto: 'Registro como especialista en el Portal Web Nativos Tierra',
                    nombreDestinatario: especialista.nombre,
                    mailDestinatario: especialista.email,
                    mensaje: `Hola, ${especialista.nombre} su resgistro ha sido completado`,
                    html: mailPlanOro(especialista.nombre)
                })

                await especialista.update({
                    PlaneId: PlaneId,
                    fecha_pago_actual: new Date(Date.now()),
                    fecha_fin_suscripcion: fecha_fin
                })

            }
        }
        res.json({
            especialista
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        })
    }
}
*/
export const crearCuentaConectada = async (req: Request, res: Response) => {

    const { id } = req.params;
    const {callbackUrl} = req.body;
    const link = await crearConnectedAccount(id,callbackUrl);

    res.json({
        link
    })

}


const crearConnectedAccount = async (especialistaId: string,callbackUrl:string) => {
    

    try {
        const especialista = await Especialista.findByPk(especialistaId);
        if (especialista) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'ES',
                email: especialista.dataValues.email,
                capabilities: {
                    card_payments: {
                        requested: true,
                    },
                    transfers: {
                        requested: true,
                    },
                    
                },
                default_currency: 'eur',
            })
            console.log(account.id);
            await especialista.update({cuentaConectada:account.id});
            console.log(especialista.dataValues.id)
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: callbackUrl,
                return_url: callbackUrl,
                type: 'account_onboarding',
            });
            return { accountLink, account: account.id };
        }
    } catch (error) {
        console.log(error);
    }

}

export const getCuentaConectada = async (req: Request, res: Response) => {

    const { id } = req.params;

    if (id) {
        const cuenta = await stripe.accounts.retrieve(id);

        res.json({
            cuenta
        })
    }else{
        return res.status(400).json({
            msg:'No tiene cuenta conectada'
        })
    }




}