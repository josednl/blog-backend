import { Comment } from './comment.entity';

export interface CommentRepository {
  create(comment: Comment): Promise<void>;
  findAll(): Promise<Comment[]>;
  findById(id: string): Promise<Comment | null>;
  findByUser(id: string): Promise<Comment[]>;
  findByPost(id: string): Promise<Comment[]>;
  findByParent(id: string): Promise<Comment[]>;
  update(comment: Comment): Promise<void>;
  softDelete(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
