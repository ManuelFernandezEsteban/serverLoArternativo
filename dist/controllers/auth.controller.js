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
exports.createNewPassword = exports.forgotPassword = exports.renewToken = exports.login = void 0;
const especialista_1 = __importDefault(require("../models/especialista"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generar_JWT_1 = require("../helpers/generar-JWT");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const send_mail_1 = require("../helpers/send-mail");
const plantilla_mail_1 = require("../helpers/plantilla-mail");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const especialista = yield especialista_1.default.findOne({
            where: {
                email: email
            },
            include: [{
                    all: true
                }]
        });
        if (!especialista) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, especialista.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Correo / password no son correctos'
            });
        }
        const token = (0, generar_JWT_1.generarJWT)(especialista.id);
        especialista.set({ password: '' });
        res.json({
            especialista,
            token
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
});
exports.login = login;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.especialistaAutenticado;
    // Generar el TOKEN - JWT
    try {
        const token = yield (0, generar_JWT_1.generarJWT)(id);
        const especialista = yield especialista_1.default.findByPk(id, {
            attributes: { exclude: ['password'] },
        });
        res.json({
            token,
            especialista
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
});
exports.renewToken = renewToken;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const message = "Revisa tu correo, hemos enviado un link para resetar el password";
    let verificationLink = '';
    let emailStatus = 'OK';
    let token = '';
    const especialista = yield especialista_1.default.findOne({
        where: { email: email }
    });
    if (!especialista) {
        emailStatus = 'error';
        return res.status(400).json({ message, email });
    }
    try {
        token = jsonwebtoken_1.default.sign({ especialistaId: especialista.id }, process.env.SECRETPRIVATEKEY || '', { expiresIn: '10m' });
        verificationLink = `${process.env.LINK}${token}`;
    }
    catch (error) {
        emailStatus = 'error';
        res.status(400).json({ message });
    }
    //send Mail
    try {
        yield (0, send_mail_1.sendMail)({
            asunto: 'Recuperación password en portal web Nativos Tierra',
            nombreDestinatario: especialista.nombre,
            mailDestinatario: especialista.email,
            mensaje: `Hola, ${especialista.nombre} le enviamos un link para recuperar su contraseña`,
            html: (0, plantilla_mail_1.mailRecuperacionPassword)(especialista.nombre, verificationLink)
        });
    }
    catch (error) {
        emailStatus = 'error';
        return res.status(500).json({ message: 'Algo ha ido mal' });
    }
    try {
        yield (especialista === null || especialista === void 0 ? void 0 : especialista.set({ resetToken: token }));
        yield (especialista === null || especialista === void 0 ? void 0 : especialista.save());
        res.json({ message, emailStatus, verificationLink });
    }
    catch (error) {
        emailStatus = 'error';
        res.status(500).json({ message: 'Algo no ha ido bien' });
    }
    //res.json({ message, emailStatus })
});
exports.forgotPassword = forgotPassword;
const createNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const resetToken = req.header('resetToken');
    if (!(resetToken && password) || (resetToken.trim() === '')) {
        return res.status(400).json({
            message: 'Todos los campos son requeridos',
        });
    }
    let especialista;
    try {
        jsonwebtoken_1.default.verify(resetToken, process.env.SECRETPRIVATEKEY || '');
        especialista = yield especialista_1.default.findOne({
            where: { resetToken: resetToken }
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Algo no ha ido bien" });
    }
    try {
        const salt = bcryptjs_1.default.genSaltSync();
        yield (especialista === null || especialista === void 0 ? void 0 : especialista.set({ password: bcryptjs_1.default.hashSync(password, salt) }));
        yield (especialista === null || especialista === void 0 ? void 0 : especialista.save());
        res.json({
            'message': "Contraseña establecida",
        });
    }
    catch (error) {
        return res.status(500).json({
            'message': 'Algo ha ido mal'
        });
    }
});
exports.createNewPassword = createNewPassword;
//# sourceMappingURL=auth.controller.js.map