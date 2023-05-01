import { Router } from 'express';
import { createCheckoutSession } from '../controllers/checkout.controller';
import { validarCampos } from '../middlewares/validar-campos';

const router = Router(); 
router.post('/',[
    
],validarCampos,createCheckoutSession);

 
 

export default router;