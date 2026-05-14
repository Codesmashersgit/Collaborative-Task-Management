// src/repositories/task.repository.ts
import { PrismaClient } from '@prisma/client';
import type { Task, Priority, Status } from '@prisma/client';

export class TaskRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Creates a new task in the database
   * @param data Task creation data
   * @returns Created task with relations
   */
  async create(data: {
    title: string;
    description: string;
    dueDate: string | Date; // Accept string from API or Date
    priority: Priority;
    creatorId: string;
    assignedToId: string;
  }): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...data,
        dueDate: new Date(data.dueDate), // ensure Date type
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll(filters?: {
    status?: Status;
    priority?: Priority;
    assignedToId?: string;
    creatorId?: string;
  }): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        status: filters?.status,
        priority: filters?.priority,
        assignedToId: filters?.assignedToId,
        creatorId: filters?.creatorId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Task, 'creator' | 'assignedTo'>>
  ): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }

  async findOverdueTasks(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        assignedToId: userId,
        dueDate: { lt: new Date() },
        status: { not: 'Completed' },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async searchTasks(query: string, userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        OR: [
          { creatorId: userId },
          { assignedToId: userId },
        ],
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, role: true }
    });
  }

  async getAllAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });
  }
}
