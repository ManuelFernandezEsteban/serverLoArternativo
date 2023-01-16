import { Router } from 'express';
import { check } from 'express-validator';
import { getEspecialista, 
         postEspecialista, 
         getEspecialistas, 
         putEspecialista, 
         deleteEspecialista } from '../controllers/especialista.controller';
import { validarCampos } from '../middlewares/validar-campos';

const router = Router();

router.get('/:especialidad',getEspecialistas);

router.get('/especialista/:id',getEspecialista)

router.post('/',[
    check('correo','El correo no es válido').not().isEmail(),       
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('apellidos','Los apellidos son obligatorios').not().isEmpty(),
    check('telefono','El teléfono es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('ActividadeId','La actividad es obligatoria').not().isEmpty(),
    check('ActividadeId','No es una actividad permitida').isIn([1,2,3,4,5,6,7,8,9]),
    check('PlaneId','El plan es obligatorio').not().isEmpty(),
    check('PlaneId','No es un plan permitido').isIn([1,2]),
    ] ,validarCampos, postEspecialista);

router.put('/:id',putEspecialista);

router.delete('/:id',deleteEspecialista);

export default router;