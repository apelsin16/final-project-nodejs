import express from "express";
import recipesController from "../controllers/recipesControllers.js";
import ctrlWrapper from "../helpers/controllerWrapper.js";
import { auth } from "../middlewares/auth.js";
import { validateQuery, validateParams, validateBody } from "../middlewares/validation.js";
import {
  getFavoritesQuerySchema,
  recipeIdParamsSchema,
  createRecipeSchema,
} from "../schemas/recipesSchemas.js";

const recipesRouter = express.Router();

// GET /api/recipes/popular - отримати популярні рецепти (публичний)
recipesRouter.get('/popular', recipesController.getPopularRecipes);

// GET /api/recipes/categories - получить список всех категорий (публичный ендпоинт)
recipesRouter.get('/categories', recipesController.getCategories);

// GET /api/recipes/areas - получить список всех регионов (публичный ендпоинт)
 recipesRouter.get('/areas', recipesController.getAreas);


// Публічний роут для отримання детальної інформації про рецепт за id
recipesRouter.get('/:recipeId', recipesController.getRecipeById);

// Применяем auth middleware к приватным роутам
recipesRouter.use(auth);


recipesRouter.get("/own", ctrlWrapper(recipesController.getOwnRecipes));

// Видалити власний рецепт
recipesRouter.delete("/:id", ctrlWrapper(recipesController.deleteOwnRecipe));

// Додати рецепт до списку улюблених
recipesRouter.post(
  "/:id/favorite",
  ctrlWrapper(recipesController.addToFavorites)
);

// GET /api/recipes/favorites - получить любимые рецепты пользователя
recipesRouter.get(
  "/favorites",
  validateQuery(getFavoritesQuerySchema),
  ctrlWrapper(recipesController.getFavoriteRecipes)
);

// DELETE /api/recipes/favorites/:recipeId - удалить рецепт из избранного
recipesRouter.delete(
  "/favorites/:recipeId",
  validateParams(recipeIdParamsSchema),
  ctrlWrapper(recipesController.removeFavoriteRecipe)
);

// POST /api/recipes - створити новий рецепт
recipesRouter.post('/', validateBody(createRecipeSchema), recipesController.createRecipe);

export default recipesRouter;
