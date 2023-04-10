import { Request, Response } from "express";
import Cliente from "../models/clientes";
import Sesiones_compra_eventos from "../models/sesion_compra_evento";
import dotenv from 'dotenv';
import Stripe from "stripe";
dotenv.config();

const key:string = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
})

export const postCliente = async (req:Request,res:Response)=>{

    const {body} =req;

    try{        
        let cliente = await Cliente.findOne({
            where:{
                email:body.email
            }
        })
        if (!cliente){
            const customer = await stripe.customers.create({
                address:{
                    city:body.poblacion,
                    line1:body.direccion,
                    postal_code:body.codigo_postal,
                    state:body.provincia
                },
                email:body.email,
                name:`${body.nombre} ${body.apellidos}`,
                phone:body.telefono,

            });
            console.log(customer);
            cliente = await Cliente.create(body);
            cliente.set({idStripe:customer.id});
            cliente.save();
        }
          
        res.status(200).json(cliente);
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error
        })
    }
 
}

export const getCliente = async (req:Request, res:Response)=>{

    const {id} = req.params;

    
    const cliente = await Cliente.findByPk(id,{
        include:[Sesiones_compra_eventos]
    })
    if (cliente){
        res.status(200).json(cliente);
    }else{
        res.status(400).json({
            msg:`No existe un cliente con id ${id}`
        })
    }

    
}
