import { Router } from "express";
import { getEvento, getEventosEspecialista } from '../controllers/eventos.controller';


const router =Router();

router.get('/:id',getEvento);

router.get('/eventos/:especialista',getEventosEspecialista);

export default router;