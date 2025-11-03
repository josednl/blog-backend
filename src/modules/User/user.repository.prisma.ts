import { prisma } from '../../shared/prisma';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

let cachedDefaultRoleId: string | null = null;

export class PrismaUserRepository implements UserRepository {
  private mapToEntity(data: any): User {
    return new User(
      data.id,
      data.name,
      data.username,
      data.email,
      data.password,
      data.profilePicId,
      data.bio,
      data.roleId,
      data.createdAt,
      data.updatedAt,
      data.deletedAt
    );
  }

  async create(user: User): Promise<void> {
    if (!cachedDefaultRoleId) {
      const defaultRole = await prisma.role.findUnique({ where: { name: 'user' } });
      if (!defaultRole) {
        throw new Error('Default role "user" not found. Please run the seed first.');
      }
      cachedDefaultRoleId = defaultRole.id;
    }

    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        ...(user.profilePicId !== undefined && { profilePicId: user.profilePicId }),
        ...(user.bio !== undefined && { bio: user.bio }),
        roleId: user.roleId || cachedDefaultRoleId,
      }
    });
  }

  async findAll(): Promise<User[]> {
    const results = await prisma.user.findMany({
      where: { deletedAt: null }
    });
    return results.map(this.mapToEntity);
  }

  private async findBy(field: 'id' | 'username' | 'email', value: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: {
        [field]: value,
        deletedAt: null
      }
    });

    return result ? this.mapToEntity(result) : null;
  }

  async findById(id: string): Promise<User | null> {
    // return this.findBy('id', id);
    const result = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        profilePic: true,
      },
    });

    if (!result) return null;

    const user = this.mapToEntity(result);
    (user as any).profilePicUrl = result.profilePic?.url || null;

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findBy('username', username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy('email', email);
  }

  async update(user: User): Promise<void> {
    await this.updatePartial(user.id, user);
  }

  async updatePartial(id: string, data: Partial<User>): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.username && { username: data.username }),
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }),
        ...(data.profilePicId && { profilePicId: data.profilePicId }),
        ...(data.bio && { bio: data.bio }),
        ...(data.roleId && { roleId: data.roleId })
      }
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async restore(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}
