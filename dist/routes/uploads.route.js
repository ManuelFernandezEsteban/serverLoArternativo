"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("./../libs/multer");
const uploads_controller_1 = require("../controllers/uploads.controller");
//import multer from 'multer';
const validar_JWT_1 = require("../middlewares/validar-JWT");
const router = (0, express_1.Router)();
router.post('/avatarEspecialista', [validar_JWT_1.validarJWT, multer_1.uploadAvatarEspecialista], uploads_controller_1.avatarEspecialista);
router.post('/videoEspecialista', [validar_JWT_1.validarJWT, multer_1.uploadVideoEspecialista], uploads_controller_1.videoEspecialista);
router.post('/eventoImagen/:id', [validar_JWT_1.validarJWT, multer_1.uploadEventoImagen], uploads_controller_1.eventoImagen);
router.post('/eventoInfo/:id', [validar_JWT_1.validarJWT, multer_1.uploadEventoInfo], uploads_controller_1.eventoInfo);
router.delete('/delete/:id', [validar_JWT_1.validarJWT], uploads_controller_1.deleteEvento);
exports.default = router;
//# sourceMappingURL=uploads.route.js.map