"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const actividades_controller_1 = require("../controllers/actividades.controller");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.get('/:id', [
    (0, express_validator_1.check)('actividad', 'La actividad es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('actividad').custom(db_validators_1.esActividadValida)
], validar_campos_1.validarCampos, actividades_controller_1.getActividad);
router.get('/', actividades_controller_1.getActividades);
exports.default = router;
//# sourceMappingURL=actividades.route.js.map