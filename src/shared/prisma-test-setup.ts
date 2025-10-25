import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const prisma = new PrismaClient();

beforeAll(async () => {
  execSync('node scripts/run-prisma.js migrate deploy', { stdio: 'inherit' });
});

beforeEach(async () => {
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.postImage.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany()
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
