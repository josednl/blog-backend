import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/jwt-payload';
import { PrismaUserRepository } from '../User/user.repository.prisma';
import { UserService } from '../User/user.service';
import { error } from 'console';

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('The JWT_SECRET or JWT_REFRESH_SECRET environment variable is missing.');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const repo = new PrismaUserRepository();
const service = new UserService(repo);

const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await service.getUserByEmail(email);
    if (!user || user.deletedAt) return res.status(401).json({ error: 'User not found' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const payload: JwtPayload = {
      id: user.id,
      email: user.email
    };

    const accesssToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      payload,
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    res.cookie('accessToken', accesssToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV  === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicUrl: user.profilePicUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next();
  }

};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const user = await service.getUserById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const payload: JwtPayload = {
      id: user.id,
      email: user.email
    };

    const newAccessToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: 'Access token refreshed successfully' });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(403).json({ error: 'Invalid or expired refresh token' });;
  }
}

export const logout = (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
}
