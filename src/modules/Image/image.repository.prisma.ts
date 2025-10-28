import { prisma } from '../../shared/prisma';
import { ImageRepository } from './image.repository';
import { Image } from './image.entity';
import { ImageType } from '@prisma/client';

export class PrismaImageRepository implements ImageRepository {
  private mapToEntity(data: any): Image {
    return new Image({
      id: data.id,
      name: data.name,
      originalName: data.originalName,
      url: data.url,
      order: data.order,
      type: data.type as ImageType,
      createdAt: data.createdAt,
      postId: data.postId,
      commentId: data.commentId,
      userId: data.userId,
    });
  }

  async create(image: Image): Promise<void> {
    await prisma.image.create({
      data: {
        id: image.id,
        originalName: image.originalName,
        url: image.url,
        type: image.type,
        userId: image.userId,
        ...(image.name !== undefined && { name: image.name }),
        ...(image.order !== undefined && { order: image.order }),
        ...(image.postId !== undefined && { postId: image.postId }),
        ...(image.commentId !== undefined && { commentId: image.commentId }),
      }
    });
  }

  async findAll(): Promise<Image[]> {
    const results = await prisma.image.findMany();
    return results.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Image | null> {
    const result = await prisma.image.findUnique({
      where: { id }
    });
    return result ? this.mapToEntity(result) : null;
  }

  async findByUser(id: string): Promise<Image[]> {
    const results = await prisma.image.findMany({
      where: {
        userId: id
      }
    });
    return results.map(this.mapToEntity);
  }

  async findPublic(): Promise<Image[]> {
    const results = await prisma.image.findMany({
      where: {
        postId: { not: null },
        commentId: { not: null },
      }
    });
    return results.map(this.mapToEntity);
  }

  private async findByField(field: 'postId' | 'commentId', value: string): Promise<Image[]> {
    const results = await prisma.image.findMany({
      where: {
        [field]: value,
      }
    });

    return results ? results.map(this.mapToEntity) : [];
  }

  async findByPost(postId: string): Promise<Image[]> {
    return this.findByField('postId', postId);
  }

  async findByComment(commentId: string): Promise<Image[]> {
    return this.findByField('commentId', commentId);
  }

  async update(image: Image): Promise<void> {
    await this.updatePartial(image.id, image);
  }

  async updatePartial(id: string, data: Partial<Image>): Promise<void> {
    await prisma.image.update({
      where: { id },
      data: {
        ...(data.originalName !== undefined && { originalName: data.originalName }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.type !== undefined && { type: data.type }),
        // ...(data.userId !== undefined && { userId: data.userId }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.postId !== undefined && { postId: data.postId }),
        ...(data.commentId !== undefined && { commentId: data.commentId }),
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.image.delete({ where: { id } });
  }
}
