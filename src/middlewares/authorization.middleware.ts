import { Request, Response, NextFunction } from 'express';
import { PrismaRoleRepository } from '../modules/Role/role.repository.prisma';
import { RoleService } from '../modules/Role/role.service';

const repo = new PrismaRoleRepository();
const service = new RoleService(repo);

export const requirePermission = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    if (!user.roleId) return res.status(403).json({ error: 'No role assigned' });

    const role = await service.getRoleById(user.roleId);
    if (!role) return res.status(403).json({ error: 'Role not found' });

    const userPermissions = role.permissions.map(p => p.name);
    const hasPermission = permissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  }
}
