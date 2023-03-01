"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptions_controllers_1 = require("../controllers/subscriptions.controllers");
const router = (0, express_1.Router)();
router.post('/', subscriptions_controllers_1.createSubscription);
router.post('/webhook', subscriptions_controllers_1.webHook);
router.post('/customer-portal', subscriptions_controllers_1.customerPortal);
router.get('/create-checkout-session', subscriptions_controllers_1.createSession);
exports.default = router;
//# sourceMappingURL=subscriptions.routes.js.map