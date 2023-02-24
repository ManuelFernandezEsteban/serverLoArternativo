"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const actividades_controller_1 = require("../controllers/actividades.controller");
const router = (0, express_1.Router)();
router.get('/:id', actividades_controller_1.getActividad);
router.get('/', actividades_controller_1.getActividades);
exports.default = router;
//# sourceMappingURL=actividades.route.js.map