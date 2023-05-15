"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const especialistas_categorias_controller_1 = require("../controllers/especialistas_categorias.controller");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.get('/:id', [
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
], validar_campos_1.validarCampos, especialistas_categorias_controller_1.getCategorias);
exports.default = router;
//# sourceMappingURL=especialistas_categorias.routes.js.map