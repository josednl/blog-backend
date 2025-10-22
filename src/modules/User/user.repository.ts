import { User } from './user.entity';

export interface UserRepository {
  create(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  softDelete(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}
