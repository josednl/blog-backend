import { prisma } from '../../shared/prisma';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class PrismaUserRepository implements UserRepository {
  private mapToEntity(data: any): User {
    return new User(
      data.id,
      data.name,
      data.username,
      data.email,
      data.password,
      data.profilePicUrl,
      data.bio,
      data.userTypeId,
      data.createdAt,
      data.updatedAt
    );
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        ...(user.profilePicUrl !== undefined && { profilePicUrl: user.profilePicUrl }),
        ...(user.bio !== undefined && { bio: user.bio }),
        ...(user.userTypeId !== undefined && { userTypeId: user.userTypeId })
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
    return this.findBy('id', id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findBy('username', username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy('email', email);
  }

  async update(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        ...(user.profilePicUrl !== undefined && { profilePicUrl: user.profilePicUrl }),
        ...(user.bio !== undefined && { bio: user.bio }),
        ...(user.userTypeId !== undefined && { userTypeId: user.userTypeId })
      }
    })
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
