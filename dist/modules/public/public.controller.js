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
exports.placeOrder = exports.startSession = exports.getMenu = void 0;
const publicService = __importStar(require("./public.service"));
const server_1 = require("../../server");
// Ensure 'export' is at the start of every function
const getMenu = async (req, res) => {
    try {
        const tableToken = String(req.query.table_token || '').trim();
        const data = await publicService.getMenuByTableToken(tableToken);
        res.json({ success: true, ...data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMenu = getMenu;
const startSession = async (req, res) => {
    try {
        const session = await publicService.startCustomerSession(req.body);
        res.status(201).json({ success: true, session });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.startSession = startSession;
const placeOrder = async (req, res) => {
    try {
        const { session_token, items, notes } = req.body;
        if (!session_token || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'session_token and an array of items are required',
            });
        }
        const order = await publicService.createOrder({ session_token, items, notes });
        publicService.emitOrderCreated(server_1.io, order);
        return res.status(201).json({ success: true, order });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};
exports.placeOrder = placeOrder;
//# sourceMappingURL=public.controller.js.map