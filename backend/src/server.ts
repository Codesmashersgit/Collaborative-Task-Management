// src/server.ts
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { setupSocketHandlers } from './socket/socket.handler.js';
import { PrismaClient } from '@prisma/client';

// Basic parsing/debug to show what DATABASE_URL is being loaded (no password printed)
const rawDbUrl = process.env.DATABASE_URL;
if (!rawDbUrl) {
  console.warn('DATABASE_URL is not set');
} else {
  try {
    const cleaned = rawDbUrl.replace(/^\"|\"$/g, '');
    const parsed = new URL(cleaned);
    console.log('DB parse:', {
      user: parsed.username,
      host: parsed.hostname,
      port: parsed.port,
      database: parsed.pathname.replace(/^\//, ''),
    });
  } catch (err) {
    console.error('Failed to parse DATABASE_URL:', err instanceof Error ? err.message : String(err));
  }
}

const prisma = new PrismaClient();
const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

setupSocketHandlers(io);

// Make io available globally
app.set('io', io);

const PORT = process.env.PORT || 3001;

// Wait for prisma to connect
prisma.$connect()
  .then(async () => {
    console.log('✅ Connected to the database successfully');
    const startPort = Number(process.env.PORT) || 3001;
    let port = startPort;
    const maxTries = 10;

    for (let i = 0; i < maxTries; i++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const onError = (err: any) => reject(err);
          httpServer.once('error', onError);
          httpServer.listen(port, () => {
            httpServer.removeListener('error', onError);
            resolve();
          });
        });
        console.log(`🚀 Server running on port ${port}`);
        break;
      } catch (err: any) {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} in use, trying ${port + 1}`);
          port += 1;
          continue;
        }
        console.error('❌ Failed to start server:', err instanceof Error ? err.message : String(err));
        process.exit(1);
      }
    }
  })
  .catch((err) => {
    console.error('❌ Failed to connect to the database:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  httpServer.close();
});