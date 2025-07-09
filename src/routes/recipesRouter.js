import express from 'express';
import { getFavoriteRecipes } from '../controllers/recipesControllers.js';
import { auth } from '../middlewares/auth.js';

const recipesRouter = express.Router();

// Применяем auth middleware ко всем роутам
recipesRouter.use(auth);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', getFavoriteRecipes);

export default recipesRouter;
