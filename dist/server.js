"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const public_routes_1 = __importDefault(require("./modules/public/public.routes"));
const waiter_routes_1 = __importDefault(require("./modules/waiter/waiter.routes"));
const kitchen_routes_1 = __importDefault(require("./modules/kitchen/kitchen.routes"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Server is healthy' });
});
app.use('/api/public', public_routes_1.default);
app.use('/api/staff/waiter', waiter_routes_1.default);
app.use('/api/staff/kitchen', kitchen_routes_1.default);
// Socket.io
exports.io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join-waiter-room', () => {
        socket.join('waiter-room');
        console.log('✅ Waiter joined realtime room');
    });
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server + Socket.io on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map