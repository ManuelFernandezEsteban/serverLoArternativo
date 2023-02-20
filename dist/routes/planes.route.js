"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const planes_controller_1 = require("../controllers/planes.controller");
const router = (0, express_1.Router)();
router.get('/:id', planes_controller_1.getPlan);
router.get('/', planes_controller_1.getPlanes);
exports.default = router;
//# sourceMappingURL=planes.route.js.map