import { prisma } from '../../shared/prisma';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';

export class PrismaCommentRepository implements CommentRepository {
  private mapToEntity(data: any): Comment {
    return new Comment({
      id: data.id,
      content: data.content,
      postId: data.postId,
      userId: data.userId,
      parentId: data.parentId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  async create(comment: Comment): Promise<void> {
    await prisma.comment.create({
      data: {
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        userId: comment.userId,
        ...(comment.parentId !== undefined && { parentId: comment.parentId }),
      }
    });
  }

  async findAll(): Promise<Comment[]> {
    const results = await prisma.comment.findMany();
    return results.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Comment | null> {
    const result = await prisma.comment.findUnique({
      where: { id }
    });
    return result ? this.mapToEntity(result) : null;
  }

  private async findByField(field: 'postId' | 'userId' | 'parentId', value: string): Promise<Comment[]> {
    const results = await prisma.comment.findMany({
      where: {
        [field]: value,
      }
    });

    return results.map(this.mapToEntity);
  }

  async findByUser(userId: string): Promise<Comment[]> {
    return this.findByField('userId', userId);
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.findByField('postId', postId);
  }

  async findByParent(parentId: string): Promise<Comment[]> {
    return this.findByField('parentId', parentId);
  }

  async update(comment: Comment): Promise<void> {
    await this.updatePartial(comment.id, comment);
  }

  async updatePartial(id: string, data: Partial<Comment>): Promise<void> {
    await prisma.comment.update({
      where: { id },
      data: {
        ...(data.content !== undefined && { content: data.content }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
      }
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }

  async restore(id: string): Promise<void> {
    await prisma.comment.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}
