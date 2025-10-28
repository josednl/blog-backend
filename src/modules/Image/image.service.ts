import { ImageRepository } from './image.repository';
import { PrismaRoleRepository } from '../Role/role.repository.prisma';
import { Image } from './image.entity';
import { AppError } from '../../utils/AppError';
import { v4 as uuid } from 'uuid';
import { ImageType } from '@prisma/client';

export class ImageService {
  constructor(
    private readonly repo: ImageRepository,
    private readonly roleRepo: PrismaRoleRepository = new PrismaRoleRepository()
  ) { }

  async createImage(data: {
    originalName: string;
    url: string;
    type: ImageType;
    userId: string;
    name?: string;
    order?: number;
    postId?: string;
    commentId?: string;
  }): Promise<void> {
    const image = new Image({
      id: uuid(),
      originalName: data.originalName,
      url: data.url,
      type: data.type,
      userId: data.userId,
      name: data.name,
      order: data.order,
      postId: data.postId,
      commentId: data.commentId,
    });

    await this.repo.create(image);
  }

  async getAllImages(currentUser?: any): Promise<Image[]> {

    let roleName = 'user';

    if (currentUser) {
      const role = currentUser.roleName
        ? { name: currentUser.roleName }
        : await this.roleRepo.findById(currentUser.roleId);

      roleName = role?.name ?? 'user';
    } else {
      return this.repo.findPublic();
    }

    if (roleName === 'admin') {
      return this.repo.findAll();
    }

    return this.repo.findByUser(currentUser.id);
  }

  async getImageById(id: string, currentUser?: any): Promise<Image | null> {
    const image = await this.repo.findById(id);
    if (!image) throw new AppError('Image not found', 404);

    const role = currentUser?.roleName ?? (currentUser?.roleId ? (await this.roleRepo.findById(currentUser.roleId))?.name : 'user') ?? 'user';
    const isOwner = image.userId === currentUser?.id;
    const isPublic = !!image.postId || !!image.commentId;

    if (!isPublic && !isOwner && role !== 'admin') {
      throw new AppError('You are not authorized to view this image', 403);
    }
    return image;
  }

  async updateImage(id: string, updateData: Partial<Omit<Image, 'id'>>, currentUser: any): Promise<Image> {
    const image = await this.repo.findById(id);
    if (!image) throw new AppError('Image not found', 404);

    const isOwner = image.userId === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to edit this image', 403);
    }

    Object.assign(image, updateData);

    await this.repo.update(image);
    return image;
  }

  async deleteImage(id: string, currentUser: any): Promise<void> {
    const image = await this.repo.findById(id);
    if (!image) throw new AppError('Image not found', 404);

    const isOwner = image.userId === currentUser.id;
    const isAdmin = currentUser.roleName === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to delete this image', 403);
    }

    await this.repo.delete(id);
  }
}
