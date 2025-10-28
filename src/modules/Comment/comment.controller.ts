import { Request, Response, NextFunction } from 'express';
import { CommentService } from './comment.service';
import { PrismaCommentRepository } from './comment.repository.prisma';
import { body } from 'express-validator';
import { ImageType } from '@prisma/client';

const repo = new PrismaCommentRepository();
const service = new CommentService(repo);

export const commentValidationRules = [
  body('content')
    .trim().notEmpty().withMessage('content is required')
    .isString().withMessage('content must be a string')
    .isLength({ min: 1, max: 500 }).withMessage('content must be between 1 and 500 characters'),

  body('userId')
    .exists({ checkFalsy: true }).withMessage('userId is required')
    .isUUID().withMessage('userId must be a UUID'),

  body('postId')
    .exists({ checkFalsy: true }).withMessage('postId is required')
    .isUUID().withMessage('postId must be a UUID'),

    body('parentId')
    .optional()
    .isUUID().withMessage('parentId must be a UUID'),
];

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const images = await service.getAllComments(req.user);
    res.json(images);
  } catch (err: any) {
    next(err);
  }
}

export const getCommentsByPost = async (req: Request, res: Response, next: NextFunction) => {
  const { post } = req.params;
  if (!post) {
    return res.status(400).json({ error: 'Missing post ID' });
  }

  const comments = await service.getCommentsByPost(post);
  if (!comments) return res.status(404).json({ error: 'Comments not found' });
  res.json(comments);
}

export const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing comment ID' });
  }

  const comment = await service.getCommentById(id, req.user);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  res.json(comment);
}

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.createComment(req.body);
    res.status(201).json({ message: 'Comment created' });
  } catch (err: any) {
    next(err);
  }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing comment ID' });
  }

  try {
    const updatedComment = await service.updateComment(id, updateData, req.user);
    res.json(updatedComment);
  } catch (err: any) {
    next(err);
  }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing comment ID' });
  }

  try {
    await service.deleteComment(id, req.user);
    res.json({ message: 'Comment deleted' });
  } catch (err: any) {
    next(err);
  }
}
