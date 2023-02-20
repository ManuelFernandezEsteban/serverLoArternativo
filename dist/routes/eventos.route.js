"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const eventos_controller_1 = require("../controllers/eventos.controller");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../helpers/db-validators");
const validar_JWT_1 = require("../middlewares/validar-JWT");
const router = (0, express_1.Router)();
router.get('/:id', eventos_controller_1.getEvento);
router.get('/eventos/:especialista', [
    (0, express_validator_1.check)('especialista').custom(db_validators_1.existeUsuario),
    (0, express_validator_1.check)('especialista').custom(db_validators_1.planPermitido),
], validar_campos_1.validarCampos, eventos_controller_1.getEventosEspecialista);
router.get('/eventoxactividad/:actividad', [
    (0, express_validator_1.check)('actividad').custom(db_validators_1.esActividadValida)
], validar_campos_1.validarCampos, eventos_controller_1.getEventosActividad);
router.post('/', [
    validar_JWT_1.validarJWT,
    (0, express_validator_1.check)('evento', 'El nombre del evento es obligatorio').notEmpty().trim().escape(),
    (0, express_validator_1.check)('descripcion', 'La descripción del evento es obligatoria').notEmpty().trim().escape(),
    (0, express_validator_1.check)('online', 'El campo online es obligatorio').notEmpty().trim().escape(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('precio').notEmpty().isNumeric(),
    (0, express_validator_1.check)('EspecialistaId').custom(db_validators_1.existeEspecialistaEvento),
    (0, express_validator_1.check)('EspecialistaId').custom(db_validators_1.planPermitidoEvento),
    (0, express_validator_1.check)('ActividadeId').custom(db_validators_1.esActividadValida)
], validar_campos_1.validarCampos, eventos_controller_1.postEvento);
router.put('/:id', [validar_JWT_1.validarJWT,
    (0, express_validator_1.check)('evento', 'El nombre del evento es obligatorio').notEmpty().trim().escape(),
    (0, express_validator_1.check)('descripcion', 'La descripción del evento es obligatoria').notEmpty().trim().escape(),
    (0, express_validator_1.check)('online', 'El campo online es obligatorio').notEmpty(),
    (0, express_validator_1.check)('email', 'Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('precio', 'El precio no puede ser vacío').notEmpty(),
    (0, express_validator_1.check)('precio', 'El precio tiene que ser un número').isNumeric(),
    (0, express_validator_1.check)('fecha', 'No puede ser vacía').notEmpty(),
    (0, express_validator_1.check)('fecha', 'Tiene que ser una fecha válida').isDate(),
    (0, express_validator_1.check)('EspecialistaId').custom(db_validators_1.existeEspecialistaEvento),
    (0, express_validator_1.check)('EspecialistaId').custom(db_validators_1.planPermitidoEvento),
    (0, express_validator_1.check)('ActividadeId').custom(db_validators_1.esActividadValida)
], validar_campos_1.validarCampos, eventos_controller_1.putEvento);
router.delete('/:id', eventos_controller_1.deleteEvento);
exports.default = router;
//# sourceMappingURL=eventos.route.js.map