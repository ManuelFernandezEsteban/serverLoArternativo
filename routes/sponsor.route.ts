import { Router } from "express";
import { getSponsor, getSponsors } from '../controllers/sponsors.controller';


const router = Router();

router.get('/:id',getSponsor);

router.get('/sponsors/:tipo',getSponsors);

export default router;