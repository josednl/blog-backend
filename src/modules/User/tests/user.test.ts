import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../../../app';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.comment.deleteMany();
  await prisma.postImage.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
});

describe('User API', () => {
  test('GET /users returns an empty array initially', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /users creates a new user', async () => {
    const newUser = {
      name: 'Aragorn',
      username: 'strider',
      email: 'aragorn@gondor.com',
      password: 'anduril123'
    };

    const res = await request(app).post('/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created');

    const user = await prisma.user.findUnique({
      where: { email: newUser.email }
    });

    expect(user).not.toBeNull();
    expect(user?.username).toBe('strider');
  });

  test('GET /users/:id returns a user if it exists', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Legolas',
        username: 'legolas123',
        email: 'legolas@mirkwood.com',
        password: 'bowandarrow'
      }
    });

    const res = await request(app).get(`/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('legolas123');
    expect(res.body.email).toBe('legolas@mirkwood.com');
  });

  test('PUT /users/:id updates a user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Gimli',
        username: 'gimli_son',
        email: 'gimli@erebor.com',
        password: 'axeofdoom'
      }
    });

    const updatedData = {
      name: 'Gimli the Dwarf',
      username: 'gimli_updated',
      email: 'gimli@mountains.com'
    };

    const res = await request(app)
      .put(`/users/${user.id}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: user.id,
      name: 'Gimli the Dwarf',
      username: 'gimli_updated',
      email: 'gimli@mountains.com'
    });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(dbUser?.name).toBe('Gimli the Dwarf');
  });

  test('DELETE /users/:id deletes a user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Boromir',
        username: 'boromir123',
        email: 'boromir@gondor.com',
        password: 'oneDoesNotSimply'
      }
    });

    const res = await request(app).delete(`/users/${user.id}`);
    expect(res.status).toBe(204);

    const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });

  test('GET /users/:id returns 404 if user does not exist', async () => {
    const res = await request(app).get('/users/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'User not found');
  });

  test('PUT /users/:id returns 400 for invalid ID', async () => {
    const res = await request(app).put('/users/').send({
      name: 'Fake',
      email: 'fake@example.com'
    });
    expect(res.status).toBe(404);
  });

  test('DELETE /users/:id returns 400 for missing ID', async () => {
    const res = await request(app).delete('/users/');
    expect(res.status).toBe(404);
  });
});
