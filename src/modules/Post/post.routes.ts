import { Router } from 'express';
import { createPost, deletePost, getAllPosts, getAllPostsPaginated, getPostById, updatePost, createPostValidationRules, updatePostValidationRules, getPostsByUser } from './post.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', getAllPostsPaginated);
router.get('/:id', getPostById);
router.get('/user/:id', getPostsByUser);
router.post('/', requirePermission(['CREATE_POST']),createPostValidationRules, validateRequest, createPost);
router.put('/:id', requirePermission(['UPDATE_POST']), updatePostValidationRules, validateRequest, updatePost);
router.delete('/:id', requirePermission(['DELETE_POST']), deletePost);

export default router;
