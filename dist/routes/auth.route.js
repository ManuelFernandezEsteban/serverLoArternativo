"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validar_campos_1 = require("../middlewares/validar-campos");
const validar_JWT_1 = require("../middlewares/validar-JWT");
const router = (0, express_1.Router)();
//renwe token
router.get('/renovar', validar_JWT_1.validarJWT, validar_campos_1.validarCampos, auth_controller_1.renewToken);
//forgot password
router.put('/forgot-password', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
], validar_campos_1.validarCampos, auth_controller_1.forgotPassword);
//create new password
router.put('/new-password', [
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty().isLength({ min: 8 }).trim().escape()
], validar_campos_1.validarCampos, auth_controller_1.createNewPassword);
//login
router.post('/login', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria').not().isEmpty().isLength({ min: 8 }).trim().escape()
], validar_campos_1.validarCampos, auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.route.js.map