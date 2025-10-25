import { Router } from 'express';
import { createRole, deleteRole, getAllRoles, getRoleById, roleValidationRules, updateRole } from './role.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.use(autoRefreshAuth);

router.get('/', requirePermission(['READ_ROLES']), getAllRoles);
router.get('/:id', requirePermission(['READ_ROLES']), getRoleById);
router.post('/', requirePermission(['MANAGE_ROLES']), roleValidationRules, validateRequest, createRole);
router.put('/:id', requirePermission(['MANAGE_ROLES']), roleValidationRules, validateRequest, updateRole);
router.delete('/:id', requirePermission(['MANAGE_ROLES']), deleteRole);

export default router;
