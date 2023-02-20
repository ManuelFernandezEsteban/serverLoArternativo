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
exports.deleteUserNews = exports.postUserNews = exports.getAllUserNews = exports.getUserNews = void 0;
const newsletter_1 = __importDefault(require("../models/newsletter"));
const send_mail_1 = require("../helpers/send-mail");
const plantilla_mail_1 = require("../helpers/plantilla-mail");
const getUserNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield newsletter_1.default.findByPk(id);
        if (user) {
            res.json({
                user
            });
        }
        else {
            res.status(404).json({
                msg: `No existe un usuario con id ${id}`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.getUserNews = getUserNews;
const getAllUserNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield newsletter_1.default.findAll();
        res.json({
            users
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.getAllUserNews = getAllUserNews;
const postUserNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const user = newsletter_1.default.build(body);
        user.save();
        yield (0, send_mail_1.sendMail)({
            asunto: 'Suscripción a newsletter',
            nombreDestinatario: body.nombre,
            mailDestinatario: body.email,
            mensaje: `Hola, ${body.nombre} su suscripción ha sido completada`,
            html: (0, plantilla_mail_1.mailSuscripcion)(body.nombre)
        });
        res.json({
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.postUserNews = postUserNews;
const deleteUserNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield newsletter_1.default.findByPk(id);
        if (user) {
            user.destroy();
            res.json({
                user
            });
        }
        else {
            res.status(404).json({
                msg: `No existe un usuario con id ${id}`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error,
        });
    }
});
exports.deleteUserNews = deleteUserNews;
//# sourceMappingURL=newsletter.controller.js.map