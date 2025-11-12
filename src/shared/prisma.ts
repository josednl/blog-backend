import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const env = process.env.NODE_ENV || 'development';

if (!process.env.DATABASE_URL) {
  switch (env) {
    case 'development':
      process.env.DATABASE_URL = process.env.DEV_DATABASE_URL;
      break;
    case 'test':
      process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
      break;
    case 'production':
      process.env.DATABASE_URL = process.env.PROD_DATABASE_URL;
      break;
    default:
      throw new Error(`Unknown NODE_ENV: ${env}`);
  }
}

// console.log('DB Connection URL:', process.env.DATABASE_URL);

export const prisma = new PrismaClient();
