import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, userValidationRules } from './user.controller';
import { validateRequest } from '../../middlewares/validate-request';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', userValidationRules, validateRequest, createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
