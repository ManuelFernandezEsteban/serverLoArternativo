import { Router } from 'express';
import { check } from 'express-validator';
import { deleteUserNews, getAllUserNews, getUserNews, postUserNews } from '../controllers/newsletter.controller';
import { existeEmailNews, politicaAceptada } from '../helpers/db-validators';
import { validarCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-JWT';





const router = Router();
router.get('/getall',getAllUserNews);

router.get('/:id',[   
],validarCampos,getUserNews);

router.post('/',[
    check('email','El correo no es válido').isEmail().trim().escape().normalizeEmail(),  
    check('email','Email ya registrado').custom(existeEmailNews),   
    check('nombre','El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('privacidad','Debe aceptar la política de privacidad').custom(politicaAceptada),
    ] ,validarCampos, postUserNews );

router.put('/:id',[    
    //check('id').custom(existeUsuarioNews),
    check('nombre','El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('email','El correo no es válido').isEmail().trim().escape().normalizeEmail(),
   // check('email').not().custom(existeEmailNews),   
], validarCampos, deleteUserNews);

router.delete('/:id',[  
    //check('id').custom(existeUsuarioNews),    
],validarCampos, deleteUserNews);

export default router;


