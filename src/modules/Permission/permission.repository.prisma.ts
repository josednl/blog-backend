import { prisma } from '../../shared/prisma';
import { Role } from '../Role/role.entity';
import { Permission } from './permission.entity';
import { PermissionRepository } from './permission.repository';

export class PrismaPermissionRepository implements PermissionRepository {
  private mapToEntity(data: any): Permission {
    const roles = data.roles ? data.roles.map((r: any) => new Role(r.id, r.name, r.description)) : [];
    return new Permission(
      data.id,
      data.name,
      data.description,
      roles
    );
  }

  async create(permission: Permission, roleIds?: string[]): Promise<void> {
    await prisma.permission.create({
      data: {
        id: permission.id,
        name: permission.name,
        ...(permission.description !== undefined && { description: permission.description }),
        ...(roleIds && roleIds.length > 0 && {
          roles: {
            connect: roleIds.map((rid) => ({ id: rid })),
          },
        }),
      }
    });
  }

  async findAll(): Promise<Permission[]> {
    const results = await prisma.permission.findMany({ include: { roles: true } });
    return results.map(this.mapToEntity);
  }

  private async findBy(field: 'id' | 'name', value: string): Promise<Permission | null> {
    const result = await prisma.permission.findFirst({
      where: {
        [field]: value,
      },
      include: { roles: true },
    });

    return result ? this.mapToEntity(result) : null;
  }

  async findById(id: string): Promise<Permission | null> {
    return this.findBy('id', id);
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.findBy('name', name);
  }

  async update(permission: Permission, roleIds?: string[]): Promise<void> {
    await prisma.permission.update({
      where: { id: permission.id },
      data: {
        ...(permission.name !== undefined && { name: permission.name }),
        ...(permission.description !== undefined && { description: permission.description }),
        ...(roleIds && {
          roles: {
            set: [],
            connect: roleIds.map((rid) => ({ id: rid })),
          },
        }),
      }
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.permission.delete({ where: { id } });
  }
}