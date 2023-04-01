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
exports.deleteEvento = exports.putEvento = exports.postEvento = exports.getEventosActividad = exports.getEventosEspecialista = exports.getEvento = void 0;
const sequelize_1 = require("sequelize");
const actividades_1 = __importDefault(require("../models/actividades"));
const especialista_1 = __importDefault(require("../models/especialista"));
const eventos_1 = __importDefault(require("../models/eventos"));
const createFolder_1 = require("../helpers/createFolder");
const monedas_1 = __importDefault(require("../models/monedas"));
const createPrice_1 = require("../helpers/createPrice");
const stripe_1 = __importDefault(require("stripe"));
//import Evento from '../models/eventos';
const stripe = new stripe_1.default('sk_test_51MdWNyH0fhsN0DplHuBpE5C4jNFyPTVJfYz6kxTFeMmaQ94Uqjou6MuH8SwpB82nc56vnTHAyoZjazLTX8Iigk5z000zusfDjr', {
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
        const resultado = yield especialista_1.default.findByPk(body.EspecialistaId, {
            attributes: ['fecha_pago_actual', 'fecha_fin_suscripcion']
        });
        if ((fecha < (resultado === null || resultado === void 0 ? void 0 : resultado.dataValues.fecha_pago_actual)) || (fecha > (resultado === null || resultado === void 0 ? void 0 : resultado.dataValues.fecha_fin_suscripcion))) {
            return res.status(401).json({
                msg: 'La fecha del evento solo puede estar dentro del periodo de suscripción'
            });
        }
        const { count } = yield eventos_1.default.findAndCountAll({
            include: [{
                    model: especialista_1.default,
                    attributes: ['fecha_pago_actual', 'fecha_fin_suscripcion']
                }],
            where: {
                especialistaId: body.EspecialistaId,
                fecha: { [sequelize_1.Op.between]: [resultado === null || resultado === void 0 ? void 0 : resultado.dataValues.fecha_pago_actual, resultado === null || resultado === void 0 ? void 0 : resultado.dataValues.fecha_fin_suscripcion] },
            }
        });
        if (count >= 2) {
            return res.status(401).json({
                msg: 'El especialista ya ha publicado dos eventos este mes'
            });
        }
    }
    try {
        const evento = yield eventos_1.default.create(body);
        const idProductEvent = yield (0, createPrice_1.createProductEvento)(evento);
        console.log(idProductEvent);
        const idPriceEvent = yield (0, createPrice_1.createPriceEvento)(idProductEvent, evento.precio, evento.monedaId);
        yield evento.update({
            idProductEvent,
            idPriceEvent
        });
        (0, createFolder_1.createFolder)(`eventos/${evento.id}`);
        res.json({
            evento
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: error,
            donde: 'folder'
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
            const precioAnterior = evento.precio;
            yield evento.update(body);
            if (precioAnterior != body.precio) {
                const idPriceEvent = yield (0, createPrice_1.createPriceEvento)(evento.idProductEvent, evento.precio, evento.moneda);
                yield evento.update({ idPriceEvent });
            }
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
//# sourceMappingURL=eventos.controller.js.map