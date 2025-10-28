import { Image } from './image.entity';

export interface ImageRepository {
  create(image: Image): Promise<void>;
  findAll(): Promise<Image[]>;
  findById(id: string): Promise<Image | null>;
  findByUser(id: string): Promise<Image[]>;
  findPublic(): Promise<Image[]>;
  findByPost(id: string): Promise<Image[]>;
  findByComment(id: string): Promise<Image[]>;
  update(image: Image): Promise<void>;
  delete(id: string): Promise<void>;
}
