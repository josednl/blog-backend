import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly repo: UserRepository) { }

  async create(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<void> {
    const exists = await this.repo.findByUsername(data.username);
    if (exists) throw new Error('Username already taken');
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User(
      uuid(),
      data.name,
      data.username,
      data.email,
      hashedPassword
    );

    await this.repo.create(user);
  }
  
  async getAllUsers(): Promise<User[]> {
    return this.repo.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.repo.findByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }

  async updateUser(id: string, updateData: Partial<Omit<User, 'id'>>): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('User not found');

    Object.assign(user, updateData);

    await this.repo.update(user);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('User not found');

    await this.repo.softDelete(id);
  }
}
