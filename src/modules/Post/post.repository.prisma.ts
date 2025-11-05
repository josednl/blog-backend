import { prisma } from '../../shared/prisma';
import { PostRepository } from './post.repository';
import { Post } from './post.entity';

let cachedDefaultRoleId: string | null = null;

export class PrismaPostRepository implements PostRepository {
  private mapToEntity(data: any): Post {
    return new Post(
      data.id,
      data.title,
      data.content,
      data.published,
      data.authorId,
      data.createdAt,
      data.updatedAt,
      data.deletedAt
    );
  }

  async create(post: Post): Promise<any> {
    const created = await prisma.post.create({
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        authorId: post.authorId,
      }
    });

    return created;
  }

  async findAll(): Promise<Post[]> {
    const results = await prisma.post.findMany();
    return results.map(this.mapToEntity);
  }

  async findAllOwn(id: string): Promise<Post[]> {
    const results = await prisma.post.findMany({
      where: {
        authorId: id,
        deletedAt: null,
      },
      include: {
        images: true,
      },
    });
    return results.map(this.mapToEntity);
  }

  async findAllPublic(): Promise<Post[]> {
    const results = await prisma.post.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return results.map(this.mapToEntity);
  }

  private async findBy(field: 'id' | 'authorId', value: string): Promise<Post | null> {
    const result = await prisma.post.findFirst({
      where: {
        [field]: value,
      }
    });

    return result ? this.mapToEntity(result) : null;
  }

  async findById(id: string): Promise<Post | null> {
    return this.findBy('id', id);
  }

  async findByAuthorId(author: string): Promise<Post[] | null> {
    const results = await prisma.post.findMany({
      where: { authorId: author }
    });
    return results.map(this.mapToEntity);
  }

  async findPublicByAuthorId(author: string): Promise<Post[] | null> {
    const results = await prisma.post.findMany({
      where: {
        authorId: author,
        published: true,
      }
    });
    return results.map(this.mapToEntity);
  }

  async update(post: Post): Promise<void> {
    await this.updatePartial(post.id, post);
  }

  async updatePartial(id: string, data: Partial<Post>): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.authorId !== undefined && { authorId: data.authorId }),
      }
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  async restore(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}
