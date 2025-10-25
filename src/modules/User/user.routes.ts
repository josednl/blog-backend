import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, createUserValidationRules, updateUserValidationRules } from './user.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.get('/', autoRefreshAuth, requirePermission(['READ_USER']), getAllUsers);
router.get('/:id', autoRefreshAuth, requirePermission(['READ_USER']), getUserById);
router.post('/', createUserValidationRules, validateRequest, createUser);
router.put('/:id', autoRefreshAuth, requirePermission(['UPDATE_USER']), updateUserValidationRules, validateRequest, updateUser);
router.delete('/:id', autoRefreshAuth, requirePermission(['DELETE_USER']), deleteUser);

export default router;
