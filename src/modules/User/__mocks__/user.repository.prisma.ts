import { User } from '../user.entity';
import { UserRepository } from '../user.repository';

let mockUsers: User[] = [];

export class PrismaUserRepository implements UserRepository {
  async create(user: User): Promise<void> {
    mockUsers.push(user);
  }

  async findAll(): Promise<User[]> {
    return [...mockUsers];
  }

  async findById(id: string): Promise<User | null> {
    return mockUsers.find(user => user.id === id) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return mockUsers.find(user => user.username === username) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return mockUsers.find(user => user.email === email) || null;
  }

  async update(user: User): Promise<void> {
    const index = mockUsers.findIndex(u => u.id === user.id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = user;
  }

  async delete(id: string): Promise<void> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
  }

  static reset(): void {
    mockUsers = [];
  }

  static insert(user: User): void {
    mockUsers.push(user);
  }
}
