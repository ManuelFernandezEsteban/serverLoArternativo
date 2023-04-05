import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Compras_eventos_por_finalizar from "../models/compras_eventos_por_finalizar";
import Cliente from "../models/clientes";
import Especialista from '../models/especialista';
import { body } from 'express-validator';

export const validarCompraCliente = async (req: Request, res: Response) => {

    const token = req.header('token');
    const body = req.body;
    if (!token) {
        return res.status(401).json({
            msg: 'No viene token en la petición!'
        })
    }
    try {
        const respuesta = jwt.verify(token, process.env.SECRETPRIVATEKEY!);

        const guarda = respuesta.sesion_compra;
        const sesion_compra = await Compras_eventos_por_finalizar.findByPk(guarda);
        if (!sesion_compra) {
            return res.status(500).json({
                msg: 'No existe la sesion de compra'
            })
        }
        let cliente = await Cliente.findByPk(sesion_compra.ClienteId);

        if (!cliente) {
            return res.status(500).json({
                msg: 'No existe el cliente'
            })
        }

        let clienteBD = await Cliente.findOne({
            where: {
                email: body.email
            }
        })
        if (cliente.id === clienteBD.id) {
            sesion_compra.set({ ok_cliente: true });
            if (sesion_compra.ok_especialista) {
                if (!sesion_compra.pagada) {
                    //pagar(guarda);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado'
            })
        }else {
            return res.status(500).json({
                msg: 'Algo no ha ido bien con su validación'
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo no ha ido bien'
        })
    }

}


export const validarCompraEspecialista = async (req: Request, res: Response) => {
    const token = req.header('token');
    const body = req.body;

    if (!token) {
        return res.status(401).json({
            msg: 'No viene token en la petición!'
        })
    }
    try {
        const respuesta = jwt.verify(token, process.env.SECRETPRIVATEKEY!);
        const guarda = respuesta.sesion_compra;
        const sesion_compra = await Compras_eventos_por_finalizar.findByPk(guarda);
        if (!sesion_compra) {
            return res.status(500).json({
                msg: 'No existe la sesion de compra'
            })
        }

        const especialistaBD = await Especialista.findOne({
            where: {
                email: body.email
            }
        })
        if (!especialistaBD) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            })
        }

        const validPassword = bcrypt.compareSync(body.password, especialistaBD.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            })
        }

        let especialista = await Especialista.findByPk(sesion_compra.EspecialistaId);
        if (!especialista) {
            return res.status(500).json({
                msg: 'No existe el especialista'
            })
        }
        if (especialista.id === especialistaBD.id) {
            sesion_compra.set({ ok_especialista: true });
            if (sesion_compra.ok_cliente) {
                if (!sesion_compra.pagada) {
                    //pagar(guarda);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado'
            })
        } else {
            return res.status(500).json({
                msg: 'Algo no ha ido bien con su validación'
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Algo no ha ido bien'
        })
    }

}