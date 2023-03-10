import { Router } from 'express';
import { getHerramientaById, getHerramientasByEspecialista } from '../controllers/herramientas.controller';


const router = Router();

router.get('/:id',getHerramientaById);

router.get('/especialista/:id',getHerramientasByEspecialista)

export default router;