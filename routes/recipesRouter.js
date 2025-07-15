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
    categoryIdParamsSchema,
} from '../schemas/recipesSchemas.js';
import { searchRecipesQuerySchema } from '../schemas/searchSchemas.js';

const recipesRouter = express.Router();

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Отримати рецепти з пошуком та фільтрацією
 *     description: Публічний ендпоінт для отримання рецептів
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук за назвою рецепта
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Фільтр за категорією
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Фільтр за кухнею світу
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         description: Фільтр за інгредієнтами
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Кількість рецептів на сторінці
 *     responses:
 *       200:
 *         description: Список рецептів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       area:
 *                         type: string
 *                       instructions:
 *                         type: string
 *                       time:
 *                         type: string
 *                       thumb:
 *                         type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
// GET /api/recipes - получить рецепты с поиском и фильтрацией (публичный)
recipesRouter.get('/', validateQuery(searchRecipesQuerySchema), recipesController.getAllRecipes);

/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Отримати популярні рецепти
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Кількість рецептів
 *     responses:
 *       200:
 *         description: Список популярних рецептів
 */
recipesRouter.get(
    '/popular',
    validateQuery(getPopularRecipesQuerySchema),
    recipesController.getPopularRecipes
);

/**
 * @swagger
 * /api/recipes/category/{categoryId}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Отримати рецепти за категорією
 *     description: Публічний ендпоінт для отримання рецептів конкретної категорії
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID категорії
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Кількість рецептів на сторінці
 *     responses:
 *       200:
 *         description: Список рецептів категорії
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       thumb:
 *                         type: string
 *                       time:
 *                         type: string
 *                       instructions:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalRecipes:
 *                       type: integer
 *                     recipesPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: Категорія не знайдена
 */
recipesRouter.get(
    '/category/:categoryId',
    validateParams(categoryIdParamsSchema),
    validateQuery(getFavoritesQuerySchema),
    recipesController.getRecipesByCategory
);

// Приватные роуты должны быть ДО /:recipeId

recipesRouter.use(authenticate);

/**
 * @swagger
 * /api/recipes/own:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Отримати власні рецепти користувача
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Список власних рецептів
 *       401:
 *         description: Не авторизований
 */
recipesRouter.get('/own', validateQuery(getFavoritesQuerySchema), recipesController.getOwnRecipes);

/**
 * @swagger
 * /api/recipes/favorites:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Отримати обрані рецепти
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Список обраних рецептів
 */
recipesRouter.get(
    '/favorites',
    validateQuery(getFavoritesQuerySchema),
    ctrlWrapper(recipesController.getFavoriteRecipes)
);

/**
 * @swagger
 * /api/recipes/{recipeId}/favorite:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Видалити рецепт з обраного
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Рецепт видалено з обраного
 */
recipesRouter.delete(
    '/:recipeId/favorite',
    validateParams(recipeIdParamsSchema),
    ctrlWrapper(recipesController.removeFavoriteRecipe)
);

/**
 * @swagger
 * /api/recipes/{recipeId}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Отримати рецепт за ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Детальна інформація про рецепт
 *       404:
 *         description: Рецепт не знайдено
 */
recipesRouter.get('/:recipeId', validateParams(recipeIdParamsSchema), recipesController.getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Видалити власний рецепт
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рецепта
 *     responses:
 *       200:
 *         description: Рецепт видалено
 *       404:
 *         description: Рецепт не знайдено
 */
recipesRouter.delete('/:id', ctrlWrapper(recipesController.deleteOwnRecipe));

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Додати рецепт до обраного
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рецепта
 *     responses:
 *       201:
 *         description: Рецепт додано до обраного
 */
recipesRouter.post(
    '/:id/favorite',
    validateParams(idParamsSchema),
    ctrlWrapper(recipesController.addToFavorites)
);

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Створити новий рецепт
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - area
 *               - instructions
 *               - time
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Паста Карбонара"
 *               description:
 *                 type: string
 *                 example: "Класична італійська паста"
 *               category:
 *                 type: string
 *                 example: "Основні страви"
 *               area:
 *                 type: string
 *                 example: "Італійська"
 *               instructions:
 *                 type: string
 *                 example: "1. Відварити пасту..."
 *               time:
 *                 type: string
 *                 example: "30 хв"
 *               thumb:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Рецепт створено успішно
 *       400:
 *         description: Помилка валідації
 */
recipesRouter.post('/', validateBody(createRecipeSchema), recipesController.createRecipe);

export default recipesRouter;
