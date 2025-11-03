import { Router } from 'express';
import { createImage, getAllImages, getImageById, updateImage, deleteImage, createImageValidationRules, updateImageValidationRules, uploadProfileImage } from './image.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';
import { upload } from '../../utils/multer-config';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', requirePermission(['MANAGE_IMAGES']), createImageValidationRules, validateRequest, createImage);
router.post('/profile', requirePermission(['MANAGE_IMAGES']), upload.single('image'), uploadProfileImage);
router.put('/:id', requirePermission(['MANAGE_IMAGES']), updateImageValidationRules, validateRequest, updateImage);
router.delete('/:id', requirePermission(['MANAGE_IMAGES']), deleteImage);

export default router;
