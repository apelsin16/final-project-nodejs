import express from 'express';
import { getRecipeById, getFavoriteRecipes, removeFavoriteRecipe } from '../controllers/recipesControllers.js';
import { auth } from '../middlewares/auth.js';
import { validateQuery, validateParams } from '../middlewares/validation.js';
import { getFavoritesQuerySchema, recipeIdParamsSchema } from '../schemas/recipesSchemas.js';

const recipesRouter = express.Router();

// Публічний роут для отримання детальної інформації про рецепт за id
recipesRouter.get('/:recipeId', validateParams(recipeIdParamsSchema), getRecipeById);

// Применяем auth middleware к защищенным роутам
recipesRouter.use(auth);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', validateQuery(getFavoritesQuerySchema), getFavoriteRecipes);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete('/favorites/:recipeId', validateParams(recipeIdParamsSchema), removeFavoriteRecipe);

export default recipesRouter;
