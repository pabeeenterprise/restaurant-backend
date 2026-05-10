"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Make sure placeOrder is imported here!
const public_controller_1 = require("./public.controller");
const router = (0, express_1.Router)();
router.get('/menu', public_controller_1.getMenu);
router.post('/session/start', public_controller_1.startSession);
router.post('/orders', public_controller_1.placeOrder); // <-- New route added
exports.default = router;
//# sourceMappingURL=public.routes.js.map