import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './db/sequelize.js';

//import recipesRouter from './src/routes/recipesRouter.js';
//import userRouter from './src/routes/usersRouter.js';
import ingredientsRouter from './routes/ingredientsRouter.js'; // ✅ добавили
import { swaggerDocs } from './src/middlewares/swaggerDocs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// Роуты
//app.use('/users', userRouter);
//app.use('/api/recipes', recipesRouter);
app.use('/api/ingredients', ingredientsRouter); // ✅ подключили маршрут

app.use('/uploads', express.static(UPLOAD_DIR));

const swaggerMiddleware = swaggerDocs();
if (Array.isArray(swaggerMiddleware)) {
    app.use('/api-docs', ...swaggerMiddleware);
} else {
    app.use('/api-docs', swaggerMiddleware);
}

// 404 Middleware
app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Middleware
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
export default app;
start();
