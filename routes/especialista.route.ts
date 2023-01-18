import { Router } from 'express';
import { check } from 'express-validator';
import { getEspecialista, 
         postEspecialista, 
         getEspecialistas, 
         putEspecialista, 
         deleteEspecialista } from '../controllers/especialista.controller';
import { validarCampos } from '../middlewares/validar-campos';
import {esActividadValida,esPlanValido, existeEmail, existeUsuario} from '../helpers/db-validators'



const router = Router();

router.get('/:especialidad',[
    check('especialidad').custom( esActividadValida ),
],validarCampos,getEspecialistas);

router.get('/especialista/:id',[
    check('id').custom(existeUsuario),
],validarCampos,getEspecialista)

router.post('/',[
    check('email','El correo no es válido').isEmail(),  
    check('email').custom(existeEmail),   
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('apellidos','Los apellidos son obligatorios').not().isEmpty(),
    check('telefono','El teléfono es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('ActividadeId','La actividad es obligatoria').not().isEmpty(),
    check('ActividadeId').custom( esActividadValida ),    
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId').custom(esPlanValido),
  
    ] ,validarCampos, postEspecialista);

router.put('/:id',[
    check('id').custom(existeUsuario),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('apellidos','Los apellidos son obligatorios').not().isEmpty(),
    check('telefono','El teléfono es obligatorio').not().isEmpty(),
    check('ActividadeId','La actividad es obligatoria').not().isEmpty(),
    check('ActividadeId').custom( esActividadValida ),    
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId').custom(esPlanValido),
], validarCampos,putEspecialista);

router.delete('/:id',[
    check('id').custom(existeUsuario),
],validarCampos,deleteEspecialista);

export default router;


