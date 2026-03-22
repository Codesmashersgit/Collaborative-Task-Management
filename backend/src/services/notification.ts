import { PrismaClient } from '@prisma/client';
import type { Notification } from '@prisma/client';

export class NotificationService {
    constructor(private prisma: PrismaClient) { }

    async create(data: {
        userId: string;
        message: string;
        type: string;
    }): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                ...data,
                read: false,
            },
        });
    }

    async getUserNotifications(userId: string): Promise<Notification[]> {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string): Promise<Notification> {
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string): Promise<void> {
        await this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
    }
}
