import { Router } from 'express';
import { getHerramientaById, getHerramientasByEspecialista, getEspecialistasByHerramientas, getHerramientasByActividad } from '../controllers/herramientas.controller';
import { check } from 'express-validator';
import { esActividadValida, existeUsuario } from '../helpers/db-validators';
import { validarCampos } from '../middlewares/validar-campos';


const router = Router();

router.get('/:id',getHerramientaById);

router.get('/especialista/:id',[
    check('id').custom(existeUsuario)
],validarCampos,getHerramientasByEspecialista);

router.post('/especialistasByHerramientas/:actividad',[
    check('actividad','La actividad es obligatoria').not().isEmpty().trim().escape(),
    check('actividad').custom(esActividadValida),
    //check('herramientas','Hay que incluir al menos una herramienta').not().isEmpty()
],validarCampos,getEspecialistasByHerramientas);

router.get('/herramientas/:actividad',[
    check('actividad','La actividad es obligatoria').not().isEmpty().trim().escape(),
    check('actividad').custom(esActividadValida),
    
],validarCampos,getHerramientasByActividad);

export default router;

