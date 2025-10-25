import { Permission } from './permission.entity';

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>
  findByName(name: string): Promise<Permission | null>;
  create(permission: Permission): Promise<void>;
  update(permission: Permission): Promise<void>;
  delete(id: string): Promise<void>;
}
