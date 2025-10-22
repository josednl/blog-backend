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

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
      async (payload, done) => {
        try {
          const user = await service.getUserById(payload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
  )
);

export default passport;
