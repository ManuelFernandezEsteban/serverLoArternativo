import { Model } from "sequelize";
import Stripe from "stripe";
//import Evento from '../models/eventos';
import dotenv from 'dotenv';
dotenv.config();

const key: string = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
})

export const createPriceEvento = async (idProductEvent: string, precio: number, moneda: number) => {
    let currency = 'eur';
    if (moneda === 2) {
        currency = 'usd';
    }
    try {
        const price = await stripe.prices.create({
            unit_amount: precio * 100,
            currency,
            product: idProductEvent
        })
        return price.id;
    } catch (error) {
        console.log(error)
    }
}

export const createProductEvento = async (evento: Model): Promise<string> => {

    let image = evento.dataValues.imagen;
    if (!image) {
        image = process.env.noHayImagenEvento
    }
    console.log(image);
    try {
        const product = await stripe.products.create({
            name: evento.dataValues.evento,
            description: evento.dataValues.descripcion,
            images: [image]
        });
        return product.id;
    } catch (error) {
        throw new Error('Error al crear el producto para el evento ' + evento.dataValues.id)
    }
}

export const updateProductEvento = async (evento: Model) => {
    let image = evento.dataValues.imagen;
    if (image===null) {
        image = process.env.noHayImagenEvento
    }

    console.log(image);
    if (evento.dataValues.idProductEvent) {
        try {
            const existeProd = await stripe.products.retrieve(evento.dataValues.idProductEvent);
            if (existeProd) {
                
                const product = await stripe.products.update(
                    evento.dataValues.idProductEvent,
                    {
                        name: evento.dataValues.evento,
                        description: evento.dataValues.descripcion,
                        images:[image]
                    });
            }

        } catch (error) {
            throw new Error(`Error al actualizar el producto evento ${evento.dataValues.id}`)
        }
    }

}

export const deleteProductEvento = async (idProductEvento: string) => {

    if (idProductEvento) {
        console.log(idProductEvento)
        try {
            const existeProd = await stripe.products.retrieve(idProductEvento);
            if (existeProd) {

                const product = await stripe.products.del(
                    idProductEvento
                );
            }


        } catch (error) {
            throw new Error('Error al eliminar el producto evento ' + idProductEvento)
        }
    }


}

