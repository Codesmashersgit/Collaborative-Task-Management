// src/server.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { setupSocketHandlers } from './socket/socket.handler.js';
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

// Wait for prisma to connect
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to the database successfully');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  httpServer.close();
});