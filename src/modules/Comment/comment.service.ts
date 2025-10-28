import { CommentRepository } from './comment.repository';
import { PrismaRoleRepository } from '../Role/role.repository.prisma';
import { Comment } from './comment.entity';
import { AppError } from '../../utils/AppError';
import { v4 as uuid } from 'uuid';
import { ImageType } from '@prisma/client';

export class CommentService {
  constructor(
    private readonly repo: CommentRepository,
    private readonly roleRepo: PrismaRoleRepository = new PrismaRoleRepository()
  ) { }

  async createComment(data: {
    content: string;
    postId: string;
    userId: ImageType;
    parentId?: string;
  }): Promise<void> {
    const comment = new Comment({
      id: uuid(),
      content: data.content,
      postId: data.postId,
      userId: data.userId,
      parentId: data.parentId
    });

    await this.repo.create(comment);
  }

  async getAllComments(currentUser?: any): Promise<Comment[] | null> {

    let roleName = 'user';

    if (currentUser) {
      const role = currentUser.roleName
        ? { name: currentUser.roleName }
        : await this.roleRepo.findById(currentUser.roleId);

      roleName = role?.name ?? 'user';
    }

    if (roleName === 'admin') {
      return this.repo.findAll();
    } else {
      throw new AppError('You are not authorized', 403); 
    }

  }

  async getCommentById(id: string, currentUser?: any): Promise<Comment | null> {
    const comment = await this.repo.findById(id);
    if (!comment) throw new AppError('Comment not found', 404);

    const role = currentUser?.roleName ?? (currentUser?.roleId ? (await this.roleRepo.findById(currentUser.roleId))?.name : 'user') ?? 'user';

    if (role !== 'admin') {
      throw new AppError('You are not authorized to view this comment', 403);
    }

    return comment;
  }

   async getCommentsByPost(id: string): Promise<Comment[]> {
    const comments = await this.repo.findByPost(id);
    if (!comments) throw new AppError('Comments not found', 404);

    return comments;
  }

  async updateComment(id: string, updateData: Partial<Omit<Comment, 'id'>>, currentUser: any): Promise<Comment> {
    const comment = await this.repo.findById(id);
    if (!comment) throw new AppError('Comment not found', 404);

    const isOwner = comment.userId === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to edit this comment', 403);
    }

    Object.assign(comment, updateData);

    await this.repo.update(comment);
    return comment;
  }

  async deleteComment(id: string, currentUser: any): Promise<void> {
    const comment = await this.repo.findById(id);
    if (!comment) throw new AppError('Comment not found', 404);

    const isOwner = comment.userId === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';
    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to delete this comment', 403);
    }

    await this.repo.softDelete(id);
  }
}
