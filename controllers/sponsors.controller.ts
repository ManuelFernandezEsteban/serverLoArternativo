import { Response,Request } from "express";
import Sponsors from '../models/sponsors';

export const getSponsors= async (req:Request,res:Response)=>{
    
    const {tipo} = req.params;

    const sponsors = await Sponsors.findAll({
        where:{
            tipo:tipo
        }
    })
    res.json({
        sponsors
    })

}

export const getSponsor = async (req:Request,res:Response)=>{

    const { id } = req.params;    

    const sponsor = await Sponsors.findByPk(id);
    if (sponsor) {
        res.json({
            sponsor
        })
    } else {
        res.status(404).json({
            msg: `No existe un sponsor con id ${id}`
        })
    }
    
}
