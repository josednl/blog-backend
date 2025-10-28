import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaUserRepository } from '../modules/User/user.repository.prisma';
import { UserService } from '../modules/User/user.service';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('The JWT_SECRET environment variable is missing.');
}
const JWT_SECRET = process.env.JWT_SECRET;
const repo = new PrismaUserRepository();
const service = new UserService(repo);

function getSafeUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    profilePicId: user.profilePicId,
  };
}

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) req.cookies['accessToken'];
  return null;
}

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await service.getUserById(payload.id);
        if (!user) return done(null, false);
        const safeUser = JSON.parse(JSON.stringify(getSafeUser(user)));
        return done(null, safeUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
