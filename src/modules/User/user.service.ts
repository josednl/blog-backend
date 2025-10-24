import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AppError } from '../../utils/AppError';
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
    const usernameExists = await this.repo.findByUsername(data.username);
    if (usernameExists) throw new AppError('Username already taken', 400);

    const emailExists = await this.repo.findByEmail(data.email);
    if (emailExists) throw new AppError('Email already in use', 400);

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
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.repo.findByUsername(username);
    if (!user) return null;
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateUser(id: string, updateData: Partial<Omit<User, 'id'>>): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('User not found', 404);

    Object.assign(user, updateData);

    await this.repo.update(user);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('User not found', 404);

    await this.repo.softDelete(id);
  }
}
