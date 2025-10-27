import { Router } from 'express';
import { createPost, deletePost, getAllPosts, getPostById, updatePost, createPostValidationRules, updatePostValidationRules } from './post.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', requirePermission(['CREATE_POST']),createPostValidationRules, validateRequest, createPost);
router.put('/:id', requirePermission(['UPDATE_POST']), updatePostValidationRules, validateRequest, updatePost);
router.delete('/:id', requirePermission(['DELETE_POST']), deletePost);

export default router;
