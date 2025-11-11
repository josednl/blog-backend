import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cokkieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport-config';
import { errorHandler } from './middlewares/error-handler';
import userRouter from './modules/User/user.routes';
import authRouter from './modules/Auth/auth.routes';
import roleRouter from './modules/Role/role.routes';
import permissionRouter from './modules/Permission/permission.routes';
import postRouter from './modules/Post/post.routes';
import imageRouter from './modules/Image/image.routes';
import commentRouter from './modules/Comment/comment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cokkieParser());
app.use(passport.initialize());

const allowedOrigins = [
  process.env.FRONTEND_URL_DEV_1,
  process.env.FRONTEND_URL_DEV_2,
  process.env.FRONTEND_URL_PROD_1,
  process.env.FRONTEND_URL_PROD_2,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked the origin: ${origin}`);
      return callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//Routes
app.use('/auth', authRouter);
app.use('/roles', roleRouter);
app.use('/permissions', permissionRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/images', imageRouter);
app.use('/comments', commentRouter);

//Error Handling Middleware
app.use(errorHandler);

export default app;
