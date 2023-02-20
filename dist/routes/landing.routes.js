"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/group-one', (req, res) => {
    res.sendFile(__dirname + '/public/landings/group-one/index.html');
});
router.get('/group-two', (req, res) => {
    res.sendFile(__dirname + '/public/landings/group-two/index.html');
});
router.get('/group-three', (req, res) => {
    res.sendFile(__dirname + '/public/landings/group-three/index.html');
});
exports.default = router;
//# sourceMappingURL=landing.routes.js.map