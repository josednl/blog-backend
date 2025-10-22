import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { PrismaUserRepository } from './user.repository.prisma';

const repo = new PrismaUserRepository();
const service = new UserService(repo);

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await service.getAllUsers();
    res.json(users);
  } catch (err: any) {
    next(err);
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  const user = await service.getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.create(req.body);
    res.status(201).json({ message: 'User created' });
  } catch (err: any) {
    next(err);
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const updatedUser = await service.updateUser(id, updateData);
    res.json(updatedUser);
  } catch (err: any) {
    next(err);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    await service.deleteUser(id);
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
}
