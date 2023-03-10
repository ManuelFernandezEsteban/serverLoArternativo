"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const herramientas_controller_1 = require("../controllers/herramientas.controller");
const router = (0, express_1.Router)();
router.get('/:id', herramientas_controller_1.getHerramientaById);
router.get('/especialista/:id', herramientas_controller_1.getHerramientasByEspecialista);
exports.default = router;
//# sourceMappingURL=herramientas.routes.js.map