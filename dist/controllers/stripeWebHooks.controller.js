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
exports.stripeWebHooks = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const stripe_1 = __importDefault(require("stripe"));
const sesion_compra_evento_1 = __importDefault(require("../models/sesion_compra_evento"));
const compras_eventos_por_finalizar_1 = __importDefault(require("../models/compras_eventos_por_finalizar"));
const eventos_1 = __importDefault(require("../models/eventos"));
const especialista_1 = __importDefault(require("../models/especialista"));
const send_mail_1 = require("../helpers/send-mail");
const clientes_1 = __importDefault(require("../models/clientes"));
const plantilla_mail_1 = require("../helpers/plantilla-mail");
const server_1 = __importDefault(require("../models/server"));
const sesiones_compra_suscripcion_1 = __importDefault(require("../models/sesiones_compra_suscripcion"));
const suscripciones_1 = __importDefault(require("../models/suscripciones"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15'
});
const stripeWebHooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const firma = req.headers['stripe-signature'];
    try {
        const event = yield stripe.webhooks.constructEventAsync(payload, firma, process.env.STRIPE_WEBHOOK_SECRET);
        let sesion;
        switch (event.type) {
            case 'checkout.session.completed':
                sesion = event.data.object;
                yield onCheckoutSesionComplete(sesion);
                break;
            case 'customer.subscription.deleted':
                sesion = event.data.object;
                yield onDeleteSubscription(sesion.id);
                break;
            case 'account.updated':
                sesion = event.data.object;
                break;
            case 'payout.paid':
                sesion = event.data.object;
                break;
            default:
                break;
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Webhook error',
            error
        });
    }
    res.json({
        recieved: true
    });
});
exports.stripeWebHooks = stripeWebHooks;
const onDeleteSubscription = (subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const especialista = yield especialista_1.default.findOne({
            where: { token_pago: subscriptionId }
        });
        if (especialista) {
            yield borrarCuentaConectada(especialista.dataValues.cuentaConectada);
            const suscripcion = yield suscripciones_1.default.destroy({
                where: { EspecialistaId: especialista.dataValues.id }
            });
            especialista.set({ planeId: 0, cuentaConectada: null });
            yield especialista.save();
        }
        else {
            throw new Error(`Error completando cancelación, el especialista no se encuentra`);
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error completando cancelación ${error}`);
    }
});
const borrarCuentaConectada = (cuenta) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield stripe.accounts.del(cuenta);
        if (deleted) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
    }
});
const onCheckoutSesionComplete = (sesion) => __awaiter(void 0, void 0, void 0, function* () {
    const sesionReferenceId = sesion.client_reference_id;
    //console.log('sesion.checkout.complete evento:', sesionReferenceId);
    try {
        const sesion_compra_evento = yield sesion_compra_evento_1.default.findByPk(sesionReferenceId);
        if (sesion_compra_evento) {
            const evento = yield eventos_1.default.findByPk(sesion_compra_evento.dataValues.EventoId);
            const cliente = yield clientes_1.default.findByPk(sesion_compra_evento.dataValues.ClienteId);
            if (!evento) {
                throw new Error(`Error completando sesion, el evento no se encuentra`);
            }
            if (!cliente) {
                throw new Error(`Error completando sesion, el cliente no se encuentra`);
            }
            //cliente.set({idStripe:sesion.customer});
            //await cliente.save();
            sesion_compra_evento.set({ completada: 1 });
            yield sesion_compra_evento.save();
            const compra_por_finalizar = yield compras_eventos_por_finalizar_1.default.create({
                ClienteId: sesion_compra_evento.dataValues.ClienteId,
                EventoId: evento.dataValues.id,
                EspecialistaId: evento.dataValues.EspecialistaId,
                ok_cliente: false,
                ok_especialista: false,
                payment_intent: sesion.payment_intent,
                pagada: false,
                //        token_seguridad:token_seguridad
            });
            console.log('compra por finalizar', compra_por_finalizar.dataValues.id);
            const token = jsonwebtoken_1.default.sign({ sesion_compra: compra_por_finalizar.dataValues.id }, process.env.SECRETPRIVATEKEY || '', { expiresIn: '15d' });
            //realizar factura evento comprado
            if (cliente.dataValues.idStripe) {
                const date = new Date(Date.now());
                console.log(date);
                const factura = yield stripe.invoices.create({
                    collection_method: 'send_invoice',
                    customer: cliente.dataValues.idStripe,
                    days_until_due: 0
                });
                const lineaFactura = yield stripe.invoiceItems.create({
                    customer: cliente.dataValues.idStripe,
                    price: evento.dataValues.idPriceEvent,
                    invoice: factura.id,
                    quantity: 1,
                });
                yield stripe.invoices.finalizeInvoice(factura.id);
                yield stripe.invoices.sendInvoice(factura.id);
            }
            yield enviarMailCompraCliente(compra_por_finalizar, token);
            yield enviarMailCompraEspecialista(compra_por_finalizar, token);
            enviarMensajeWebSocket('sesion_compra_finalizada', sesionReferenceId);
            console.log('sesion' + sesionReferenceId + ' pagada');
            /*  server.io.on('connection', cliente => {
                  console.log('cliente conectado ', cliente.id)
                  cliente.emit('sesion_compra_finalizada evento', sesionReferenceId)
              })*/
        }
        else {
            const sesion_compra_suscripcion = yield sesiones_compra_suscripcion_1.default.findByPk(sesionReferenceId);
            //console.log('sesion.checkout.complete suscripcion:',sesion);
            if (sesion_compra_suscripcion) { // es una suscripcion
                const especialista = yield especialista_1.default.findByPk(sesion_compra_suscripcion.dataValues.EspecialistaId);
                if (!especialista) {
                    throw new Error("Error, el especialista no se encuentra");
                }
                const subscription = yield stripe.subscriptions.retrieve(sesion.subscription);
                const suscripcionAnterior = yield suscripciones_1.default.findOne({ where: { EspecialistaId: especialista.dataValues.id } });
                if (suscripcionAnterior) {
                    //comprobamos si tenía una suscripción anterior, 
                    //si es así cancelamos la antigua y modificamos la tabla
                    //console.log(subscription);                    
                    //cancelamos antigua en stripe
                    try {
                        //cancelamos antigua en stripe
                        yield stripe.subscriptions.del(suscripcionAnterior.dataValues.id_stripe_subscription);
                        //modificamos la tabla
                        yield suscripcionAnterior.update({
                            EspecialistaId: especialista.dataValues.id,
                            planeId: sesion_compra_suscripcion.dataValues.planeId,
                            id_stripe_subscription: subscription.id
                        });
                    }
                    catch (error) {
                        console.log(error);
                        throw new Error('Error en la sesion de stripe al cancelar la antigua suscripción');
                    }
                }
                else { //en otro caso creamos un nuevo registro en la tabla suscripciones
                    yield suscripciones_1.default.create({
                        EspecialistaId: especialista.dataValues.id,
                        planeId: sesion_compra_suscripcion.dataValues.planeId,
                        id_stripe_subscription: subscription.id
                    });
                    yield (0, send_mail_1.sendMail)({
                        asunto: 'Registro como especialista en el Portal Web Nativos Tierra',
                        nombreDestinatario: especialista.dataValues.nombre,
                        mailDestinatario: especialista.dataValues.email,
                        mensaje: `Hola, ${especialista.dataValues.nombre} su resgistro ha sido completado`,
                        html: (0, plantilla_mail_1.mailRegistro)(especialista.dataValues.nombre)
                    });
                }
                yield especialista.update({
                    stripeId: sesion.customer,
                    planeId: sesion_compra_suscripcion.dataValues.planeId
                });
                enviarMensajeWebSocket('compra_suscripcion_finalizada', especialista.dataValues.id);
            }
            else {
                throw new Error('no existe la referencia');
            }
        }
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error completando sesion ${error}`);
    }
});
const enviarMensajeWebSocket = (tipoMensaje, mensaje) => {
    const server = server_1.default.instance;
    console.log(tipoMensaje, mensaje);
    server.io.on('connection', cliente => {
        console.log('cliente conectado ', cliente.id);
        cliente.emit(tipoMensaje, mensaje);
    });
};
const enviarMailCompraCliente = (sesion_compra, token) => __awaiter(void 0, void 0, void 0, function* () {
    const link = `${process.env.LINK_VERIFICAR_COMPRAS}${token}`;
    try {
        let especialista = yield especialista_1.default.findByPk(sesion_compra.EspecialistaId);
        let evento = yield eventos_1.default.findByPk(sesion_compra.EventoId);
        let cliente = yield clientes_1.default.findByPk(sesion_compra.ClienteId);
        yield (0, send_mail_1.sendMail)({
            asunto: 'Compra de evento en Nativos Tierra',
            nombreDestinatario: cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.nombre,
            mailDestinatario: cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.email,
            mensaje: `Hola, ${cliente === null || cliente === void 0 ? void 0 : cliente.dataValues.nombre} enviamos información del evento adquirido`,
            html: (0, plantilla_mail_1.mailCompraCliente)(especialista, evento, cliente, link),
        });
    }
    catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
});
const enviarMailCompraEspecialista = (sesion_compra, token) => __awaiter(void 0, void 0, void 0, function* () {
    const link = `${process.env.LINK_VERIFICAR_COMPRAS_ESPECIALISTAS}${token}`;
    try {
        let especialista = yield especialista_1.default.findByPk(sesion_compra.EspecialistaId);
        let evento = yield eventos_1.default.findByPk(sesion_compra.EventoId);
        let cliente = yield clientes_1.default.findByPk(sesion_compra.ClienteId);
        yield (0, send_mail_1.sendMail)({
            asunto: 'Compra de evento en Nativos Tierra',
            nombreDestinatario: especialista === null || especialista === void 0 ? void 0 : especialista.dataValues.nombre,
            mailDestinatario: especialista === null || especialista === void 0 ? void 0 : especialista.dataValues.email,
            mensaje: `Hola, ${especialista === null || especialista === void 0 ? void 0 : especialista.dataValues.nombre} enviamos información del cliente que ha adquirido su evento ${evento.evento}`,
            html: (0, plantilla_mail_1.mailCompraEspecialista)(especialista, evento, cliente, link),
        });
    }
    catch (error) {
        console.log(error);
        throw new Error('Error enviando el email al cliente');
    }
});
//# sourceMappingURL=stripeWebHooks.controller.js.map