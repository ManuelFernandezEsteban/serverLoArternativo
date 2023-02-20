"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const newsletter_controller_1 = require("../controllers/newsletter.controller");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.get('/getall', newsletter_controller_1.getAllUserNews);
router.get('/:id', [], validar_campos_1.validarCampos, newsletter_controller_1.getUserNews);
router.post('/', [
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail().trim().escape().normalizeEmail(),
    (0, express_validator_1.check)('email', 'Email ya registrado').custom(db_validators_1.existeEmailNews),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('privacidad', 'Debe aceptar la política de privacidad').custom(db_validators_1.politicaAceptada),
], validar_campos_1.validarCampos, newsletter_controller_1.postUserNews);
router.put('/:id', [
    //check('id').custom(existeUsuarioNews),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty().trim().escape(),
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail().trim().escape().normalizeEmail(),
    // check('email').not().custom(existeEmailNews),   
], validar_campos_1.validarCampos, newsletter_controller_1.deleteUserNews);
router.delete('/:id', [
//check('id').custom(existeUsuarioNews),    
], validar_campos_1.validarCampos, newsletter_controller_1.deleteUserNews);
exports.default = router;
//# sourceMappingURL=newsletter.routes.js.map