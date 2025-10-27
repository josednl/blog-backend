import { AppError } from '../../utils/AppError';

export class Post {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public published: boolean = false,
    public authorId:string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date
  ) {}

  publish() {
    if (this.published) {
      throw new AppError('Post is already published', 400);
    }
    this.published = true;
  }

  unpublish() {
    if (!this.published) {
      throw new AppError('Post is not published', 400);
    }

    this.published = false;
  }
}
