import { Router, Request, Response } from 'express';
import passport from 'passport';
import { login} from './auth.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
// router.get('/me', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
//   const user = (req as any).user;
//   res.json({ message: `Hello, ${user.email}` });
// });

export default router;
