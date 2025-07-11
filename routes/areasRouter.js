import express from 'express';
import areasController from '../controllers/areasController.js';

const router = express.Router();

/**
 * @swagger
 * /api/areas:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Отримати список всіх кухонь світу
 *     description: Публічний ендпоінт для отримання всіх доступних кухонь
 *     responses:
 *       200:
 *         description: Список кухонь світу
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
 */
router.get('/', areasController.getAreas);

export default router;
