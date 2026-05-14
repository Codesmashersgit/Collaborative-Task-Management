// src/types/index.ts
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'ToDo' | 'InProgress' | 'Review' | 'Completed';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  assignedToId: string;
  creator: User;
  assignedTo: User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export interface DashboardData {
  assignedTasks: Task[];
  createdTasks: Task[];
  overdueTasks: Task[];
  stats: {
    totalAssigned: number;
    totalCreated: number;
    totalOverdue: number;
    totalCompleted: number;
  };
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  assignedToId: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
  assignedToId?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ path: string; message: string }>;
}