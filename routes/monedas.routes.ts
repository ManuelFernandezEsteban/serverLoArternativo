import { Router } from "express";
import { getMonedas } from "../controllers/monedas.controller";

const router = Router();

router.get('/',getMonedas);

export default router; 