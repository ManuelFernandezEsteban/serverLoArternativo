import { Router } from 'express';
import { check } from 'express-validator';
import { enviarConsulta } from '../controllers/contacto.controller';
import { politicaAceptada } from '../helpers/db-validators';
import { validarCampos } from '../middlewares/validar-campos';


const router = Router();

router.post('/',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    check('nombre','El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('mensaje','El mensaje es obligatorio').not().isEmpty().isLength({min:10}).trim().escape(),
    check('privacidad','Hay que aceptar la política de privacidad').custom(politicaAceptada),
],validarCampos,enviarConsulta);


export default router;  