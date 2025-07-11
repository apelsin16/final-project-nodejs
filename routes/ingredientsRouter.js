import express from 'express';
import ingredientsController from '../controllers/ingredientsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Отримати список всіх інгредієнтів
 *     description: Публічний ендпоінт для отримання всіх доступних інгредієнтів
 *     responses:
 *       200:
 *         description: Список інгредієнтів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   thumb:
 *                     type: string
 */
router.get('/', ingredientsController.getIngredients);

export default router;
