import { Router } from 'express';
import { getAllComments, getCommentById, getCommentsByPost, createComment, updateComment, deleteComment, commentValidationRules } from './comment.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', getAllComments);
router.get('/:id', getCommentById);
router.get('/post/:post', getCommentsByPost);
router.post('/', requirePermission(['CREATE_COMMENT']), commentValidationRules, validateRequest, createComment);
router.put('/:id', requirePermission(['CREATE_COMMENT']), commentValidationRules, validateRequest, updateComment);
router.delete('/:id', requirePermission(['DELETE_COMMENT']), deleteComment);

export default router;
