import { Router } from "express";
import { validarCampos } from "../middlewares/validar-campos";
import { check } from "express-validator";
import { getCliente, postCliente } from "../controllers/clientes.controller";
import { politicaAceptada } from "../helpers/db-validators";

const router = Router();

router.post('/',[
    check('email','El correo no es válido').isEmail().trim().escape().normalizeEmail(),       
    check('privacidad','Es obligatorio aceptar la política de privacidad').isBoolean({strict:true}),
    check('privacidad','Es obligatorio aceptar la política de privacidad').custom(politicaAceptada),
    check('nombre','El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('apellidos','Los apellidos son obligatorios').not().isEmpty().trim().escape(),
    check('telefono','El teléfono es obligatorio').not().isEmpty().trim().escape(),
],validarCampos,postCliente);

router.get('/:id',getCliente)


export default router;