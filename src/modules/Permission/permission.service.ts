import { PrismaPermissionRepository } from './permission.repository.prisma';
import { Permission } from './permission.entity';
import { AppError } from '../../utils/AppError';
import { v4 as uuid } from 'uuid';

export class PermissionService {
  constructor(private readonly repo: PrismaPermissionRepository) { }

  async createPermission(data: {
    name: string;
    description?: string;
    roles?: string[];
  }): Promise<void> {
    const nameExists = await this.repo.findByName(data.name);
    if (nameExists) throw new AppError('Name already in use', 400);

    const permission = new Permission(
      uuid(),
      data.name,
      data.description
    );

    await this.repo.create(permission, data.roles);
  }

  async getPermissionById(id: string) {
    return this.repo.findById(id);
  }

  async getPermissionByName(name: string) {
    return this.repo.findByName(name);
  }

  async getAllPermissions() {
    return this.repo.findAll();
  }

  async updatePermission(id: string, updateData: Partial<Omit<Permission, 'id'>> & { roles: string[] }): Promise<Permission> {
    const permission = await this.repo.findById(id);
    if (!permission) throw new AppError('Permission not found', 404);

    Object.assign(permission, updateData);

    await this.repo.update(permission, updateData.roles);
    return permission;
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.repo.findById(id);
    if (!permission) throw new AppError('Permission not found', 404);

    await this.repo.delete(id);
  }
}
