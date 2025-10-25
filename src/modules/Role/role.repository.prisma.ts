import { prisma } from '../../shared/prisma';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { Permission } from '../Permission/permission.entity';

export class PrismaRoleRepository implements RoleRepository {
  private mapToEntity(data: any): Role {
    const permissions = data.permissions ? data.permissions.map((p: any) => new Permission(p.id, p.name, p.description)) : [];
    return new Role(
      data.id,
      data.name,
      data.description,
      permissions
    );
  }

  async create(role: Role): Promise<void> {
    await prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        ...(role.description !== undefined && { description: role.description }),
      }
    });
  }

  async findAll(): Promise<Role[]> {
    const results = await prisma.role.findMany({ include: { permissions: true } });
    return results.map(this.mapToEntity);
  }

  private async findBy(field: 'id' | 'name', value: string): Promise<Role | null> {
    const result = await prisma.role.findFirst({
      where: {
        [field]: value,
      },
      include: { permissions: true },
    });

    return result ? this.mapToEntity(result) : null;
  }

  async findById(id: string): Promise<Role | null> {
    return this.findBy('id', id);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.findBy('name', name);
  }

  async update(role: Role): Promise<void> {
    await prisma.role.update({
      where: { id: role.id },
      data: {
        ...(role.name !== undefined && { name: role.name }),
        ...(role.description !== undefined && { description: role.description }),
      }
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.role.delete({ where: { id } });
  }
}
