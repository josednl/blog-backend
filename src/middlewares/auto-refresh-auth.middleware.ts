import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaUserRepository } from '../modules/User/user.repository.prisma';
import { UserService } from '../modules/User/user.service';
import { JwtPayload } from '../types/jwt-payload';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('Missing JWT secrets in environment variables');
}

const repo = new PrismaUserRepository();
const service = new UserService(repo);

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

export const autoRefreshAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
        const user = await service.getUserById(decoded.id);
        if (!user) throw new Error('User not found');

        (req as any).user = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          profilePicUrl: user.profilePicUrl,
          roleId: user.roleId
        };

        return next();
      } catch (err) {
        if ((err as any).name !== 'TokenExpiredError') {
          return res.status(401).json({ error: 'Invalid access token' });
        }
      }
    }

    if (!refreshToken) {
      return res.status(401).json({ error: 'Missing refresh token' });
    }

    let decodedRefresh: JwtPayload;
    try {
      decodedRefresh = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(401).json({ error: 'Session expired, please log in again' });
      }
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const sessionDuration = Date.now() - decodedRefresh.sessionStart!;
    const maxSessionDuration = 7 * 24 * 60 * 60 * 1000;
    if (sessionDuration > maxSessionDuration) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(401).json({ error: 'Session expired, please log in again' });
    }

    const user = await service.getUserById(decodedRefresh.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      sessionStart: decodedRefresh.sessionStart,
      roleId: user.roleId
    };

    const newAccessToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    const newRefreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    (req as any).user = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      roleId: user.roleId
    };

    next();
  } catch (error) {
    console.error('Auto-refresh auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
