"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const herramientas_controller_1 = require("../controllers/herramientas.controller");
const express_validator_1 = require("express-validator");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.get('/:id', herramientas_controller_1.getHerramientaById);
router.get('/especialista/:id', [
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario)
], validar_campos_1.validarCampos, herramientas_controller_1.getHerramientasByEspecialista);
router.post('/especialistasByHerramientas/:actividad', [
    (0, express_validator_1.check)('actividad', 'La actividad es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('actividad').custom(db_validators_1.esActividadValida),
    //check('herramientas','Hay que incluir al menos una herramienta').not().isEmpty()
], validar_campos_1.validarCampos, herramientas_controller_1.getEspecialistasByHerramientas);
router.get('/herramientas/:actividad', [
    (0, express_validator_1.check)('actividad', 'La actividad es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('actividad').custom(db_validators_1.esActividadValida),
], validar_campos_1.validarCampos, herramientas_controller_1.getHerramientasByActividad);
exports.default = router;
//# sourceMappingURL=herramientas.routes.js.map