// src/server.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { setupSocketHandlers } from './src/socket/socket.handler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

setupSocketHandlers(io);

// Make io available globally
app.set('io', io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  httpServer.close();
});