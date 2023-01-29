import { Router } from "express";
import { check } from "express-validator";
import { deleteEvento, getEvento, getEventosActividad, getEventosEspecialista, postEvento, putEvento } from '../controllers/eventos.controller';
import { validarCampos } from "../middlewares/validar-campos";
import { existeUsuario, planPermitido, esActividadValida, existeEspecialistaEvento, planPermitidoEvento } from '../helpers/db-validators';
import { validarJWT } from '../middlewares/validar-JWT';


const router =Router();

router.get('/:id',getEvento);

router.get('/eventos/:especialista',[
    check('especialista').custom(existeUsuario),
    check('especialista').custom(planPermitido),
],validarCampos,getEventosEspecialista);

router.get('/eventoxactividad/:actividad',[
    check('actividad').custom(esActividadValida)
],validarCampos,getEventosActividad);

router.post('/',[
    validarJWT,
    check('evento','El nombre del evento es obligatorio').notEmpty(),
    check('descripcion','La descripción del evento es obligatoria').notEmpty(),
    check('online','El campo online es obligatorio').notEmpty(),
    check('email','Debe ser un email válido').isEmail(),
    check('precio').notEmpty().isNumeric(),
    check('EspecialistaId').custom(existeEspecialistaEvento),
    check('EspecialistaId').custom(planPermitidoEvento),
    check('ActividadeId').custom(esActividadValida)

],validarCampos,postEvento);

router.put('/:id',[validarJWT,
    check('evento','El nombre del evento es obligatorio').notEmpty(),
    check('descripcion','La descripción del evento es obligatoria').notEmpty(),
    check('online','El campo online es obligatorio').notEmpty(),
    check('email','Debe ser un email válido').isEmail(),
    check('precio','El precio no puede ser vacío').notEmpty(),
    check('precio','El precio tiene que ser un número').isNumeric(),
    check('fecha','No puede ser vacía').notEmpty(),
    check('fecha','Tiene que ser una fecha válida').isDate(),
    check('EspecialistaId').custom(existeEspecialistaEvento),
    check('EspecialistaId').custom(planPermitidoEvento),
    check('ActividadeId').custom(esActividadValida)

],validarCampos,putEvento);

router.delete('/:id',deleteEvento);

export default router;