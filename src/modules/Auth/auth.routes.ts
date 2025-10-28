import { Router, Request, Response } from 'express';
import { login, logout } from './auth.controller';
import { autoRefreshAuth } from '../../middlewares/auto-refresh-auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/me', autoRefreshAuth, (req: Request, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  res.json({ message: `Welcome back, ${req.user?.name}!`, user: req.user });
});
router.post('/logout', autoRefreshAuth, logout);

export default router;
