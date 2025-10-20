jest.mock('../user.repository.prisma');

import request from 'supertest';
import express from 'express';
import userRouter from '../user.routes';
import { PrismaUserRepository } from '../user.repository.prisma';
import { User } from '../user.entity';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

const MockRepo = PrismaUserRepository as unknown as {
  reset: () => void;
  insert: (user: User) => void;
};

beforeEach(() => {
  MockRepo.reset();
});

test('GET /users return an initially empty array', async () => {
  const res = await request(app).get('/users');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(0);
});

test('POST /users creates a user', async () => {
  const newUser = {
    id: '1234',
    name: 'Frodo',
    username: 'frodo123',
    email: 'frodo@shire.com',
    password: '123456'
  };

  const res = await request(app).post('/users').send(newUser);
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('message', 'User created');

  const getRes = await request(app).get('/users');
  expect(getRes.body.length).toBe(1);
});

test('GET /users/:id returns user if it exists', async () => {
  const user = new User(
    '999',
    'Sam',
    'samwise',
    'sam@shire.com',
    'po-ta-toes'
  );

  MockRepo.insert(user);

  const res = await request(app).get(`/users/${user.id}`);
  expect(res.status).toBe(200);
  expect(res.body.username).toBe('samwise');
});

test('PUT /users/:id updates an existing user', async () => {
  const originalUser = new User(
    '2468',
    'Merry',
    'merry_b',
    'merry@shire.com',
    'brandybuck'
  );

  MockRepo.insert(originalUser);

  const updatedData = {
    name: 'Meriadoc',
    username: 'merry_updated',
    email: 'meri@shire.com'
  };

  const res = await request(app)
    .put(`/users/${originalUser.id}`)
    .send(updatedData);

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    id: originalUser.id,
    name: 'Meriadoc',
    username: 'merry_updated',
    email: 'meri@shire.com'
  });

  const getRes = await request(app).get(`/users/${originalUser.id}`);
  expect(getRes.status).toBe(200);
  expect(getRes.body.name).toBe('Meriadoc');
  expect(getRes.body.username).toBe('merry_updated');
  expect(getRes.body.email).toBe('meri@shire.com');
});


test('DELETE /users/:id deletes existing user', async () => {
  const user = new User(
    '5678',
    'Pippin',
    'pippin123',
    'pippin@shire.com',
    'lothlorien'
  );

  MockRepo.insert(user);

  const resDel = await request(app).delete(`/users/${user.id}`);
  expect(resDel.status).toBe(204);

  const resGet = await request(app).get(`/users/${user.id}`);
  expect(resGet.status).toBe(404);
});
