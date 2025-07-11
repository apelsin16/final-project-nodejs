import express from 'express';
import recipesController from '../controllers/recipesControllers.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';
import { authenticate } from '../middlewares/./authenticate.js';
import { validateQuery, validateParams, validateBody } from '../middlewares/validation.js';
import {
    getFavoritesQuerySchema,
    recipeIdParamsSchema,
    idParamsSchema,
    createRecipeSchema,
    getPopularRecipesQuerySchema,
} from '../schemas/recipesSchemas.js';
import { searchRecipesQuerySchema } from '../schemas/searchSchemas.js';

const recipesRouter = express.Router();

// GET /api/recipes - получить рецепты с поиском и фильтрацией (публичный)
recipesRouter.get('/', validateQuery(searchRecipesQuerySchema), recipesController.getAllRecipes);

recipesRouter.get(
    '/popular',
    validateQuery(getPopularRecipesQuerySchema),
    recipesController.getPopularRecipes
);

// Приватные роуты должны быть ДО /:recipeId

recipesRouter.use(authenticate);

recipesRouter.get('/own', validateQuery(getFavoritesQuerySchema), recipesController.getOwnRecipes);

recipesRouter.get(
    '/favorites',
    validateQuery(getFavoritesQuerySchema),
    ctrlWrapper(recipesController.getFavoriteRecipes)
);

recipesRouter.delete(
    '/:recipeId/favorite',
    validateParams(recipeIdParamsSchema),
    ctrlWrapper(recipesController.removeFavoriteRecipe)
);

recipesRouter.get('/:recipeId', validateParams(recipeIdParamsSchema), recipesController.getRecipeById);

recipesRouter.delete('/:id', ctrlWrapper(recipesController.deleteOwnRecipe));

recipesRouter.post(
    '/:id/favorite',
    validateParams(idParamsSchema),
    ctrlWrapper(recipesController.addToFavorites)
);

recipesRouter.post('/', validateBody(createRecipeSchema), recipesController.createRecipe);

export default recipesRouter;
