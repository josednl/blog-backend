import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { PrismaUserRepository } from './user.repository.prisma';
import { body } from 'express-validator';

const repo = new PrismaUserRepository();
const service = new UserService(repo);

export const createUserValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, or hyphens')
    .isLength({ min: 2, max: 30 }).withMessage('Username must be between 2 and 30 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

export const updateUserValidationRules = [
  body('name')
    .optional()
    .trim()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('username')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, or hyphens')
    .isLength({ min: 2, max: 30 }).withMessage('Username must be between 2 and 30 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email'),

  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter'),

  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await service.getAllUsers(req.user);
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
    const updatedUser = await service.updateUser(id, updateData, req.user);
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
    await service.deleteUser(id, req.user);
    res.status(204).json({  message: 'User deleted' });
  } catch (err: any) {
    next(err);
  }
}
