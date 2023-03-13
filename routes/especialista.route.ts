import { Router } from 'express';
import { check } from 'express-validator';
import { getEspecialista, 
         postEspecialista, 
         getEspecialistas, 
         putEspecialista, 
         deleteEspecialista, 
         patchEspecialista,
         getEspecialistasPagination} from '../controllers/especialista.controller';
import { validarCampos } from '../middlewares/validar-campos';
import {esActividadValida,esPlanValido, existeEmail, existeUsuario} from '../helpers/db-validators'
import { validarJWT } from '../middlewares/validar-JWT';

const router = Router();

router.get('/:especialidad',[
    check('especialidad').custom( esActividadValida ),
],validarCampos,getEspecialistas);
router.get('/pagination/:especialidad',[
    check('especialidad').custom( esActividadValida ),
],validarCampos,getEspecialistasPagination);

router.get('/especialista/:id',[
    check('id').custom(existeUsuario),
],validarCampos,getEspecialista)

router.post('/',[
    check('email','El correo no es válido').isEmail().trim().escape().normalizeEmail(),  
    check('email').custom(existeEmail),   
    check('nombre','El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('apellidos','Los apellidos son obligatorios').not().isEmpty().trim().escape(),
    check('telefono','El teléfono es obligatorio').not().isEmpty().trim().escape(),
    check('provincia','La provincia es obligatoria').not().isEmpty().trim().escape(),
    check('password','El password es obligatorio').not().isEmpty().trim().escape(),
    check('ActividadeId','La actividad es obligatoria').not().isEmpty().trim().escape(),
    check('ActividadeId').custom( esActividadValida ),    
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId').custom(esPlanValido),
    check('pais','El país es obligatorio').not().isEmpty()  
    ] ,validarCampos, postEspecialista);

router.put('/:id',[
    validarJWT,
    check('id').custom(existeUsuario),
    check('nombre','El nombre es obligatorio').not().isEmpty().trim().escape(),
    check('apellidos','Los apellidos son obligatorios').not().isEmpty().trim().escape(),
    check('telefono','El teléfono es obligatorio').not().isEmpty().trim().escape(),
    check('provincia','La provincia es obligatoria').not().isEmpty().trim().escape(),
    check('ActividadeId','La actividad es obligatoria').not().isEmpty().trim().escape(),
    check('ActividadeId').custom( esActividadValida ),    
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId').custom(esPlanValido),
    check('pais','El país es obligatorio').not().isEmpty()
], validarCampos,putEspecialista);

router.delete('/:id',[  validarJWT,  
    check('id').custom(existeUsuario),
    
],validarCampos,deleteEspecialista);

router.patch('/modificarPlan/:id',[
    validarJWT,
    check('id').custom(existeUsuario),
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId').custom(esPlanValido),
], validarCampos,patchEspecialista);

export default router;  


