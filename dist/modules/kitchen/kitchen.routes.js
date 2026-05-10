"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kitchen_controller_1 = require("./kitchen.controller");
const router = (0, express_1.Router)();
router.get('/tickets/active', kitchen_controller_1.getTickets);
router.patch('/order-items/:itemId/ready', kitchen_controller_1.itemReady);
router.patch('/orders/:orderId/ready', kitchen_controller_1.orderReady); // <-- NEW ROUTE
exports.default = router;
//# sourceMappingURL=kitchen.routes.js.map