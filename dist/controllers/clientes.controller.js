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
exports.getCliente = exports.postCliente = void 0;
const clientes_1 = __importDefault(require("../models/clientes"));
const sesion_compra_evento_1 = __importDefault(require("../models/sesion_compra_evento"));
const postCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        let cliente = yield clientes_1.default.findOne({
            where: {
                email: body.email
            }
        });
        if (!cliente) {
            cliente = yield clientes_1.default.create(body);
        }
        res.status(200).json(cliente);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        });
    }
});
exports.postCliente = postCliente;
const getCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cliente = yield clientes_1.default.findByPk(id, {
        include: [sesion_compra_evento_1.default]
    });
    if (cliente) {
        res.status(200).json(cliente);
    }
    else {
        res.status(400).json({
            msg: `No existe un cliente con id ${id}`
        });
    }
});
exports.getCliente = getCliente;
//# sourceMappingURL=clientes.controller.js.map