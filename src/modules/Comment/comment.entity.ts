export class Comment {
  id!: string;
  content!: string;
  postId!: string;
  userId!: string;
  parentId?: string | undefined;
  createdAt!: Date;
  updatedAt?: Date | undefined;
  deletedAt?: Date | undefined;
  user?: {
    id: string;
    username: string;
    profilePic?: { id: string; url: string } | undefined | null;
  };

  replies: Comment[] = [];
  images: { id: string; url: string; originalName: string }[] = [];

  constructor(props: {
    id: string;
    content: string;
    postId: string;
    userId: string;
    parentId?: string | undefined;
    createdAt?: Date;
    updatedAt?: Date | undefined;
    deletedAt?: Date | undefined;
    user?: {
      id: string;
      username: string;
      profilePic?: { id: string; url: string };
    };
    replies?: Comment[];
    images?: { id: string; url: string; originalName: string }[];
  }) {
    Object.assign(this, props);
    this.createdAt = props.createdAt ?? new Date();
    this.replies = props.replies ?? [];
    this.images = props.images ?? [];
  }
}
