import { AppError } from '../../utils/AppError';

export type PostContentBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'image'; id: string };

export type PostContent = PostContentBlock[];

export class Post {
  constructor(
    public readonly id: string,
    public title: string,
    public content: PostContent,
    public published: boolean = false,
    public authorId:string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public deletedAt?: Date,
    public images: any[] = []
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
