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
exports.getVentasEvento = exports.deleteEvento = exports.putEvento = exports.postEvento = exports.getEventosActividad = exports.getEventosEspecialista = exports.getEvento = void 0;
const sequelize_1 = require("sequelize");
const actividades_1 = __importDefault(require("../models/actividades"));
const especialista_1 = __importDefault(require("../models/especialista"));
const eventos_1 = __importDefault(require("../models/eventos"));
const createFolder_1 = require("../helpers/createFolder");
const monedas_1 = __importDefault(require("../models/monedas"));
const createPrice_1 = require("../helpers/createPrice");
const stripe_1 = __importDefault(require("stripe"));
const dayjs_1 = __importDefault(require("dayjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const compras_eventos_por_finalizar_1 = __importDefault(require("../models/compras_eventos_por_finalizar"));
const clientes_1 = __importDefault(require("../models/clientes"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
});
const getEvento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const evento = yield eventos_1.default.findByPk(id, {
        include: [
            {
                model: especialista_1.default,
                attributes: { exclude: ['password'] }
            },
            {
                model: actividades_1.default
            },
            {
                model: monedas_1.default
            }
        ]
    });
    if (evento) {
        res.json({
            evento
        });
    }
    else {
        res.status(404).json({
            msg: `No existe un evento con id ${id}`
        });
    }
});
exports.getEvento = getEvento;
const getEventosEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { especialista } = req.params;
    const eventos = yield eventos_1.default.findAll({
        where: {
            especialistaid: especialista,
        }
    });
    res.json({
        eventos
    });
});
exports.getEventosEspecialista = getEventosEspecialista;
const getEventosActividad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { actividad } = req.params;
    let { limit = 5, desde = 0 } = req.query;
    if (limit) {
        if (isNaN(parseInt(limit))) {
            limit = 5;
        }
    }
    if (desde) {
        if (isNaN(parseInt(desde))) {
            desde = 0;
        }
    }
    const fecha_inicio = new Date(Date.now());
    const fecha_limite = new Date(Date.now());
    fecha_limite.setDate(fecha_limite.getDate() + 15);
    console.log(fecha_limite);
    const { count, rows } = yield eventos_1.default.findAndCountAll({
        where: {
            actividadeId: actividad,
            fecha: {
                [sequelize_1.Op.lte]: fecha_limite,
                [sequelize_1.Op.gte]: fecha_inicio
            },
        },
        include: [{
                model: especialista_1.default,
                attributes: { exclude: ['password'] },
                where: {
                    PlaneId: 2
                }
            }],
        limit: Number(limit),
        offset: Number(desde)
    });
    const eventos = rows;
    res.json({
        eventos,
        count
    });
});
exports.getEventosActividad = getEventosActividad;
const postEvento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date(Date.now());
    const fecha = new Date(req.body.fecha);
    const { body } = req;
    //console.log(body);
    if (now > fecha) {
        return res.status(401).json({
            msg: 'Fecha invalida'
        });
    }
    if (body.ActividadeId != 10) { // especialista para publicar eventos nativos tierra y revista
        const idSuscripcion = yield especialista_1.default.findByPk(body.EspecialistaId, {
            attributes: ['token_pago']
        });
        let fecha_inicio_periodo_pago;
        let fecha_fin_periodo_pago;
        if (idSuscripcion) {
            const suscripcion = yield stripe.subscriptions.retrieve(idSuscripcion.dataValues.token_pago);
            if ((suscripcion.status === 'active') || (suscripcion.status === 'trialing')) {
                fecha_fin_periodo_pago = dayjs_1.default.unix(suscripcion.current_period_end).toDate();
                fecha_inicio_periodo_pago = dayjs_1.default.unix(suscripcion.current_period_start).toDate();
                if ((fecha < fecha_inicio_periodo_pago) || (fecha > fecha_fin_periodo_pago)) {
                    return res.status(401).json({
                        msg: 'La fecha del evento solo puede estar dentro del periodo de suscripción'
                    });
                }
            }
            else {
                throw new Error(`El especilista con id ${body.EspecialistaId} no tiene un plan permitido`);
            }
        }
        else {
            throw new Error(`El especilista con id ${body.EspecialistaId} no tiene un plan permitido`);
        }
        const { count } = yield eventos_1.default.findAndCountAll({
            include: [{
                    model: especialista_1.default,
                    attributes: ['fecha_pago_actual', 'fecha_fin_suscripcion']
                }],
            where: {
                especialistaId: body.EspecialistaId,
                fecha: { [sequelize_1.Op.between]: [fecha_inicio_periodo_pago, fecha_fin_periodo_pago] },
            }
        });
        if (count >= 2) {
            return res.status(401).json({
                msg: 'El especialista ya ha publicado dos eventos este mes'
            });
        }
    }
    const evento = yield eventos_1.default.create(body);
    if (evento.esVendible) {
        const idProductEvent = yield (0, createPrice_1.createProductEvento)(evento);
        console.log(idProductEvent);
        const idPriceEvent = yield (0, createPrice_1.createPriceEvento)(idProductEvent, evento.precio, evento.monedaId);
        yield evento.update({
            idProductEvent,
            idPriceEvent
        });
    }
    try {
        (0, createFolder_1.createFolder)(`eventos/${evento.id}`);
        res.json({
            evento
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error,
        });
    }
});
exports.postEvento = postEvento;
const putEvento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date(Date.now());
    const fecha = new Date(req.body.fecha);
    const { id } = req.params;
    const { body } = req;
    if (now > fecha) {
        return res.status(401).json({
            msg: 'Fecha invalida'
        });
    }
    try {
        const evento = yield eventos_1.default.findByPk(id);
        if (evento) {
            if (body.esVendible) {
                const precioAnterior = evento.precio;
                if (precioAnterior != body.precio || !(evento.esVendible)) {
                    const idPriceEvent = yield (0, createPrice_1.createPriceEvento)(evento.idProductEvent, evento.precio, evento.moneda);
                    yield evento.update({ idPriceEvent });
                }
            }
            yield evento.update(body);
            yield (0, createPrice_1.updateProductEvento)(evento);
            res.json({
                evento
            });
        }
        else {
            return res.status(404).json({
                msg: `El evento con id ${id} no existe`
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error
        });
    }
});
exports.putEvento = putEvento;
const deleteEvento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const evento = yield eventos_1.default.findByPk(id);
    if (evento) {
        try {
            evento.destroy();
            res.json({
                evento
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: error
            });
        }
    }
    else {
        return res.status(404).json({
            msg: `El evento con id ${id} no existe`
        });
    }
});
exports.deleteEvento = deleteEvento;
const getVentasEvento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const compras_eventos_no_finalizadas = yield compras_eventos_por_finalizar_1.default.findAll({
            include: [
                {
                    model: eventos_1.default
                },
                {
                    model: clientes_1.default
                }
            ],
            where: {
                EventoId: id
            }
        });
        if (compras_eventos_no_finalizadas.length === 0) {
            return res.status(400).json({
                error: 'No hay ventas para ese evento'
            });
        }
        res.json({
            compras_eventos_no_finalizadas
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'No hay ventas para ese evento'
        });
    }
});
exports.getVentasEvento = getVentasEvento;
//# sourceMappingURL=eventos.controller.js.map