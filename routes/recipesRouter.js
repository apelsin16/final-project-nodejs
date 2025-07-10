import express from 'express';
import recipesController from '../controllers/recipesControllers.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';
import { auth } from '../middlewares/auth.js';
import { validateQuery, validateParams } from '../middlewares/validation.js';
import { getFavoritesQuerySchema, recipeIdParamsSchema } from '../schemas/recipesSchemas.js';

const recipesRouter = express.Router();

// Применяем auth middleware ко всем роутам
recipesRouter.use(auth);

recipesRouter.get('/own', ctrlWrapper(recipesController.getOwnRecipes));

// Видалити власний рецепт
recipesRouter.delete('/:id', ctrlWrapper(recipesController.deleteOwnRecipe));

// Додати рецепт до списку улюблених
recipesRouter.post('/:id/favorite', ctrlWrapper(recipesController.addToFavorites));

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get('/favorites', validateQuery(getFavoritesQuerySchema), recipesController.getFavoriteRecipes);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete(
    '/favorites/:recipeId',
    validateParams(recipeIdParamsSchema),
    recipesController.removeFavoriteRecipe
);

export default recipesRouter;
