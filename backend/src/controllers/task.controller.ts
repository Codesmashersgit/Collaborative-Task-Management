
import type { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto.js';
import { emitTaskUpdate } from '../socket/socket.handler.js';

export class TaskController {
  constructor(private taskService: TaskService) { }

  createTask = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const input = CreateTaskDto.parse(req.body);

    const task = await this.taskService.createTask(userId, input);

    // Emit real-time update
    const io = req.app.get('io');
    emitTaskUpdate(io, { type: 'TASK_CREATED', data: task });

    res.status(201).json({ success: true, data: task });
  };

  getTasks = async (req: Request, res: Response) => {
    const { status, priority, assignedToId, creatorId } = req.query;

    const tasks = await this.taskService.getAllTasks({
      status: status as any,
      priority: priority as any,
      assignedToId: assignedToId as string,
      creatorId: creatorId as string,
    });

    res.json({ success: true, data: tasks });
  };

  getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await this.taskService.getTaskById(id!);
    res.json({ success: true, data: task });
  };

  updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const input = UpdateTaskDto.parse(req.body);

    const task = await this.taskService.updateTask(id!, userId, input);

    // Emit real-time update
    const io = req.app.get('io');
    emitTaskUpdate(io, { type: 'TASK_UPDATED', data: task });

    res.json({ success: true, data: task });
  };

  deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await this.taskService.deleteTask(id!, userId);

    // Emit real-time update
    const io = req.app.get('io');
    emitTaskUpdate(io, { type: 'TASK_DELETED', data: { id } });

    res.json({ success: true, message: 'Task deleted successfully' });
  };

  getDashboard = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const dashboard = await this.taskService.getUserDashboard(userId);
    res.json({ success: true, data: dashboard });
  };

  searchTasks = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { query } = req.query;
    const tasks = await this.taskService.searchTasks(query as string, userId);
    res.json({ success: true, data: tasks });
  };
}