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
exports.getHerramientasByActividad = exports.getHerramientasByEspecialista = exports.getEspecialistasByHerramientas = exports.getHerramientaById = void 0;
const herramientas_1 = __importDefault(require("../models/herramientas"));
const usa_herramientas_1 = __importDefault(require("../models/usa_herramientas"));
const especialista_1 = __importDefault(require("../models/especialista"));
const getHerramientaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const herramienta = yield herramientas_1.default.findByPk(id);
    res.json({
        herramienta
    });
});
exports.getHerramientaById = getHerramientaById;
const getEspecialistasByHerramientas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { actividad } = req.params;
    const { herramientas } = req.body;
    try {
        const especialistas = yield especialista_1.default.findAll({
            include: {
                model: usa_herramientas_1.default,
                where: {
                    HerramientaId: herramientas
                }
            },
        });
        res.json({
            especialistas
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error
        });
    }
});
exports.getEspecialistasByHerramientas = getEspecialistasByHerramientas;
const getHerramientasByEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usaHerramientas = yield usa_herramientas_1.default.findAll({
            where: {
                EspecialistaId: id
            },
            include: [{
                    model: herramientas_1.default,
                }]
        });
        res.json({
            usaHerramientas
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error
        });
    }
});
exports.getHerramientasByEspecialista = getHerramientasByEspecialista;
const getHerramientasByActividad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { actividad } = req.params;
    try {
        const herramientas = yield herramientas_1.default.findAll({
            where: {
                ActividadeId: actividad
            },
        });
        res.json({
            herramientas
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error
        });
    }
});
exports.getHerramientasByActividad = getHerramientasByActividad;
//# sourceMappingURL=herramientas.controller.js.map