import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './modules/User/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')));

//Routes
app.use('/users', userRoutes);

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
