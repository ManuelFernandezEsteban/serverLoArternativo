"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sponsors_controller_1 = require("../controllers/sponsors.controller");
const router = (0, express_1.Router)();
router.get('/:id', sponsors_controller_1.getSponsor);
router.get('/sponsors/:tipo', sponsors_controller_1.getSponsors);
exports.default = router;
//# sourceMappingURL=sponsor.route.js.map