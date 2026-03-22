// src/dto/task.dto.ts
import { z } from 'zod';

export const CreateTaskDto = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string(), // Relaxed to handle different date formats from frontend
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  assignedToId: z.string().min(1), // Relaxed from .uuid()
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  status: z.enum(['ToDo', 'InProgress', 'Review', 'Completed']).optional(),
  assignedToId: z.string().min(1).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;