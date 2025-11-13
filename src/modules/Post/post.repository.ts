import { Post } from './post.entity';

export interface PostRepository {
  create(post: Post): Promise<any>;
  findAll(): Promise<Post[]>;
  findAllPublic(): Promise<Post[]>;
  findAllPublicPaginated(page: number, limit: number): Promise<Post[]>;
  findAllOwn(id: string): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  findByAuthorId(authorId: string): Promise<Post[] | null>;
  findPublicByAuthorId(authorId: string): Promise<Post[] | null>;
  update(post: Post): Promise<void>;
  softDelete(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
}
