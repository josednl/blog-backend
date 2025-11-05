import { Router } from 'express';
import { createImage, getAllImages, getImageById, updateImage, deleteImage, createImageValidationRules, updateImageValidationRules } from './image.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';
import { upload } from '../../utils/multer-config';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', requirePermission(['MANAGE_IMAGES']),  upload.single('image'), createImageValidationRules, validateRequest, createImage);
// router.put('/:id', requirePermission(['MANAGE_IMAGES']), updateImageValidationRules, validateRequest, updateImage);
router.delete('/:id', requirePermission(['MANAGE_IMAGES']), deleteImage);

export default router;
