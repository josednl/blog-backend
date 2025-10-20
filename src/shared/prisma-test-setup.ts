import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

beforeEach(async () => {
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.postImage.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
    prisma.userType.deleteMany()
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
