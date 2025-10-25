import { Router, Request, Response } from 'express';
import { login, logout } from './auth.controller';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';
import { requirePermission } from '../../middlewares/authorization.middleware';

const router = Router();

router.post('/login', login);
router.get('/me', autoRefreshAuth, requirePermission(['READ_POST']), (req: Request, res: Response) => {
  res.json({ message: `Welcome back, ${req.user?.name}!`, user: req.user });
});
router.post('/logout', autoRefreshAuth, logout);

export default router;
