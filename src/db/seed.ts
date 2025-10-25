import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and permissions...');

  const permissions = [
    { name: 'CREATE_USER', description: 'Can create new users' },
    { name: 'READ_USER', description: 'Can view user information' },
    { name: 'UPDATE_USER', description: 'Can update user information' },
    { name: 'DELETE_USER', description: 'Can delete users' },

    { name: 'CREATE_POST', description: 'Can create posts' },
    { name: 'READ_POST', description: 'Can read posts' },
    { name: 'UPDATE_POST', description: 'Can edit posts' },
    { name: 'DELETE_POST', description: 'Can delete posts' },

    { name: 'CREATE_COMMENT', description: 'Can write comments' },
    { name: 'DELETE_COMMENT', description: 'Can delete comments' },

    { name: 'READ_ROLES', description: 'Can view roles and permissions' },
    { name: 'MANAGE_ROLES', description: 'Can create or modify roles and permissions' },
  ];

  const createdPermissions = await Promise.all(
    permissions.map(async (perm) =>
      prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      })
    )
  );

  const getPerm = (name: string) => createdPermissions.find((p) => p.name === name)!;

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
        getPerm('CREATE_COMMENT'),
        getPerm('DELETE_COMMENT'),
      ],
    },
    {
      name: 'user',
      description: 'Can view posts and write comments',
      permissions: [
        getPerm('READ_POST'),
        getPerm('CREATE_COMMENT'),
      ],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description,
        permissions: {
          connect: role.permissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
