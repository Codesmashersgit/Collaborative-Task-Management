import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { MailService } from './mail.service.js';
import crypto from 'crypto';

export class AdminService {
  constructor(private prisma: PrismaClient, private mailService: MailService) {}

  async getSystemStats() {
    const [userCount, taskCount, completedTasks, activeNotifications] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.task.count(),
      this.prisma.task.count({ where: { status: 'Completed' } }),
      this.prisma.notification.count({ where: { read: false } }),
    ]);

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    const tasksByStatus = await this.prisma.task.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      userCount,
      taskCount,
      completedTasks,
      activeNotifications,
      usersByRole,
      tasksByStatus,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            createdTasks: true,
            assignedTasks: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(userId: string, role: 'ADMIN' | 'MEMBER') {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async deleteUser(userId: string) {
    // Delete all dependencies to avoid foreign key constraints
    await this.prisma.notification.deleteMany({ where: { userId } });
    
    // Delete tasks where user is creator or assignee
    await this.prisma.task.deleteMany({
      where: {
        OR: [
          { creatorId: userId },
          { assignedToId: userId }
        ]
      }
    });
    
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async deleteTask(taskId: string) {
    // In our current schema, notifications are not directly linked to task IDs by foreign keys,
    // but if they were, we would delete them here.
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async inviteUser(data: any) {
    const { email, role } = data;
    
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const invitation = await this.prisma.invitation.upsert({
      where: { email },
      update: {
        token,
        role: role || 'MEMBER',
        expiresAt,
      },
      create: {
        email,
        token,
        role: role || 'MEMBER',
        expiresAt,
      },
    });

    try {
      await this.mailService.sendInvitation(email, token, role || 'MEMBER');
    } catch (error) {
      console.error('Failed to send invite email:', error);
    }

    return invitation;
  }
}


