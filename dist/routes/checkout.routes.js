"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
//import { createNewPassword, forgotPassword, login, renewToken } from '../controllers/auth.controller';
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.post('/', [
//check('email','El email es obligatorio').not().isEmpty(),
//check('email','Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
//check('password','La contraseña es obligatoria').not().isEmpty().isLength({min:8}).trim().escape()
], validar_campos_1.validarCampos, checkout_controller_1.createCheckoutSession);
exports.default = router;
//# sourceMappingURL=checkout.routes.js.map