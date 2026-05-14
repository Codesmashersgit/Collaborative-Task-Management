import axios, { AxiosError } from 'axios';
import type { 
  AuthResponse, 
  ApiResponse, 
  Task, 
  User, 
  DashboardData, 
  Notification,
  CreateTaskInput,
  UpdateTaskInput 
} from '../types';

// Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(axiosError);
  }
);

// -------- Auth API --------
export const authApi = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    // Backend returns { success, data: User, token }
    return { user: response.data.data, token: response.data.token };
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Backend returns { success, data: User, token }
    return { user: response.data.data, token: response.data.token };
  },

  logout: async () => {
    const response = await api.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data; // Return actual User
  },

  updateProfile: async (data: { name: string }) => {
    const response = await api.patch<ApiResponse<User>>('/auth/profile', data);
    return response.data.data; // Return updated User
  },
};

// -------- User API --------
export const userApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    return response.data;
  },
};

// -------- Task API --------
export const taskApi = {
  getAll: async (params?: {
    status?: string;
    priority?: string;
    assignedToId?: string;
    creatorId?: string;
  }) => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskInput) => {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskInput) => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardData>>('/tasks/dashboard');
    return response.data;
  },

  search: async (query: string) => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks/search', { params: { q: query } });
    return response.data;
  },
};

// -------- Notification API --------
export const notificationApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post<ApiResponse<void>>('/notifications/read-all');
    return response.data;
  },
};

// -------- Admin API --------
export const adminApi = {
  getStats: async () => {
    const response = await api.get<ApiResponse<any>>('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get<ApiResponse<User[]>>('/admin/users');
    return response.data;
  },
  updateRole: async (userId: string, role: 'ADMIN' | 'MEMBER') => {
    const response = await api.patch<ApiResponse<User>>('/admin/role', { userId, role });
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/admin/users/${userId}`);
    return response.data;
  },
  deleteTask: async (taskId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/admin/tasks/${taskId}`);
    return response.data;
  },
  inviteUser: async (data: any) => {
    const response = await api.post<ApiResponse<User>>('/admin/users', data);
    return response.data;
  },
};

// -------- Invitation API --------
export const invitationApi = {
  get: async (token: string) => {
    const response = await api.get<ApiResponse<any>>(`/invitations/${token}`);
    return response.data;
  },
  accept: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/invitations/accept', data);
    return response.data;
  },
};





