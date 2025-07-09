import express from 'express';
import { getFavoriteRecipes, removeFavoriteRecipe } from '../controllers/recipesControllers.js';
import { auth } from '../middlewares/auth.js';
import { validateQuery, validateParams } from '../middlewares/validation.js';
import { getFavoritesQuerySchema, recipeIdParamsSchema } from '../schemas/recipesSchemas.js';

const recipesRouter = express.Router();

// Применяем auth middleware ко всем роутам
recipesRouter.use(auth);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', validateQuery(getFavoritesQuerySchema), getFavoriteRecipes);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete('/favorites/:recipeId', validateParams(recipeIdParamsSchema), removeFavoriteRecipe);

export default recipesRouter;
