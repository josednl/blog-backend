export class Comment {
  id!: string;
  content!: string;
  postId!: string;
  userId!: string;
  parentId?: string | undefined;
  createdAt!: Date;
  updatedAt?: Date | undefined;
  deletedAt?: Date | undefined;

  constructor(props: {
    id: string;
    content: string;
    postId: string;
    userId: string;
    parentId?: string | undefined;
    createdAt?: Date;
    updatedAt?: Date | undefined;
    deletedAt?: Date | undefined;
  }) {
    Object.assign(this, props);
    this.createdAt = props.createdAt ?? new Date();
  }
}
