"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
const validar_campos_1 = require("../middlewares/validar-campos");
const router = (0, express_1.Router)();
router.post('/', [], validar_campos_1.validarCampos, checkout_controller_1.createCheckoutSession);
exports.default = router;
//# sourceMappingURL=checkout.routes.js.map