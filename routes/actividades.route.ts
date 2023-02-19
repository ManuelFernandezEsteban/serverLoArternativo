import { Router } from "express";
import { getActividad, getActividades } from "../controllers/actividades.controller";

const router = Router();

router.get('/:id',getActividad);

router.get('/',getActividades);

export default router; 