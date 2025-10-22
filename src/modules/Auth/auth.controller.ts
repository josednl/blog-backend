import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaUserRepository } from '../User/user.repository.prisma';

const repo = new PrismaUserRepository();

if (!process.env.JWT_SECRET) {
  throw new Error('The JWT_SECRET environment variable is missing.');
}
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await repo.findByEmail(email);
  if (!user || user.deletedAt) return res.status(401).json({ error: 'Invalid credentials' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token });
};
