import { User as UserEntity } from '../modules/User/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {}
    interface Request {
      user?: User;
    }
  }
}
