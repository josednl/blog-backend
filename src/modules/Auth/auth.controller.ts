import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../types/jwt-payload';
import { PrismaUserRepository } from '../User/user.repository.prisma';
import { UserService } from '../User/user.service';

if (!process.env.JWT_SECRET) {
  throw new Error('The JWT_SECRET environment variable is missing.');
}
const JWT_SECRET = process.env.JWT_SECRET;

const repo = new PrismaUserRepository();
const service = new UserService(repo);

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

    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
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
