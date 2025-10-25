import { AppError } from '../../utils/AppError';
import { Role } from '../Role/role.entity';

export class Permission {
  constructor(
    public readonly id: string,
    public name: string,
    public description?: string,
    public roles: Role[] = [],
  ) {}

  changeName(newName: string) {
    if (!newName || newName.length < 3) {
      throw new AppError('Permission name too short', 400);
    }
    this.name = newName;
  }

  changeDescription(newDesc: string) {
    if (newDesc.length > 150) {
      throw new AppError('Description too long', 400);
    }
    this.description = newDesc;
  }
}
