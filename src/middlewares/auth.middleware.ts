// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// if (!process.env.JWT_SECRET) {
//   throw new Error('The JWT_SECRET environment variable is missing.');
// }
// const JWT_SECRET = process.env.JWT_SECRET;

// export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'Missing token' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });

//     (req as any).user = user;
//     next();
//   });
// };
