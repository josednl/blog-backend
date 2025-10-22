import { AppError } from '../../utils/AppError';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public username: string,
    public email: string,
    public password: string,
    public profilePicUrl?: string,
    public bio?: string,
    public userTypeId?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date
  ) { }

  hasProfilePic(): boolean {
    return !!this.profilePicUrl;
  }

  changeBio(newBio: string) {
    if (newBio.length > 250) {
      throw new AppError('Bio too long', 400);
    }
    this.bio = newBio;
  }
}
