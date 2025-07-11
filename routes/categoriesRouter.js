import express from 'express';
import categoriesController from '../controllers/categoriesController.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Отримати список всіх категорій страв
 *     description: Публічний ендпоінт для отримання всіх доступних категорій
 *     responses:
 *       200:
 *         description: Список категорій
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
 *                   thumb:
 *                     type: string
 */
router.get('/', categoriesController.getCategories);

export default router;
