"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderReady = exports.itemReady = exports.getTickets = void 0;
const kitchenService = __importStar(require("./kitchen.service"));
const getTickets = async (req, res) => {
    try {
        const tickets = await kitchenService.getActiveTickets();
        res.json({ success: true, tickets });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTickets = getTickets;
const itemReady = async (req, res) => {
    try {
        const { itemId } = req.params;
        const result = await kitchenService.markItemReady(String(itemId));
        res.json({ success: true, message: 'Item marked as ready', result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.itemReady = itemReady;
// NEW: Controller for the whole order
const orderReady = async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await kitchenService.markOrderReady(String(orderId));
        res.json({ success: true, message: 'Entire order marked as ready to serve!', result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.orderReady = orderReady;
//# sourceMappingURL=kitchen.controller.js.map