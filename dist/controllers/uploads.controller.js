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
exports.deleteEvento = exports.eventoInfo = exports.eventoImagen = exports.videoEspecialista = exports.avatarEspecialista = void 0;
const especialista_1 = __importDefault(require("../models/especialista"));
const eventos_1 = __importDefault(require("../models/eventos"));
const createFolder_1 = require("../helpers/createFolder");
const avatarEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idEspecialista = req.especialistaAutenticado;
    const urlImagen = req.urlAvatar;
    try {
        const especialista = yield especialista_1.default.findByPk(idEspecialista);
        if (especialista) {
            const url = `${process.env.BASE_URL}${urlImagen}`;
            especialista.update({ imagen: url });
        }
        else {
            return res.status(500).json({
                error: "Algo no ha ido bien"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: "Algo no ha ido bien"
        });
    }
    res.json({
        msg: 'upload success',
    });
});
exports.avatarEspecialista = avatarEspecialista;
const videoEspecialista = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idEspecialista = req.especialistaAutenticado;
    const urlImagen = req.urlVideo;
    try {
        const especialista = yield especialista_1.default.findByPk(idEspecialista);
        if (especialista) {
            const url = `${process.env.BASE_URL}${urlImagen}`;
            especialista.update({ video: url });
        }
        else {
            return res.status(500).json({
                error: "Algo no ha ido bien"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: "Algo no ha ido bien"
        });
    }
    res.json({
        msg: 'upload success',
    });
});
exports.videoEspecialista = videoEspecialista;
const eventoImagen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const urlImagen = req.urlImagenEvento;
    try {
        const evento = yield eventos_1.default.findByPk(id);
        if (evento) {
            const url = `${process.env.BASE_URL}${urlImagen}`;
            evento.update({ imagen: url });
        }
        else {
            return res.status(500).json({
                error: "Algo no ha ido bien"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: "Algo no ha ido bien"
        });
    }
    res.json({
        msg: 'upload success',
    });
});
exports.eventoImagen = eventoImagen;
const eventoInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const urlImagen = req.urlInfoEvento;
    try {
        const evento = yield eventos_1.default.findByPk(id);
        if (evento) {
            const url = `${process.env.BASE_URL}${urlImagen}`;
            evento.update({ pdf: url });
        }
        else {
            return res.status(500).json({
                error: "Algo no ha ido bien"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: "Algo no ha ido bien"
        });
    }
    res.json({
        msg: 'upload success',
    });
});
exports.eventoInfo = eventoInfo;
const deleteEvento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, createFolder_1.deleteFolder)(`eventos/${req.params.id}`);
});
exports.deleteEvento = deleteEvento;
//# sourceMappingURL=uploads.controller.js.map