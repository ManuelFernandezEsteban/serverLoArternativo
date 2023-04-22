"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscription = exports.getSubscription = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dayjs_1 = __importDefault(require("dayjs"));
const stripe = new stripe_1.default(process.env.apiKeyStripe || '', { apiVersion: '2022-11-15', });
const getSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSubscription = req.params.id;
    try {
        const subscription = yield stripe.subscriptions.retrieve(idSubscription);
        const { created, current_period_end, current_period_start, status, items } = subscription;
        const createdAt = dayjs_1.default.unix(created).toDate();
        const current_period_end_Date = dayjs_1.default.unix(current_period_end).toDate().toLocaleDateString('es-Es');
        const current_period_start_Date = dayjs_1.default.unix(current_period_start).toDate().toLocaleDateString('es-Es');
        const tipoSuscripcion = items.data[0].plan.nickname;
        if (subscription) {
            return res.json({
                createdAt, current_period_end_Date, current_period_start_Date, status, tipoSuscripcion
            });
        }
        else {
            return res.status(400).json({
                error: 'No existe esa suscripcion'
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        });
    }
});
exports.getSubscription = getSubscription;
const deleteSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSubscription = req.params.id;
    try {
        const subscription = yield stripe.subscriptions.retrieve(idSubscription);
        if (subscription.status === 'canceled') {
            return res.status(400).json({
                msg: "La suscripción ya está cancelada"
            });
        }
        let suscripcionEliminada;
        if (subscription) {
            suscripcionEliminada = yield stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: true
            });
            //suscripcionEliminada=await stripe.subscriptions.del(subscription.id)
            return res.json({
                suscripcionEliminada
            });
        }
        else {
            res.status(400).json({
                error: "La suscripción no existe"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        });
    }
});
exports.deleteSubscription = deleteSubscription;
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
//# sourceMappingURL=subscriptions.controllers.js.map