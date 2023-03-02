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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crearTransporte = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_SMTP,
            pass: process.env.PASS_SMTP, // generated ethereal password
        },
    });
};
const createMessage = (mailInfo) => {
    return {
        from: `Nativos Tierra <${process.env.USER_SMTP}>`,
        to: `${mailInfo.mailDestinatario}`,
        subject: `Hola ${mailInfo.asunto}`,
        text: mailInfo.mensaje,
        html: mailInfo.html // html body
    };
};
const sendMail = (mailInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = crearTransporte();
    yield transport.sendMail(createMessage(mailInfo));
});
exports.sendMail = sendMail;
//# sourceMappingURL=send-mail.js.map