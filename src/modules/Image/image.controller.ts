import { Request, Response, NextFunction } from 'express';
import { ImageService } from './image.service';
import { PrismaImageRepository } from './image.repository.prisma';
import { body } from 'express-validator';
import { ImageType } from '@prisma/client';

const repo = new PrismaImageRepository();
const service = new ImageService(repo);

export const createImageValidationRules = [
  body('originalName')
    .exists({ checkFalsy: true }).withMessage('originalName is required')
    .isString().withMessage('originalName must be a string'),

  body('url')
    .exists({ checkFalsy: true }).withMessage('url is required')
    .isString().withMessage('url must be a string'),

  body('userId')
    .exists({ checkFalsy: true }).withMessage('userId is required')
    .isUUID().withMessage('userId must be a UUID'),

  body('type')
    .optional()
    .isIn(Object.values(ImageType)).withMessage(`type must be: ${Object.values(ImageType).join(', ')}`),

  body('name')
    .optional()
    .isString().withMessage('name must be a string'),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('order must be a positive integer'),

  body('postId')
    .optional()
    .isUUID().withMessage('postId must be a UUID'),

  body('commentId')
    .optional()
    .isUUID().withMessage('commentId must be a UUID'),
];

export const updateImageValidationRules = [
  body('originalName')
    .optional()
    .isString().withMessage('originalName must be a string'),

  body('url')
    .optional()
    .isString().withMessage('url must be a string'),

  body('userId')
    .optional()
    .isUUID().withMessage('userId must be a UUID'),

  body('type')
    .optional()
    .isIn(Object.values(ImageType)).withMessage(`type must be: ${Object.values(ImageType).join(', ')}`),

  body('name')
    .optional()
    .isString().withMessage('name must be a string'),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('order must be a positive integer'),

  body('postId')
    .optional()
    .isUUID().withMessage('postId must be a UUID'),

  body('commentId')
    .optional()
    .isUUID().withMessage('commentId must be a UUID'),
];

export const getAllImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const images = await service.getAllImages(req.user);
    res.json(images);
  } catch (err: any) {
    next(err);
  }
}

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing image ID' });
  }

  const image = await service.getImageById(id, req.user);
  if (!image) return res.status(404).json({ error: 'Image not found' });
  res.json(image);
}

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.createImage(req.body);
    res.status(201).json({ message: 'Image created' });
  } catch (err: any) {
    next(err);
  }
}

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing image ID' });
  }

  try {
    const updatedImage = await service.updateImage(id, updateData, req.user);
    res.json(updatedImage);
  } catch (err: any) {
    next(err);
  }
}

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing image ID' });
  }

  try {
    await service.deleteImage(id, req.user);
    res.json({ message: 'Image deleted' });
  } catch (err: any) {
    next(err);
  }
}
