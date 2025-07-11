import express from 'express';
import userControllers from '../controllers/userControllers.js';
import { validateBody, validateParams, handleMulterError } from '../middlewares/validation.js';
import { registerSchema, loginSchema, userIdSchema } from '../schemas/authSchemas.js';
import { authenticate } from '../middlewares/./authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), userControllers.registerUser);

router.post('/login', validateBody(loginSchema), userControllers.login);

router.use(authenticate);

router.get('/current', userControllers.getCurrent);
router.get('/current/detailed', userControllers.getCurrentDetailed);

router.get('/following', userControllers.getFollowingController);
router.get('/followers', userControllers.getFollowersController);
router.post('/follow/:userId', validateParams(userIdSchema), userControllers.followUserController);
router.delete('/follow/:userId', validateParams(userIdSchema), userControllers.unfollowUserController);

router.post('/logout', userControllers.logout);

router.patch(
    '/avatars',
    upload.single('avatar'),
    handleMulterError,
    userControllers.updateUserAvatarController
);

router.get('/:userId', validateParams(userIdSchema), userControllers.getUserByIdController);

export default router;
