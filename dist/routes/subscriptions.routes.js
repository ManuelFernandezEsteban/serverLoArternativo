"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptions_controllers_1 = require("../controllers/subscriptions.controllers");
const router = (0, express_1.Router)();
/*
router.post('/',createSubscription);

router.post('/webhook',webHook);

router.post('/customer-portal',customerPortal);*/
router.get('/:id', subscriptions_controllers_1.getSubscription);
exports.default = router;
//# sourceMappingURL=subscriptions.routes.js.map