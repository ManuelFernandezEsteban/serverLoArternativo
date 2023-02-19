import { Router } from 'express';
import { check } from 'express-validator';
import { createNewPassword, forgotPassword, login, renewToken } from '../controllers/auth.controller';
import { validarCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-JWT';

const router = Router();

//renwe token
router.get('/renovar',validarJWT,validarCampos,renewToken);
//forgot password
router.put('/forgot-password',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
], validarCampos ,forgotPassword);
//create new password
router.put('/new-password',[
    check('password','La contraseña es obligatoria').not().isEmpty().isLength({min:8}).trim().escape()
], validarCampos ,createNewPassword);
//login
router.post('/login',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty().isLength({min:8}).trim().escape()
],validarCampos,login);

 
 

export default router;    