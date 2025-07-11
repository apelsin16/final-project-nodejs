import express from 'express';
import testimonialsController from '../controllers/testimonialsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Отримати список всіх відгуків користувачів
 *     description: Публічний ендпоінт для отримання відгуків про додаток
 *     responses:
 *       200:
 *         description: Список відгуків
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   review:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   user:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       avatar:
 *                         type: string
 */
router.get('/', testimonialsController.getAllTestimonials);

export default router;
