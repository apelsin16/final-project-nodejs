import express from 'express';
import areasController from '../controllers/areasController.js';

const router = express.Router();

/**
 * @swagger
 * /api/areas:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Отримати список кухонь світу
 *     description: Публічний ендпоінт для отримання кухонь з можливістю фільтрації по категоріях
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Назва категорії для фільтрації кухонь (наприклад, "Beef", "Breakfast")
 *         example: "Beef"
 *     responses:
 *       200:
 *         description: Список кухонь світу
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 areas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 */
router.get('/', areasController.getAreas);

export default router;
