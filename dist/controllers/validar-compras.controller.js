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
const dotenv_1 = __importDefault(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
const eventos_1 = __importDefault(require("../models/eventos"));
const monedas_1 = __importDefault(require("../models/monedas"));
const send_mail_1 = require("../helpers/send-mail");
const plantilla_mail_1 = require("../helpers/plantilla-mail");
const planes_1 = __importDefault(require("../models/planes"));
const crearFacturas_1 = require("../helpers/crearFacturas");
const createPrice_1 = require("../helpers/createPrice");
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
});
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
        let cliente = yield clientes_1.default.findByPk(sesion_compra.dataValues.ClienteId);
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
        if (cliente.dataValues.id === (clienteBD === null || clienteBD === void 0 ? void 0 : clienteBD.dataValues.id)) {
            sesion_compra.set({ ok_cliente: true });
            let transfer;
            if (sesion_compra.dataValues.ok_especialista) {
                if (!sesion_compra.dataValues.pagada) {
                    transfer = yield pagar(sesion_compra);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado',
                transfer
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
        const validPassword = bcryptjs_1.default.compareSync(body.password, especialistaBD.dataValues.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            });
        }
        let especialista = yield especialista_1.default.findByPk(sesion_compra.dataValues.EspecialistaId);
        if (!especialista) {
            return res.status(500).json({
                msg: 'No existe el especialista'
            });
        }
        if (especialista.dataValues.id === especialistaBD.dataValues.id) {
            sesion_compra.set({ ok_especialista: true });
            let transfer;
            if (sesion_compra.dataValues.ok_cliente) {
                if (!sesion_compra.dataValues.pagada) {
                    transfer = yield pagar(sesion_compra);
                    sesion_compra.set({ pagada: true });
                }
            }
            sesion_compra.save();
            res.json({
                msg: 'evento validado',
                transfer
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
const pagar = (sesion_compra) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const evento = yield eventos_1.default.findByPk(sesion_compra.EventoId);
        const especialista = yield especialista_1.default.findByPk(sesion_compra.EspecialistaId);
        if (!especialista) {
            return new Error('El especialista no existe');
        }
        if (!evento) {
            return new Error('El evento no existe');
        }
        const moneda = yield monedas_1.default.findByPk(evento.dataValues.monedaId);
        if (!moneda) {
            return new Error('La moneda no existe');
        }
        //TODO: calcular comisión en función del tipo de suscripción
        const comision_stripe_transferencia = 0.0025;
        const comision_stripe_transaccion = 0.015;
        const fijo_stripe_transaccion = 0.25;
        const fijo_stripe_transferencia = 0.1;
        const plan = yield planes_1.default.findByPk(especialista.dataValues.PlaneId);
        let porcentaje_comision = plan === null || plan === void 0 ? void 0 : plan.dataValues.comision;
        //comisiones stripe por venta de envento
        const base = evento.dataValues.precio;
        const gasto_venta_evento = (base * comision_stripe_transaccion) + fijo_stripe_transaccion;
        //comisiones stripe por transferencia
        const gasto_tranferencia_especialista = (base * comision_stripe_transferencia) + fijo_stripe_transferencia;
        //comision para nativos tierra
        const comision_nativos = base - (base * porcentaje_comision);
        const amount = (base - comision_nativos - gasto_tranferencia_especialista - gasto_venta_evento) * 100;
        const gasto_gestion = gasto_tranferencia_especialista + gasto_venta_evento;
        console.log(amount);
        const transfer = yield stripe.transfers.create({
            amount,
            currency: moneda.dataValues.moneda,
            destination: especialista.dataValues.cuentaConectada,
            description: sesion_compra.payment_intent,
        });
        const priceComision = yield (0, createPrice_1.createPrice)('prod_Nt7TDoXV22bsE5', comision_nativos, 1);
        const priceTransferencia = yield (0, createPrice_1.createPrice)('prod_Nt7UAN6Ua78MfT', gasto_gestion, 1);
        const lineas = [];
        lineas.push(priceComision);
        lineas.push(priceTransferencia);
        yield (0, crearFacturas_1.crearFactura)(especialista.dataValues.stripeId, 0, lineas, sesion_compra.payment_intent);
        yield enviarMailPagoEspecialista(sesion_compra, amount, moneda.dataValues.moneda);
        return transfer;
    }
    catch (error) {
        console.log(error);
    }
});
const enviarMailPagoEspecialista = (sesion, amount, moneda) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let especialista = yield especialista_1.default.findByPk(sesion.EspecialistaId);
        let evento = yield eventos_1.default.findByPk(sesion.EventoId);
        let cliente = yield clientes_1.default.findByPk(sesion.ClienteId);
        if (!especialista) {
            return new Error('El especialista no existe');
        }
        if (!evento) {
            return new Error('El evento no existe');
        }
        yield (0, send_mail_1.sendMail)({
            asunto: `Pago venta del evento ${evento.dataValues.evento}`,
            nombreDestinatario: especialista.dataValues.nombre,
            mailDestinatario: especialista.dataValues.email,
            mensaje: `Hola, ${especialista === null || especialista === void 0 ? void 0 : especialista.dataValues.nombre}, hemos procedido a realizar la transferencia del importe de la venta del ${evento.dataValues.evento} a su cuenta.`,
            html: (0, plantilla_mail_1.mailTransferenciaEspecialista)(especialista, evento, cliente, amount, moneda),
        });
    }
    catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
});
//# sourceMappingURL=validar-compras.controller.js.map