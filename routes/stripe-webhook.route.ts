import express, { Router } from 'express';
import { stripeWebHooks } from '../controllers/stripeWebHooks.controller';

  


   const route = Router();

    route.post('/',express.raw({type: 'application/json'}),stripeWebHooks); 

export default route

