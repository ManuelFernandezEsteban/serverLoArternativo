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
exports.condicionesAceptada = exports.politicaAceptada = exports.existeEmailNews = exports.planPermitido = exports.planPermitidoEvento = exports.existeUsuario = exports.existeEspecialistaEvento = exports.existeEmail = exports.esPlanValido = exports.esActividadValida = void 0;
const actividades_1 = __importDefault(require("../models/actividades"));
const especialista_1 = __importDefault(require("../models/especialista"));
const newsletter_1 = __importDefault(require("../models/newsletter"));
const planes_1 = __importDefault(require("../models/planes"));
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const suscripciones_1 = __importDefault(require("../models/suscripciones"));
const stripe = new stripe_1.default(process.env.apiKeyStripe || '', { apiVersion: '2022-11-15', });
const esActividadValida = (ActividadeId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const existeActividad = yield actividades_1.default.findByPk(ActividadeId);
    if (!existeActividad) {
        throw new Error('No existe una actividad con id ' + ActividadeId);
    }
});
exports.esActividadValida = esActividadValida;
const esPlanValido = (PlaneId = 0) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* if (isNaN(PlaneId)) {
             throw new Error('No es un plan válido')
         }*/
        const existePlan = yield planes_1.default.findByPk(PlaneId);
        if (!existePlan) {
            throw new Error('No existe un plan con id ' + PlaneId);
        }
    }
    catch (error) {
        throw new Error('No es un plan válido');
    }
});
exports.esPlanValido = esPlanValido;
const existeEmail = (email = '') => __awaiter(void 0, void 0, void 0, function* () {
    const existe = yield especialista_1.default.findOne({
        where: {
            email: email
        }
    });
    if (existe) {
        throw new Error('Ya existe un usuario registrado con el email ' + email);
    }
});
exports.existeEmail = existeEmail;
const existeEspecialistaEvento = (EspecialistaId = '') => __awaiter(void 0, void 0, void 0, function* () {
    const existeEspecialista = yield especialista_1.default.findByPk(EspecialistaId);
    if (!existeEspecialista) {
        throw new Error('No existe un especialista con el id ' + EspecialistaId);
    }
});
exports.existeEspecialistaEvento = existeEspecialistaEvento;
const existeUsuario = (id = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const existeEspecialista = yield especialista_1.default.findByPk(id);
    if (!existeEspecialista) {
        throw new Error('No existe un especialista con el id ' + id);
    }
});
exports.existeUsuario = existeUsuario;
const planPermitidoEvento = (EspecialistaId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.planPermitido)(EspecialistaId);
    /*
        try {
            const idSuscripcion = await Especialista.findByPk(EspecialistaId, {
                attributes: ['token_pago']
            });
            if (idSuscripcion?.dataValues.token_pago != null) {
    
                const suscripcion = await stripe.subscriptions.retrieve(idSuscripcion.dataValues.token_pago);
                const hoy = Date.now();
                const fechaSuscripcionCumplida = dayjs.unix(suscripcion.current_period_end).isBefore(hoy);
                if ((suscripcion.status === 'canceled') && (fechaSuscripcionCumplida)) {
                    throw new Error(`El especilista con id ${EspecialistaId} no tiene un plan permitido fechaFinSuscripcion`)
                }
            } else {
                throw new Error(`El especilista con id ${EspecialistaId} no tiene un plan permitido no existe suscripcion`);
            }
        } catch (error) {
            console.log(error);
        }
    */
});
exports.planPermitidoEvento = planPermitidoEvento;
const planPermitido = (especialista) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(especialista,'plan permitido');
    try {
        const suscripcion = yield suscripciones_1.default.findOne({
            where: { EspecialistaId: especialista }
        });
        if (suscripcion === null || suscripcion === void 0 ? void 0 : suscripcion.dataValues.id_stripe_subscription) {
            const suscripcionStripe = yield stripe.subscriptions.retrieve(suscripcion === null || suscripcion === void 0 ? void 0 : suscripcion.dataValues.id_stripe_subscription);
            if (suscripcionStripe) {
                //const hoy = Date.now();
                //const fechaSuscripcionCumplida = dayjs.unix(suscripcionStripe.current_period_end).isBefore(hoy);
                if (suscripcionStripe.status === 'canceled') {
                    throw new Error(`El especilista con id ${especialista} no tiene una suscripción activa`);
                }
            }
        }
        else {
            throw new Error(`El especilista con id ${especialista} no tiene una suscripcion activa`);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.planPermitido = planPermitido;
/*

export const planPermitido = async (especialista: string) => {
    console.log(especialista,'plan permitido');
    try {
        const idSuscripcion = await Especialista.findByPk(especialista, {
            attributes: ['token_pago']
        });
       
        if (idSuscripcion?.dataValues.token_pago!=null){
            const suscripcion = await stripe.subscriptions.retrieve(idSuscripcion.dataValues.token_pago);
            const hoy = Date.now();
            const fechaSuscripcionCumplida = dayjs.unix(suscripcion.current_period_end).isBefore(hoy);
            if ( (suscripcion.status==='canceled') && (fechaSuscripcionCumplida) ){
                throw new Error(`El especilista con id ${especialista} no tiene un plan permitido fechaFinSuscripcion`)
            }
        }else{
            throw new Error(`El especilista con id ${especialista} no tiene un plan permitido no existe suscripcion`);
        }
    } catch (error) {
        console.log(error);
    }
    
}
*/
const existeEmailNews = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existe = yield newsletter_1.default.findOne({
        where: {
            email: email
        }
    });
    if (existe) {
        throw new Error('Ya existe un usuario registrado con el email ' + email);
    }
});
exports.existeEmailNews = existeEmailNews;
const politicaAceptada = (privacidad) => __awaiter(void 0, void 0, void 0, function* () {
    if (!privacidad) {
        throw new Error('Debe aceptar la política de privacidad');
    }
});
exports.politicaAceptada = politicaAceptada;
const condicionesAceptada = (condiciones) => __awaiter(void 0, void 0, void 0, function* () {
    if (!condiciones) {
        throw new Error('Debe aceptar las condiciones de uso');
    }
});
exports.condicionesAceptada = condicionesAceptada;
//exports = {esActividadValida,esPlanValido}
//# sourceMappingURL=db-validators.js.map