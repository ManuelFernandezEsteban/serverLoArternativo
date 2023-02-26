import { Request, Response } from "express";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.apiKeyStripe||'',{apiVersion: '2022-11-15',});

export const createSubscription = async (req:Request,res:Response)=>{

    

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: process.env.PRICE_ID || '',
                quantity: 1,
            }
        ],
        mode: 'subscription',
        success_url: 'http://localhost:4200/succes.html',
        cancel_url: 'http://localhost:4200/cancel.html'
    });    
    res.redirect( session.url||'');
}

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


