import { Router } from 'express';
import {upload} from './../libs/multer'
import { cargarArchivo } from '../controllers/uploads.controller';

//import multer from 'multer';

const router = Router();


router.post('/',upload, cargarArchivo)


export default router;