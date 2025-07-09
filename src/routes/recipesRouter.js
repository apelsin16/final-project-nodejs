import express from 'express';
import { getFavoriteRecipes, removeFavoriteRecipe } from '../controllers/recipesControllers.js';
import { auth } from '../middlewares/auth.js';

const recipesRouter = express.Router();

// Применяем auth middleware ко всем роутам
recipesRouter.use(auth);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', getFavoriteRecipes);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete('/favorites/:recipeId', removeFavoriteRecipe);

export default recipesRouter;
