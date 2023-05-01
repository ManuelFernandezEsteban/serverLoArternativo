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
const suscripciones_1 = __importDefault(require("../models/suscripciones"));
const planes_1 = __importDefault(require("../models/planes"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15', });
const getSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const especialista = req.params.id;
    try {
        const suscripcion = yield suscripciones_1.default.findOne({ where: { EspecialistaId: especialista } });
        if (!suscripcion) {
            return res.status(400).json({
                error: 'El especialista no tiene suscripción'
            });
        }
        const subscription = yield stripe.subscriptions.retrieve(suscripcion.dataValues.id_stripe_subscription);
        if (!subscription) {
            return res.status(400).json({
                error: 'No existe esa suscripcion'
            });
        }
        const plan = yield planes_1.default.findByPk(suscripcion.dataValues.planeId);
        const { created, current_period_end, current_period_start, status } = subscription;
        const createdAt = dayjs_1.default.unix(created).toDate();
        const current_period_end_Date = dayjs_1.default.unix(current_period_end).toDate().toLocaleDateString('es-Es');
        const current_period_start_Date = dayjs_1.default.unix(current_period_start).toDate().toLocaleDateString('es-Es');
        const tipoSuscripcion = plan === null || plan === void 0 ? void 0 : plan.dataValues.nombre;
        return res.json({
            createdAt, current_period_end_Date, current_period_start_Date, status, tipoSuscripcion
        });
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
//# sourceMappingURL=subscriptions.controllers.js.map