import { AppError } from '../../utils/AppError';
import { Permission } from '../Permission/permission.entity';

export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public description?: string,
    public permissions: Permission[] = [],
  ) { }

  changeDesc(newDesc: string) {
    if (newDesc.length > 150) {
      throw new AppError('Description too long', 400);
    }
    this.description = newDesc;
  }

  addPermission(permission: Permission) {
    if (!this.permissions.find(p => p.id === permission.id)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permissionId: string) {
    this.permissions = this.permissions.filter(p => p.id !== permissionId);
  }
}
