"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waiter_controller_1 = require("./waiter.controller");
const router = (0, express_1.Router)();
router.get('/orders/pending', waiter_controller_1.getPending);
router.patch('/orders/:id/confirm', waiter_controller_1.confirm);
router.get('/orders/ready', waiter_controller_1.getReady);
router.get('/menu', waiter_controller_1.getMenu);
exports.default = router;
//# sourceMappingURL=waiter.routes.js.map