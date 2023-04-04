"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_campos_1 = require("../middlewares/validar-campos");
const express_validator_1 = require("express-validator");
const clientes_controller_1 = require("../controllers/clientes.controller");
const db_validators_1 = require("../helpers/db-validators");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('privacidad', 'Es obligatorio aceptar la política de privacidad').isBoolean({ strict: true }),
    (0, express_validator_1.check)('privacidad', 'Es obligatorio aceptar la política de privacidad').custom(db_validators_1.politicaAceptada),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('telefono', 'El teléfono es obligatorio').not().isEmpty().trim().escape(),
], validar_campos_1.validarCampos, clientes_controller_1.postCliente);
router.get('/:id', clientes_controller_1.getCliente);
exports.default = router;
//# sourceMappingURL=clientes.routes.js.map