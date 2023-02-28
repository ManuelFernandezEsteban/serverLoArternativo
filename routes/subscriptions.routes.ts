import { Router } from "express";
import { createSession, createSubscription, customerPortal, webHook } from '../controllers/subscriptions.controllers';


const router = Router();

router.post('/',createSubscription);

router.post('/webhook',webHook);

router.post('/customer-portal',customerPortal);

router.get('/create-checkout-session',createSession)



export default router;    