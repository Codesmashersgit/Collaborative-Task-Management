// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import type { Task, Notification } from '../types';

let socket: Socket | null = null;

/**
 * Get or create Socket.io connection
 * @param token JWT token for authentication
 * @returns Socket.io instance
 */
export const getSocket = (token?: string): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const authToken = token || localStorage.getItem('token');

  socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3001', {
    auth: {
      token: authToken,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket.io connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.io disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error.message);
  });

  return socket;
};

/**
 * Disconnect Socket.io connection
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Subscribe to task updates
 * @param callback Function to call when task is updated
 */
export const onTaskUpdate = (callback: (data: { type: string, data: any }) => void) => {
  const s = getSocket();
  s.on('task:updated', callback);
  return () => s.off('task:updated', callback);
};

/**
 * Subscribe to task deletions
 * @param callback Function to call when task is deleted
 */
export const onTaskDelete = (callback: (data: { id: string }) => void) => {
  const s = getSocket();
  s.on('task:deleted', callback);
  return () => s.off('task:deleted', callback);
};

/**
 * Subscribe to new notifications
 * @param callback Function to call when notification is received
 */
export const onNotification = (callback: (notification: Notification) => void) => {
  const s = getSocket();
  s.on('notification:new', callback);
  return () => s.off('notification:new', callback);
};

/**
 * Manually emit task update (useful for optimistic updates)
 * @param task Updated task data
 */
export const emitTaskUpdate = (task: Task) => {
  const s = getSocket();
  s.emit('task:update', task);
};