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
exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const eventos_1 = __importDefault(require("../models/eventos"));
const key = process.env.STRIPE_SECRET_KEY || '';
const stripe = new stripe_1.default('sk_test_51MdWNyH0fhsN0DplHuBpE5C4jNFyPTVJfYz6kxTFeMmaQ94Uqjou6MuH8SwpB82nc56vnTHAyoZjazLTX8Iigk5z000zusfDjr', {
    apiVersion: '2022-11-15'
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = {
        eventoId: req.body.eventoId,
        callbackUrl: req.body.callbackUrl
    };
    const evento = yield eventos_1.default.findByPk(info.eventoId);
    if (evento) {
        try {
            let sesionConfig;
            if (evento.idPriceEvent) {
                sesionConfig = setupCompraDeEvento(info, evento.idPriceEvent);
            }
            //console.log(sesionConfig);
            const sesion = yield stripe.checkout.sessions.create(sesionConfig);
            console.log("Comprando evento con id:", info.eventoId);
            res.status(200).json({
                stripeCheckoutSesionId: sesion.id,
                url: sesion.url,
                stripePublicKey: process.env.STRIPE_PUBLIC_KEY
            });
        }
        catch (error) {
            console.log('Error inesperado durante la compra del curso', error);
            res.status(500).json({
                error: 'No hemos podido iniciar la sesion en stripe para comprar el evento'
            });
        }
    }
});
exports.createCheckoutSession = createCheckoutSession;
const setupCompraDeEvento = (info, price) => {
    const config = setupBaseSesionConfig(info);
    config.line_items = [
        {
            price: price,
            quantity: 1,
        },
    ];
    return config;
};
const setupBaseSesionConfig = (info) => {
    const config = {
        success_url: `${info.callbackUrl}/?resultadoCompra=success`,
        cancel_url: `${info.callbackUrl}/?resultadoCompra=failed`,
        payment_method_types: ['card'],
        mode: 'payment',
    };
    return config;
};
//# sourceMappingURL=checkout.controller.js.map