import express from 'express';
import { getFavoriteRecipes, removeFavoriteRecipe, createRecipe } from '../controllers/recipesControllers.js';
import { auth } from '../middlewares/auth.js';
import { validateQuery, validateParams, validateBody } from '../middlewares/validation.js';
import { getFavoritesQuerySchema, recipeIdParamsSchema, createRecipeSchema } from '../schemas/recipesSchemas.js';

const recipesRouter = express.Router();

// Применяем auth middleware ко всем роутам
recipesRouter.use(auth);

// POST /api/recipes - создать новый рецепт
recipesRouter.post('/', validateBody(createRecipeSchema), createRecipe);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', validateQuery(getFavoritesQuerySchema), getFavoriteRecipes);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete('/favorites/:recipeId', validateParams(recipeIdParamsSchema), removeFavoriteRecipe);

export default recipesRouter;
