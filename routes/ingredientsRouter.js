import express from 'express';
import ingredientsController from '../controllers/ingredientsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Отримати список інгредієнтів
 *     description: Публічний ендпоінт для отримання інгредієнтів з можливістю фільтрації по категоріях
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Назва категорії для фільтрації інгредієнтів (наприклад, "Beef", "Breakfast")
 *         example: "Beef"
 *     responses:
 *       200:
 *         description: Список інгредієнтів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       img:
 *                         type: string
 *                       desc:
 *                         type: string
 */
router.get('/', ingredientsController.getIngredients);

export default router;
