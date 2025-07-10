import express from 'express';
import { getFavoriteRecipes, removeFavoriteRecipe, getCategories } from '../controllers/recipesControllers.js';
import { auth } from '../middlewares/auth.js';
import { validateQuery, validateParams } from '../middlewares/validation.js';
import { getFavoritesQuerySchema, recipeIdParamsSchema } from '../schemas/recipesSchemas.js';

const recipesRouter = express.Router();

// GET /api/recipes/categories - получить список всех категорий (публичный ендпоинт)
recipesRouter.get('/categories', getCategories);

// Применяем auth middleware к приватным роутам
recipesRouter.use(auth);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', validateQuery(getFavoritesQuerySchema), getFavoriteRecipes);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete('/favorites/:recipeId', validateParams(recipeIdParamsSchema), removeFavoriteRecipe);

export default recipesRouter;
