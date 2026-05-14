import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email: tsx src/scripts/make-admin.ts user@example.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(`✅ User ${user.email} is now an ADMIN.`);
  } catch (error) {
    console.error(`❌ User with email ${email} not found or error occurred.`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
