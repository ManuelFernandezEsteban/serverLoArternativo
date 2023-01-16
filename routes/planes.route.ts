import { Router } from "express";
import { getPlan, getPlanes } from "../controllers/planes.controller";

const router = Router();

router.get('/:id',getPlan);

router.get('/',getPlanes);

export default router;