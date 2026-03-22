// src/app.ts
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { errorHandler } from './middleware/error.middleware.js';
import { setupRoutes } from './routes.js';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  setupRoutes(app);

  // Error handling
  app.use(errorHandler);

  return app;
};