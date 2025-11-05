import { Request, Response, NextFunction } from 'express';
import { PostService } from './post.service';
import { PrismaPostRepository } from './post.repository.prisma';
import { body } from 'express-validator';

const repo = new PrismaPostRepository();
const service = new PostService(repo);

export const createPostValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be between 2 and 120 characters'),

  body('content')
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Content must be an array');
      }
      return true;
    }),

  body('published')
    .isBoolean().withMessage('Published must be a boolean')
    .toBoolean(),

  body('authorId')
    .trim()
    .notEmpty().withMessage('Author Id is required'),
];

export const updatePostValidationRules = [
  body('title')
    .optional()
    .trim()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 120 }).withMessage('Name must be between 2 and 120 characters'),

  body('content')
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Content must be an array');
      }
      return true;
    }),

  body('published')
    .optional()
    .isBoolean().withMessage('Published must be a boolean')
    .toBoolean(),

  body('authorId')
    .optional()
    .trim()
];

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await service.getAllPosts(req.user);
    res.json(posts);
  } catch (err: any) {
    next(err);
  }
}

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing post ID' });
  }

  const post = await service.getPostById(id, req.user);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await service.create(req.body);
    res.status(201).json({ message: 'Post created', data: post });
  } catch (err: any) {
    next(err);
  }
}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing post ID' });
  }

  try {
    const updatedPost = await service.updatePost(id, updateData, req.user);
    res.json(updatedPost);
  } catch (err: any) {
    next(err);
  }
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing post ID' });
  }

  try {
    await service.deletePost(id, req.user);
    res.json({ message: 'Post deleted' });
  } catch (err: any) {
    next(err);
  }
}
