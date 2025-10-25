import { Request, Response, NextFunction } from 'express';
import { PermissionService } from './permission.service';
import { PrismaPermissionRepository } from './permission.repository.prisma';
import { body } from 'express-validator';

const repo = new PrismaPermissionRepository();
const service = new PermissionService(repo);

export const createPermissionValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('description')
    .trim()
    .isLength({ max: 150 }).withMessage('Role desciprtion must be no longer than 150 characters'),

];

export const updatePermissionValidationRules = [
  body('name')
    .optional()
    .trim()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 150 }).withMessage('Role desciprtion must be no longer than 150 characters'),

];

export const getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await service.getAllPermissions();
    res.json(permissions);
  } catch (err: any) {
    next(err);
  }
}

export const getPermissionById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing user permission ID' });
  }

  const permission = await service.getPermissionById(id);
  if (!permission) return res.status(404).json({ error: 'User permission not found' });
  res.json(permission);
}

export const getPermissionByName = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({ error: 'Missing user role name' });
  }

  const permission = await service.getPermissionByName(name);
  if (!permission) return res.status(404).json({ error: 'User permission not found' });
  res.json(permission);
}

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.createPermission(req.body);
    res.status(201).json({ message: 'Permission created' });
  } catch (err: any) {
    next(err);
  }
}

export const updatePermission = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing permission ID' });
  }

  try {
    const updatedPermission = await service.updatePermission(id, updateData);
    res.json(updatedPermission);
  } catch (err: any) {
    next(err);
  }
}

export const deletePermission = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing permission ID' });
  }

  try {
    await service.deletePermission(id);
    res.status(204).json({  message: 'Permission deleted' });
  } catch (err: any) {
    next(err);
  }
}
