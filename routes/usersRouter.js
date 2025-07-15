import express from 'express';
import userControllers from '../controllers/userControllers.js';
import { validateBody, validateParams, handleMulterError } from '../middlewares/validation.js';
import { registerSchema, loginSchema, userIdSchema } from '../schemas/authSchemas.js';
import { authenticate } from '../middlewares/./authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Реєстрація користувача
 *     description: Створення нового акаунту користувача
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *       400:
 *         description: Помилка валідації
 */
router.post('/register', validateBody(registerSchema), userControllers.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Авторизація користувача
 *     description: Вхід в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успішна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Неправильні облікові дані
 */
router.post('/login', validateBody(loginSchema), userControllers.login);

router.use(authenticate);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     tags:
 *       - Users
 *     summary: Отримати поточного користувача
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Дані поточного користувача
 *       401:
 *         description: Не авторизований
 */
router.get('/current', userControllers.getCurrent);

/**
 * @swagger
 * /api/users/current/detailed:
 *   get:
 *     tags:
 *       - Users
 *     summary: Отримати детальну інформацію про поточного користувача
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Детальні дані користувача
 */
router.get('/current/detailed', userControllers.getCurrentDetailed);

/**
 * @swagger
 * /api/users/following:
 *   get:
 *     tags:
 *       - Users
 *     summary: Отримати список підписок
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список користувачів на яких підписаний
 */
router.get('/following', userControllers.getFollowingController);

/**
 * @swagger
 * /api/users/followers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Отримати список підписників
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список підписників
 */
router.get('/followers', userControllers.getFollowersController);

/**
 * @swagger
 * /api/users/follow/{userId}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Підписатися на користувача
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Успішно підписався
 */
router.post('/follow/:userId', validateParams(userIdSchema), userControllers.followUserController);

/**
 * @swagger
 * /api/users/follow/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Відписатися від користувача
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Успішно відписався
 */
router.delete('/follow/:userId', validateParams(userIdSchema), userControllers.unfollowUserController);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Вихід з системи
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішний вихід
 */
router.post('/logout', userControllers.logout);

/**
 * @swagger
 * /api/users/avatars:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Оновити аватар користувача
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Аватар оновлено
 */
router.patch(
    '/avatars',
    upload.single('avatar'),
    handleMulterError,
    userControllers.updateUserAvatarController
);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Отримати користувача за ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Дані користувача
 *       401:
 *         description: Не авторизований
 */
router.get('/:userId', validateParams(userIdSchema), userControllers.getUserByIdController);

/**
 * @swagger
 * /api/users/{userId}/followers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Отримати список підписників користувача за userId
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID користувача
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
 *         description: Кількість підписників на сторінці
 *     responses:
 *       200:
 *         description: Список підписників
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avatarURL:
 *                         type: string
 *                       recipes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             title:
 *                               type: string
 *                             thumb:
 *                               type: string
 *                       totalRecipes:
 *                         type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalFollowers:
 *                       type: integer
 *                     followersPerPage:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 */
router.get(
    '/:userId/followers',
    validateParams(userIdSchema),
    userControllers.getFollowersByUserIdController
);

export default router;
