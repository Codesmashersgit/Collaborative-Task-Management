import { Router } from 'express';
import { prisma } from './config/database.js';
import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { UserRepository } from './repositories/user.repository.js';
import { TaskController } from './controllers/task.controller.js';
import { TaskService } from './services/task.service.js';
import { TaskRepository } from './repositories/task.repository.js';
import { NotificationService } from './services/notification.js';
import { UserController } from './controllers/user.controller.js';
import { UserService } from './services/user.service.js';
import { authenticate, authorize } from './middleware/auth.middleware.js';

export const setupRoutes = (app: any) => {
    const router = Router();

    // Dependencies
    const userRepository = new UserRepository(prisma);
    const notificationService = new NotificationService(prisma);
    const taskRepository = new TaskRepository(prisma);

    const authService = new AuthService(userRepository);
    const userService = new UserService(userRepository);
    const taskService = new TaskService(taskRepository, notificationService);

    const authController = new AuthController(authService);
    const userController = new UserController(userService);
    const taskController = new TaskController(taskService);

    // Auth Routes
    router.post('/auth/register', authController.register);
    router.post('/auth/login', authController.login);
    router.post('/auth/logout', authController.logout);
    router.get('/auth/me', authenticate, authController.me);

    // User Routes
    router.get('/users/profile', authenticate, userController.getProfile);
    router.get('/users', authenticate, userController.getAllUsers);
    router.patch('/users/profile', authenticate, userController.updateProfile);

    // Task Routes
    router.post('/tasks', authenticate, authorize(['ADMIN']), taskController.createTask);
    router.get('/tasks', authenticate, taskController.getTasks);
    router.get('/tasks/search', authenticate, taskController.searchTasks);
    router.get('/tasks/dashboard', authenticate, taskController.getDashboard);
    router.get('/tasks/:id', authenticate, taskController.getTaskById);
    router.patch('/tasks/:id', authenticate, taskController.updateTask);
    router.delete('/tasks/:id', authenticate, taskController.deleteTask);

    app.use('/api/v1', router);
};
