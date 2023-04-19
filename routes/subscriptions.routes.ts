import { Router } from "express";
import { deleteSubscription, getSubscription } from '../controllers/subscriptions.controllers';


const router = Router();
/*
router.post('/',createSubscription);

router.post('/webhook',webHook);

router.post('/customer-portal',customerPortal);*/

router.get('/:id',getSubscription)

router.delete('/cancelar/:id',deleteSubscription)

export default router;    