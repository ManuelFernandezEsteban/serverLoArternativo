import { Router } from 'express';
import { check } from 'express-validator';
import { cargarArchivo } from '../controllers/uploads.controller';

import { validarCampos } from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-JWT';

const router = Router();


router.post('/',[validarJWT],cargarArchivo)


export default router;