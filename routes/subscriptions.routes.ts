import { Router } from "express";
import { getSubscription } from '../controllers/subscriptions.controllers';


const router = Router();
/*
router.post('/',createSubscription);

router.post('/webhook',webHook);

router.post('/customer-portal',customerPortal);*/

router.get('/:id',getSubscription)



export default router;    