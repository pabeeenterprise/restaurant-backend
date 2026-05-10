import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import publicRoutes from './modules/public/public.routes';
import waiterRoutes from './modules/waiter/waiter.routes';
import kitchenRoutes from './modules/kitchen/kitchen.routes';

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { 
  cors: { origin: "*" } 
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

app.use('/api/public', publicRoutes);
app.use('/api/staff/waiter', waiterRoutes);
app.use('/api/staff/kitchen', kitchenRoutes);

// 🔥 SOCKET.IO FOR ORDERS
io.on('connection', (socket) => {
  console.log('👤 Client connected:', socket.id);
  
  socket.on('join-waiter-room', () => {
    socket.join('waiter-room');
    console.log('✅ Waiter joined realtime room:', socket.id);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server + Socket.io on http://localhost:${PORT}`);
});