import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const models = {
    user: !!(prisma as any).user,
    task: !!(prisma as any).task,
    notification: !!(prisma as any).notification,
};
console.log('Explicit Model Check:', JSON.stringify(models, null, 2));
process.exit(0);
