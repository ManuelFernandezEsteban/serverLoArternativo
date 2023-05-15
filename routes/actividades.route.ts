import { Router } from "express";
import { check } from "express-validator";
import { getActividad, getActividades } from "../controllers/actividades.controller";
import { esActividadValida } from "../helpers/db-validators";
import { validarCampos } from "../middlewares/validar-campos";

const router = Router();

router.get('/:id',[
    check('actividad','La actividad es obligatoria').not().isEmpty().trim().escape(),
    check('actividad').custom(esActividadValida)
],validarCampos,getActividad);

router.get('/',getActividades);

export default router; 