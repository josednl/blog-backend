import { PostRepository } from './post.repository';
import { PrismaRoleRepository } from '../Role/role.repository.prisma';
import { Post, PostContent } from './post.entity';
import { AppError } from '../../utils/AppError';
import { v4 as uuid } from 'uuid';

export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly roleRepo: PrismaRoleRepository = new PrismaRoleRepository()
  ) { }

  async create(data: {
    title: string;
    content: PostContent;
    published: boolean;
    authorId: string;
  }): Promise<void> {
    const post = new Post(
      uuid(),
      data.title,
      data.content,
      data.published,
      data.authorId
    );

    await this.repo.create(post);
  }

  async getAllPosts(currentUser?: any): Promise<Post[]> {

    let roleName = 'user';

    if (currentUser) {
      const role = currentUser.roleName
        ? { name: currentUser.roleName }
        : await this.roleRepo.findById(currentUser.roleId);

      roleName = role?.name ?? 'user';
    }
    if (roleName === 'admin') {
      return this.repo.findAll();
    } else if (roleName === 'editor') {
      return this.repo.findAllOwn(currentUser.id);
    }

    return this.repo.findAllPublic();
  }

  async getPostById(id: string, currentUser?: any): Promise<Post | null> {
    const post = await this.repo.findById(id);
    if (!post) throw new AppError('Post not found', 404);

    const role = currentUser?.roleName ?? (currentUser?.roleId ? (await this.roleRepo.findById(currentUser.roleId))?.name : 'user') ?? 'user';
    const isOwner = post.authorId === currentUser?.id;

    if (post.deletedAt && role !== 'admin' && role !== 'editor') {
      throw new AppError('You are not authorized to view this post', 403);
    }

    if (!post.published && !isOwner && role === 'user') {
      throw new AppError('This post is not published yet', 403);
    }
    return post;
  }

  async getPostsByAuthor(authorId: string, currentUser: any): Promise<Post[] | null> {
    const isOwner = currentUser.id === authorId;
    const role = currentUser.roleName ?? (await this.roleRepo.findById(currentUser.roleId))?.name ?? 'user';

    if (isOwner || role === 'admin' || role === 'editor') {
      return this.repo.findByAuthorId(authorId);
    }

    return this.repo.findPublicByAuthorId(authorId);
  }

  async updatePost(id: string, updateData: Partial<Omit<Post, 'id'>>, currentUser: any): Promise<Post> {
    const post = await this.repo.findById(id);
    if (!post) throw new AppError('Post not found', 404);

    const isOwner = post.authorId === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to edit this post', 403);
    }

    Object.assign(post, updateData);

    await this.repo.update(post);
    return post;
  }

  async deletePost(id: string, currentUser: any): Promise<void> {
    const post = await this.repo.findById(id);
    if (!post) throw new AppError('Post not found', 404);

    const isOwner = post.authorId === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to delete this post', 403);
    }

    await this.repo.softDelete(id);
  }
}
