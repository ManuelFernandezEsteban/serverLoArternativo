import { Model } from "sequelize";
import Stripe from "stripe";
//import Evento from '../models/eventos';

const stripe = new Stripe('sk_test_51MdWNyH0fhsN0DplHuBpE5C4jNFyPTVJfYz6kxTFeMmaQ94Uqjou6MuH8SwpB82nc56vnTHAyoZjazLTX8Iigk5z000zusfDjr', {
    apiVersion: '2022-11-15'
})

export const createPriceEvento = async (idProductEvent: string, precio: number, moneda: number) => {
    let currency='eur';
    if (moneda===2){
        currency='usd';
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

export const createProductEvento = async (evento: Model): string => {

    try {
        const product = await stripe.products.create({
            name: evento.evento,
            description: evento.descripcion,
            
        });
        return product.id;
    } catch (error) {
        throw new Error('Error al crear el producto para el evento ' + evento.id)
    }
}

export const updateProductEvento = async (evento: Model) => {

    if (evento.idProductEvent) {
        try {
            const existeProd = await stripe.products.retrieve(evento.idProductEvent);
            if (existeProd) {
                const product = await stripe.products.update(
                    evento.idProductEvent,
                    {
                        name: evento.evento,
                        description: evento.descripcion,
                        
                    });
            }

        } catch (error) {
            throw new Error('Error al actualizar el producto evento ' + evento.id)
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

