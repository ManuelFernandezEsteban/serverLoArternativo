import { Request, Response } from "express";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
import dayjs from 'dayjs';


const stripe = new Stripe(process.env.apiKeyStripe || '', { apiVersion: '2022-11-15', });

export const getSubscription = async (req: Request, res: Response) => {

    const idSubscription = req.params.id;

    try {
        

        const subscription = await stripe.subscriptions.retrieve(
            idSubscription
        );
        const {created, current_period_end,current_period_start,status,items} = subscription;
        const createdAt = dayjs.unix(created).toDate()       
        const current_period_end_Date = dayjs.unix(current_period_end).toDate().toLocaleDateString('es-Es');
        const current_period_start_Date = dayjs.unix(current_period_start).toDate().toLocaleDateString('es-Es');
        const tipoSuscripcion = items.data[0].plan.nickname;

        if (subscription) {
            return res.json({
                createdAt, current_period_end_Date,current_period_start_Date,status,tipoSuscripcion
            })
        }else{
            return res.status(400).json({
                error:'No existe esa suscripcion'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }


}

export const deleteSubscription = async (req: Request, res: Response) => {
    const idSubscription = req.params.id;

    try {
        
        const subscription = await stripe.subscriptions.retrieve(
            idSubscription
        );      

        if (subscription.status==='canceled'){
            
            return res.status(400).json({
                msg:"La suscripción ya está cancelada"
            }) 
        }

        let suscripcionEliminada;
        if (subscription){
            
            suscripcionEliminada = await stripe.subscriptions.update(subscription.id,{
                cancel_at_period_end:true
            });

            //suscripcionEliminada=await stripe.subscriptions.del(subscription.id)


            return res.json({
                suscripcionEliminada
            })
            
        }else{
            res.status(400).json({
                error:"La suscripción no existe"
            })    
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }
}


/*
export const webHook = async (req:Request,res:Response)=>{

    let data;
    let eventType;

    const webHookSecret = process.env.webhook_secret; 
    

    if (webHookSecret){
        let event;
        let signature = req.headers['stripe-signature'];
        try{
            event= stripe.webhooks.constructEvent(req.body,signature||[],webHookSecret);


        }catch(err){
            console.log('WebHook signature failed');
            return res.status(400);
        }
        data=event.data;
        eventType=req.body.type;

    }

    switch (eventType) {
        case 'checkout.session.completed':
             console.log('payment recibed');
            break;
    
        case 'invoice.paid':
            
            break;
        case 'invoice.payment.failed':
            break;
        default:            
    }
    res.sendStatus(200);

}

export const customerPortal = async (req:Request,res:Response)=>{

    const {sessionId} = req.body;
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const returnUrl = process.env.DOMAIN;

    const portalSession = await stripe.billingPortal.sessions.create({
        customer:checkoutSession.customer,
        return_url:returnUrl
    })
    res.redirect(portalSession.url);

}


export const createSession = (req:Request,res:Response)=>{
    
}








/*
    const stripe = new Stripe(process.env.apiKeyStripe||'',{apiVersion: '2022-11-15',});

    const customer = await stripe.customers.create({
        name:req.body.nombre,
        email:req.body.email,
        payment_method: req.body.paymentMethod,
        invoice_settings:{
            default_payment_method:req.body.paymentMethod
        }
    });
    const priceId = req.body.priceId;

    const subscription = await stripe.subscriptions.create({
        customer:customer.id,
        items:[{price:priceId}],
        payment_settings:{
            payment_method_options:{
                card:{
                    request_three_d_secure:'any',
                },
            },
            payment_method_types:['card'],
            save_default_payment_method:'on_subscription'
        },
        expand:['latest_invoice.payment_intent'],

    });   

    res.json({
        clientSecret:subscription.latest_invoice,
        subscriptionId:subscription.id
    })*/


