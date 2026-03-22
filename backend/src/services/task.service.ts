// src/services/task.service.ts
import { TaskRepository } from '../repositories/task.repository.js';
import type { CreateTaskInput, UpdateTaskInput } from '../dto/task.dto.js';
import { Priority, Status } from '@prisma/client';
import { NotificationService } from './notification.js';

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: NotificationService
  ) { }

  /**
   * Creates a new task and sends notification to assignee
   * @param userId Creator's user ID
   * @param input Task creation data
   * @throws Error if assignee doesn't exist
   */
  async createTask(userId: string, input: CreateTaskInput) {
    const task = await this.taskRepository.create({
      ...input,
      dueDate: new Date(input.dueDate),
      creatorId: userId,
    });

    // Send notification to assignee
    await this.notificationService.create({
      userId: input.assignedToId,
      message: `New task assigned: ${task.title}`,
      type: 'TASK_ASSIGNED',
    });

    return task;
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async getAllTasks(filters?: {
    status?: Status;
    priority?: Priority;
    assignedToId?: string;
    creatorId?: string;
  }) {
    return this.taskRepository.findAll(filters);
  }

  /**
   * Updates a task and sends notifications if assignee changed
   */
  async updateTask(id: string, userId: string, input: UpdateTaskInput) {
    const existingTask = await this.getTaskById(id);

    // Check authorization
    if (existingTask.creatorId !== userId && existingTask.assignedToId !== userId) {
      throw new Error('Unauthorized to update this task');
    }

    const updateData: any = { ...input };
    if (input.dueDate) {
      updateData.dueDate = new Date(input.dueDate);
    }

    const updatedTask = await this.taskRepository.update(id, updateData);

    // If assignee changed, send notification
    if (input.assignedToId && input.assignedToId !== existingTask.assignedToId) {
      await this.notificationService.create({
        userId: input.assignedToId,
        message: `Task reassigned to you: ${updatedTask.title}`,
        type: 'TASK_REASSIGNED',
      });
    }

    return updatedTask;
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.getTaskById(id);

    if (task.creatorId !== userId) {
      throw new Error('Only the creator can delete this task');
    }

    return this.taskRepository.delete(id);
  }

  async getUserDashboard(userId: string) {
    const [assignedTasks, createdTasks, overdueTasks] = await Promise.all([
      this.taskRepository.findAll({ assignedToId: userId }),
      this.taskRepository.findAll({ creatorId: userId }),
      this.taskRepository.findOverdueTasks(userId),
    ]);

    return {
      assignedTasks,
      createdTasks,
      overdueTasks,
      stats: {
        totalAssigned: assignedTasks.length,
        totalCreated: createdTasks.length,
        totalOverdue: overdueTasks.length,
      },
    };
  }

  async searchTasks(query: string, userId: string) {
    return this.taskRepository.searchTasks(query, userId);
  }
}