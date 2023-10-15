"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monedas_controller_1 = require("../controllers/monedas.controller");
const router = (0, express_1.Router)();
router.get('/', monedas_controller_1.getMonedas);
exports.default = router;
//# sourceMappingURL=monedas.routes.js.map