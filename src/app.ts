import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cokkieParser from 'cookie-parser';
import passport from 'passport';
import './config/passport-config';
import { errorHandler } from './middlewares/error-handler';
import userRouter from './modules/User/user.routes';
import authRouter from './modules/Auth/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(cokkieParser());
app.use(passport.initialize());

// app.use(cors({
//   origin: 'http://localhost:5173'
//   credentials: true,
// }));

//Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);

//Error Handling Middleware
app.use(errorHandler);

export default app;
