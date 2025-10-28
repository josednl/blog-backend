import { ImageType } from '@prisma/client';

export class Image {
  id!: string;
  originalName!: string;
  url!: string;
  type!: ImageType;
  userId!: string;
  name?: string | undefined;
  order?: number | undefined;
  postId?: string | undefined;
  commentId?: string | undefined;
  createdAt!: Date;
  updatedAt?: Date | undefined;

  constructor(props: {
    id: string;
    originalName: string;
    url: string;
    type: ImageType;
    userId: string;
    name?: string | undefined;
    order?: number | undefined;
    postId?: string | undefined;
    commentId?: string | undefined;
    createdAt?: Date;
    updatedAt?: Date | undefined;
  }) {
    Object.assign(this, props);
    this.createdAt = props.createdAt ?? new Date();
  }
}
