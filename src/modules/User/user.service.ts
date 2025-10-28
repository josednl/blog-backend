import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AppError } from '../../utils/AppError';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import { PrismaRoleRepository } from '../Role/role.repository.prisma';

export class UserService {
  constructor(
    private readonly repo: UserRepository,
        private readonly roleRepo: PrismaRoleRepository = new PrismaRoleRepository()
  ) { }

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
  
  async getAllUsers(currentUser?: any): Promise<User[]> {
    let roleName = 'user';

    if (currentUser) {
      const role = currentUser.roleName
        ? { name: currentUser.roleName }
        : await this.roleRepo.findById(currentUser.roleId);

      roleName = role?.name ?? 'user';
    }

    if (roleName === 'admin') {
      return this.repo.findAll();
    } else {
      throw new AppError('You are not authorized', 403); 
    }
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

  async updateUser(id: string, updateData: Partial<Omit<User, 'id'>>, currentUser: any): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('User not found', 404);

    const itsMe = user.id === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!itsMe && !isAdmin) {
      throw new AppError('You are not authorized to edit this user', 403);
    }

    Object.assign(user, updateData);

    await this.repo.update(user);
    return user;
  }

  async deleteUser(id: string, currentUser: any): Promise<void> {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('User not found', 404);

    const itsMe = user.id === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!itsMe && !isAdmin) {
      throw new AppError('You are not authorized to delete this user', 403);
    }

    await this.repo.softDelete(id);
  }
}
