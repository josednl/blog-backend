import { Request, Response, NextFunction } from 'express';
import { RoleService } from './role.service';
import { PrismaRoleRepository } from './role.repository.prisma';
import { body } from 'express-validator';

const repo = new PrismaRoleRepository();
const service = new RoleService(repo);

export const roleValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('description')
    .trim()
    .isLength({ max: 150 }).withMessage('Role desciprtion must be no longer than 150 characters'),

];

export const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await service.getAllRoles();
    res.json(roles);
  } catch (err: any) {
    next(err);
  }
}

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing user role ID' });
  }

  const role = await service.getRoleById(id);
  if (!role) return res.status(404).json({ error: 'User role not found' });
  res.json(role);
}

export const getRoleByName = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  if (!name) {
    return res.status(400).json({ error: 'Missing user role name' });
  }

  const role = await service.getRoleByName(name);
  if (!role) return res.status(404).json({ error: 'User role not found' });
  res.json(role);
}

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.createRole(req.body);
    res.status(201).json({ message: 'Role created' });
  } catch (err: any) {
    next(err);
  }
}

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing role ID' });
  }

  try {
    const updatedRole = await service.updateRole(id, updateData);
    res.json(updatedRole);
  } catch (err: any) {
    next(err);
  }
}

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing role ID' });
  }

  try {
    await service.deleteRole(id);
    res.status(204).json({  message: 'Role deleted' });
  } catch (err: any) {
    next(err);
  }
}
