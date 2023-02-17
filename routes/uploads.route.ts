import { Router } from 'express';
import { uploadAvatarEspecialista, uploadEventoImagen, uploadEventoInfo, uploadVideoEspecialista} from './../libs/multer'
import { avatarEspecialista, eventoImagen, eventoInfo, videoEspecialista } from '../controllers/uploads.controller';

//import multer from 'multer';
import { validarJWT } from '../middlewares/validar-JWT';

const router = Router();


router.post('/avatarEspecialista',[validarJWT,uploadAvatarEspecialista], avatarEspecialista);

router.post('/videoEspecialista',[validarJWT,uploadVideoEspecialista], videoEspecialista);

router.post('/eventoImagen/:id',[validarJWT,uploadEventoImagen],eventoImagen );

router.post('/eventoInfo/:id',[validarJWT,uploadEventoInfo], eventoInfo);

export default router;