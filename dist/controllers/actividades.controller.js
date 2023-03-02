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
exports.getActividades = exports.getActividad = void 0;
const sequelize_1 = require("sequelize");
const actividades_1 = __importDefault(require("../models/actividades"));
const categorias_actividades_1 = __importDefault(require("../models/categorias_actividades"));
const getActividad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const actividad = yield actividades_1.default.findByPk(id);
    if (actividad) {
        res.json({
            actividad
        });
    }
    else {
        res.status(404).json({
            msg: `No existe una actividad con el id ${id}`
        });
    }
});
exports.getActividad = getActividad;
const getActividades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const actividades = yield actividades_1.default.findAll({
        include: [
            {
                model: categorias_actividades_1.default
            }
        ],
        where: {
            id: { [sequelize_1.Op.not]: 10 }
        }
    });
    res.json({
        actividades
    });
});
exports.getActividades = getActividades;
//# sourceMappingURL=actividades.controller.js.map