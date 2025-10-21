import { execSync } from 'child_process'; 
import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

let url;
switch (nodeEnv) {
  case 'development':
    url = process.env.DEV_DATABASE_URL;
    break;
  case 'test':
    url = process.env.TEST_DATABASE_URL;
    break;
  case 'production':
    url = process.env.PROD_DATABASE_URL;
    break;
  default:
    console.error(`Unknown NODE_ENV: ${nodeEnv}`);
    process.exit(1);
}

if (!url) {
  console.error(`Missing database URL for NODE_ENV=${nodeEnv}`);
  process.exit(1);
}

process.env.DATABASE_URL = url;

const [, , ...args] = process.argv;
if (args.length === 0) {
  console.error('You must provide a Prisma command, e.g., "migrate dev"');
  process.exit(1);
}

const prismaCmd = `npx prisma ${args.join(' ')}`;
try {
  execSync(prismaCmd, { stdio: 'inherit', env: process.env });
} catch (e) {
  process.exit(1);
}
