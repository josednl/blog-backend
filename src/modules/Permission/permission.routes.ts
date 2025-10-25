import { Router } from 'express';
import { createPermission, deletePermission, getAllPermissions, getPermissionById, createPermissionValidationRules, updatePermissionValidationRules, updatePermission } from './permission.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', requirePermission(['READ_PERMISSIONS']), getAllPermissions);
router.get('/:id', requirePermission(['READ_PERMISSIONS']), getPermissionById);
router.post('/', requirePermission(['MANAGE_PERMISSIONS']), createPermissionValidationRules, validateRequest, createPermission);
router.put('/:id', requirePermission(['MANAGE_PERMISSIONS']), updatePermissionValidationRules, validateRequest, updatePermission);
router.delete('/:id', requirePermission(['MANAGE_PERMISSIONS']), deletePermission);

export default router;
