import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos';
import { validarCompraCliente, validarCompraEspecialista } from '../controllers/validar-compras.controller';

const router = Router(); 
router.post('/cliente',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),    
],validarCampos,validarCompraCliente);

router.post('/especialista',[
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','Debe ser un email válido').isEmail().trim().escape().normalizeEmail(),
    check('password','La contraseña es obligatoria y mayor de 8 caracteres').not().isEmpty().isLength({min:8}).trim().escape()
],validarCampos,validarCompraEspecialista);
 

export default router;