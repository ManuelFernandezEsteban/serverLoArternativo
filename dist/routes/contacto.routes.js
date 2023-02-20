"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const contacto_controller_1 = require("../controllers/contacto.controller");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.check)('email', 'El email es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('mensaje', 'El mensaje es obligatorio').not().isEmpty().isLength({ min: 10 }).trim().escape(),
    (0, express_validator_1.check)('privacidad', 'Hay que aceptar la política de privacidad').custom(db_validators_1.politicaAceptada),
], validar_campos_1.validarCampos, contacto_controller_1.enviarConsulta);
exports.default = router;
//# sourceMappingURL=contacto.routes.js.map