// src/middleware/error.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.issues,
    });
  }

  if (error.message === 'Task not found' || error.message === 'User not found') {
    return res.status(404).json({ success: false, message: error.message });
  }

  if (error.message.includes('Unauthorized')) {
    return res.status(403).json({ success: false, message: error.message });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};