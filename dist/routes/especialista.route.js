"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const especialista_controller_1 = require("../controllers/especialista.controller");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../helpers/db-validators");
const validar_JWT_1 = require("../middlewares/validar-JWT");
const router = (0, express_1.Router)();
router.get('/:especialidad', [
    (0, express_validator_1.check)('especialidad').custom(db_validators_1.esActividadValida),
], validar_campos_1.validarCampos, especialista_controller_1.getEspecialistas);
router.get('/pagination/:especialidad', [
    (0, express_validator_1.check)('especialidad').custom(db_validators_1.esActividadValida),
], validar_campos_1.validarCampos, especialista_controller_1.getEspecialistasPagination);
router.get('/especialista/:id', [
// check('id').custom(existeUsuario),
], validar_campos_1.validarCampos, especialista_controller_1.getEspecialista);
router.post('/', [
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('email').custom(db_validators_1.existeEmail),
    (0, express_validator_1.check)('privacidad', 'Es obligatorio aceptar la política de privacidad').isBoolean({ 'strict': true }),
    (0, express_validator_1.check)('condiciones', 'Es obligatorio aceptar las condiciones de uso').isBoolean({ 'strict': true }),
    (0, express_validator_1.check)('privacidad', 'Es obligatorio aceptar la política de privacidad').custom(db_validators_1.politicaAceptada),
    (0, express_validator_1.check)('condiciones', 'Es obligatorio aceptar las condiciones de uso').custom(db_validators_1.condicionesAceptada),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('telefono', 'El teléfono es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('provincia', 'La provincia es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('ActividadeId', 'La actividad es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('ActividadeId').custom(db_validators_1.esActividadValida),
    (0, express_validator_1.check)('PlaneId', 'El plan es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('PlaneId').custom(db_validators_1.esPlanValido),
    (0, express_validator_1.check)('pais', 'El país es obligatorio').not().isEmpty()
], validar_campos_1.validarCampos, especialista_controller_1.postEspecialista);
router.post('/cuenta_conectada/:id', [
    validar_JWT_1.validarJWT,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
], validar_campos_1.validarCampos, especialista_controller_1.crearCuentaConectada);
router.get('/cuenta_conectada/:id', [
    validar_JWT_1.validarJWT
    //check('id').custom(existeUsuario),
], validar_campos_1.validarCampos, especialista_controller_1.getCuentaConectada);
router.put('/:id', [
    validar_JWT_1.validarJWT,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('telefono', 'El teléfono es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('provincia', 'La provincia es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('ActividadeId', 'La actividad es obligatoria').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('ActividadeId').custom(db_validators_1.esActividadValida),
    (0, express_validator_1.check)('PlaneId', 'El plan es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('PlaneId').custom(db_validators_1.esPlanValido),
    (0, express_validator_1.check)('pais', 'El país es obligatorio').not().isEmpty()
], validar_campos_1.validarCampos, especialista_controller_1.putEspecialista);
router.delete('/:id', [validar_JWT_1.validarJWT,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeUsuario),
], validar_campos_1.validarCampos, especialista_controller_1.deleteEspecialista);
/*
router.patch('/modificarPlan/:id',[
    validarJWT,
    check('id').custom(existeUsuario),
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId').custom(esPlanValido),
], validarCampos,patchEspecialista);
*/
exports.default = router;
//# sourceMappingURL=especialista.route.js.map