import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
});

export const crearFactura = async (idStripe:string,days:number=0,precios:string[],descripcion:string)=>{

    if (idStripe) {
        const date = new Date(Date.now());
        console.log(date);
        const factura = await stripe.invoices.create({
            collection_method: 'send_invoice',
            customer: idStripe,
            days_until_due: days,
            description:descripcion,
            automatic_tax: {enabled: true},

        });
        precios.forEach(async precio => {
                const lineaFactura = await stripe.invoiceItems.create({
                customer: idStripe,
                price: precio,
                invoice: factura.id,
                quantity: 1,
            })
        });
        

       await stripe.invoices.finalizeInvoice(factura.id);
       // await stripe.invoices.sendInvoice(factura.id);
        //await stripe.invoices.pay(factura.id);
       console.log(factura.id);
        //return factura.invoice_pdf;
    }

}
/*
export const crearFacturaComision = async (idStripe:string,days:number=0,idPrice:string)=>{

    if (idStripe) {
        const date = new Date(Date.now());
        console.log(date);
        const factura = await stripe.invoices.create({
            collection_method: 'send_invoice',
            customer: idStripe,
            days_until_due: days

        });
        const lineaFactura = await stripe.invoiceItems.create({
            customer: idStripe,
            price: idPrice,
            invoice: factura.id,
            quantity: 1,
        })

        await stripe.invoices.finalizeInvoice(factura.id);
        await stripe.invoices.sendInvoice(factura.id);
    }

}
*/