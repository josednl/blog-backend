import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // ========================
  // 1. PERMISSIONS
  // ========================
  const permissions = [
    { name: 'CREATE_USER', description: 'Can create new users' },
    { name: 'READ_USER', description: 'Can view user information' },
    { name: 'UPDATE_USER', description: 'Can update user information' },
    { name: 'DELETE_USER', description: 'Can delete users' },

    { name: 'CREATE_POST', description: 'Can create posts' },
    { name: 'READ_POST', description: 'Can read posts' },
    { name: 'UPDATE_POST', description: 'Can edit posts' },
    { name: 'DELETE_POST', description: 'Can delete posts' },

    { name: 'MANAGE_IMAGES', description: 'Can create or modify images' },

    { name: 'CREATE_COMMENT', description: 'Can write comments' },
    { name: 'DELETE_COMMENT', description: 'Can delete comments' },

    { name: 'READ_ROLES', description: 'Can view roles and permissions' },
    { name: 'MANAGE_ROLES', description: 'Can create or modify roles and permissions' },
  ];

  const createdPermissions = await Promise.all(
    permissions.map(async (perm) =>
      prisma.permission.upsert({
        where: { name: perm.name },
        update: { description: perm.description },
        create: perm,
      })
    )
  );

  const getPerm = (name: string) =>
    createdPermissions.find((p) => p.name === name)!;

  console.log('Permissions synchronized');

  // ========================
  // 2. ROLES
  // ========================
  const roles = [
    {
      name: 'admin',
      description: 'Full access to all system features',
      permissions: createdPermissions,
    },
    {
      name: 'editor',
      description: 'Can create and manage own posts and comments',
      permissions: [
        getPerm('CREATE_POST'),
        getPerm('READ_POST'),
        getPerm('UPDATE_POST'),
        getPerm('DELETE_POST'),
        getPerm('MANAGE_IMAGES'),
        getPerm('CREATE_COMMENT'),
        getPerm('DELETE_COMMENT'),
      ],
    },
    {
      name: 'user',
      description: 'Can view posts and write comments',
      permissions: [
        getPerm('READ_POST'),
        getPerm('MANAGE_IMAGES'),
        getPerm('CREATE_COMMENT'),
        getPerm('DELETE_COMMENT'),
      ],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
        permissions: {
          set: [],
          connect: role.permissions.map((p) => ({ id: p.id })),
        },
      },
      create: {
        name: role.name,
        description: role.description,
        permissions: {
          connect: role.permissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  console.log('Roles synchronized');

  // ========================
  // 3. ADMIN USER
  // ========================
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) throw new Error('Admin role not found — seed roles first.');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      username: ADMIN_USERNAME,
      password: hashedPassword,
      roleId: adminRole.id,
    },
    create: {
      name: ADMIN_NAME,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });
  console.log('Admin user created/updated');

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
