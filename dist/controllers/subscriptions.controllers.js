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
exports.createSession = exports.customerPortal = exports.webHook = exports.createSubscription = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.apiKeyStripe || '', { apiVersion: '2022-11-15', });
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield stripe.checkout.sessions.create({
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
    res.redirect(session.url || '');
});
exports.createSubscription = createSubscription;
const webHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data;
    let eventType;
    const webHookSecret = process.env.webhook_secret;
    if (webHookSecret) {
        let event;
        let signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(req.body, signature || [], webHookSecret);
        }
        catch (err) {
            console.log('WebHook signature failed');
            return res.status(400);
        }
        data = event.data;
        eventType = req.body.type;
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
});
exports.webHook = webHook;
const customerPortal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    const checkoutSession = yield stripe.checkout.sessions.retrieve(sessionId);
    const returnUrl = process.env.DOMAIN;
    const portalSession = yield stripe.billingPortal.sessions.create({
        customer: checkoutSession.customer,
        return_url: returnUrl
    });
    res.redirect(portalSession.url);
});
exports.customerPortal = customerPortal;
const createSession = (req, res) => {
};
exports.createSession = createSession;
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