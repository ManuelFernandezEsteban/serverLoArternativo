"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const validar_compras_controller_1 = require("../controllers/validar-compras.controller");
const router = (0, express_1.Router)();
router.post('/cliente', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
], validar_campos_1.validarCampos, validar_compras_controller_1.validarCompraCliente);
router.post('/especialista', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('password', 'La contraseña es obligatoria y mayor de 8 caracteres').not().isEmpty().isLength({ min: 8 }).trim().escape()
], validar_campos_1.validarCampos, validar_compras_controller_1.validarCompraEspecialista);
exports.default = router;
//# sourceMappingURL=validar-compras.route.js.map