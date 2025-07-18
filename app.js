import * as models from './db/models/index.js';
const { sequelize } = models;
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import testimonialsRouter from './routes/testimonialsRouter.js';
import userRouter from './routes/usersRouter.js';
import recipesRouter from './routes/recipesRouter.js';
import ingredientsRouter from './routes/ingredientsRouter.js';
import categoriesRouter from './routes/categoriesRouter.js';
import areasRouter from './routes/areasRouter.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/uploads', express.static(path.resolve('public', 'uploads')));

app.use('/api/users', userRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/areas', areasRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/recipes', recipesRouter);

const swaggerMiddleware = swaggerDocs();
if (Array.isArray(swaggerMiddleware)) {
    app.use('/api-docs', ...swaggerMiddleware);
} else {
    app.use('/api-docs', swaggerMiddleware);
}

app.use((_, res) => {
    res.status(404).json({ message: 'Resource not found. Please check the URL and try again.' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error occurred. Please try again later or contact support.' } =
        err;

    // Log error for debugging
    console.error('Error:', {
        status,
        message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    res.status(status).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful');

        await sequelize.sync();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running. Use our API on port: ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Connection error:', error);
    }
};

start();
