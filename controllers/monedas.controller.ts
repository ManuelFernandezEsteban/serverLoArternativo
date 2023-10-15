import { Request, Response } from "express";
import Monedas from "../models/monedas";

export const getMonedas = async (req: Request, res: Response) => {

    try {
        const monedas = await Monedas.findAll();
        res.json({
            monedas
        })
    } catch (error) {
        return res.status(500).json({
            error
        })

    }


}
