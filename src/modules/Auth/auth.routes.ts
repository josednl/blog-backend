import { Router, Request, Response } from 'express';
import passport from '../../config/passport-config';
import { login, logout, refresh } from './auth.controller';

const router = Router();

router.post('/login', login);
// router.get('/me', passport.authenticate('jwt', { session: false }), (req: Request, res: Response) => {
//   res.json({ message: `Hello, ${req.user?.email}!`, user: req.user });
// });
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
