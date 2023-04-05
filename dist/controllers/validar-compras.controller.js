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
exports.validarCompraEspecialista = exports.validarCompraCliente = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const compras_eventos_por_finalizar_1 = __importDefault(require("../models/compras_eventos_por_finalizar"));
const clientes_1 = __importDefault(require("../models/clientes"));
const especialista_1 = __importDefault(require("../models/especialista"));
const validarCompraCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('token');
    const body = req.body;
    if (!token) {
        return res.status(401).json({
            msg: 'No viene token en la petición!'
        });
    }
    try {
        const respuesta = jsonwebtoken_1.default.verify(token, process.env.SECRETPRIVATEKEY);
        const guarda = respuesta.sesion_compra;
        const sesion_compra = yield compras_eventos_por_finalizar_1.default.findByPk(guarda);
        if (!sesion_compra) {
            return res.status(500).json({
                msg: 'No existe la sesion de compra'
            });
        }
        let cliente = yield clientes_1.default.findByPk(sesion_compra.ClienteId);
        if (!cliente) {
            return res.status(500).json({
                msg: 'No existe el cliente'
            });
        }
        let clienteBD = yield clientes_1.default.findOne({
            where: {
                email: body.email
            }
        });
        if (cliente.id === clienteBD.id) {
            sesion_compra.set({ ok_cliente: true });
            if (sesion_compra.ok_especialista) {
                if (!sesion_compra.pagada) {
                    //pagar(guarda);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado'
            });
        }
        else {
            return res.status(500).json({
                msg: 'Algo no ha ido bien con su validación'
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo no ha ido bien'
        });
    }
});
exports.validarCompraCliente = validarCompraCliente;
const validarCompraEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('token');
    const body = req.body;
    if (!token) {
        return res.status(401).json({
            msg: 'No viene token en la petición!'
        });
    }
    try {
        const respuesta = jsonwebtoken_1.default.verify(token, process.env.SECRETPRIVATEKEY);
        const guarda = respuesta.sesion_compra;
        const sesion_compra = yield compras_eventos_por_finalizar_1.default.findByPk(guarda);
        if (!sesion_compra) {
            return res.status(500).json({
                msg: 'No existe la sesion de compra'
            });
        }
        const especialistaBD = yield especialista_1.default.findOne({
            where: {
                email: body.email
            }
        });
        if (!especialistaBD) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(body.password, especialistaBD.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            });
        }
        let especialista = yield especialista_1.default.findByPk(sesion_compra.EspecialistaId);
        if (!especialista) {
            return res.status(500).json({
                msg: 'No existe el especialista'
            });
        }
        if (especialista.id === especialistaBD.id) {
            sesion_compra.set({ ok_especialista: true });
            if (sesion_compra.ok_cliente) {
                if (!sesion_compra.pagada) {
                    //pagar(guarda);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado'
            });
        }
        else {
            return res.status(500).json({
                msg: 'Algo no ha ido bien con su validación'
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo no ha ido bien'
        });
    }
});
exports.validarCompraEspecialista = validarCompraEspecialista;
//# sourceMappingURL=validar-compras.controller.js.map