import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './modules/User/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')));

//Routes
app.use('/users', userRouter);

export default app;
