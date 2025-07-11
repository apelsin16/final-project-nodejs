import * as models from './db/models/index.js';
const { sequelize } = models;

import dotenv from 'dotenv';

dotenv.config();
import recipesSearchRouter from './routes/recipesSearchRouter.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';



// import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import testimonialsRouter from './routes/testimonialsRouter.js';
import userRouter from './routes/usersRouter.js';
import recipesRouter from './routes/recipesRouter.js';
import ingredientsRouter from './routes/ingredientsRouter.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const app = express();

// app.use('/avatars', express.static(path.resolve('public/avatars')));

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// app.use("/api/contacts", contactsRouter);
app.use('/api/recipes/search', recipesSearchRouter);
app.use("/api/auth", authRouter);
app.use('/api/users', userRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/uploads', express.static(UPLOAD_DIR));
const swaggerMiddleware = swaggerDocs();
if (Array.isArray(swaggerMiddleware)) {
    app.use('/api-docs', ...swaggerMiddleware);
} else {
    app.use('/api-docs', swaggerMiddleware);
}

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful');

        await sequelize.sync();

        app.listen(3000, () => {
            console.log('Server is running. Use our API on port: 3000');
        });
    } catch (error) {
        console.error('❌ Connection error:', error);
    }
};

start();