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
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarConsulta = void 0;
const plantilla_mail_1 = require("../helpers/plantilla-mail");
const send_mail_1 = require("../helpers/send-mail");
const enviarConsulta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        yield (0, send_mail_1.sendMail)({
            asunto: 'Consulta desde Portal Web Nativos Tierra',
            nombreDestinatario: body.nombre,
            mailDestinatario: `${body.email},${process.env.USER_SMTP}`,
            mensaje: `Hola, ${body.nombre} hemos enviado su consulta`,
            html: (0, plantilla_mail_1.mailConsulta)(body.nombre, body.mensaje)
        }).then(() => {
            res.status(200).json({
                msg: 'mensaje enviado'
            });
        }).catch(() => {
            res.status(500).json({
                msg: 'Error, el mensaje no se ha enviado'
            });
        });
    }
    catch (error) {
    }
});
exports.enviarConsulta = enviarConsulta;
//# sourceMappingURL=contacto.controller.js.map