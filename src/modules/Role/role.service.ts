import { PrismaRoleRepository } from './role.repository.prisma';
import { Role } from './role.entity';
import { AppError } from '../../utils/AppError';
import { v4 as uuid } from 'uuid';

export class RoleService {
  constructor(private readonly repo: PrismaRoleRepository) { }

  async createRole(data: {
    name: string;
    description?: string;
    permissions?: string[];
  }): Promise<void> {
    const nameExists = await this.repo.findByName(data.name);
    if (nameExists) throw new AppError('Name already in use', 400);

    const role = new Role(
      uuid(),
      data.name,
      data.description
    );

    await this.repo.create(role, data.permissions);
  }

  async getRoleById(id: string) {
    return this.repo.findById(id);
  }

  async getRoleByName(name: string) {
    return this.repo.findByName(name);
  }

  async getAllRoles() {
    return this.repo.findAll();
  }

  async updateRole(id: string, updateData: Partial<Omit<Role, 'id'>> & { permissions?: string[] }): Promise<Role> {
    const role = await this.repo.findById(id);
    if (!role) throw new AppError('Role not found', 404);

    Object.assign(role, updateData);

    await this.repo.update(role, updateData.permissions);
    return role;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.repo.findById(id);
    if (!role) throw new AppError('Role not found', 404);

    await this.repo.delete(id);
  }
}
