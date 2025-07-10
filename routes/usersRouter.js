import express from 'express';
import userControllers from '../controllers/userControllers.js';
import { validateBody } from '../middlewares/validation.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  userControllers.registerUser
);
router.post('/login', validateBody(loginSchema), userControllers.login);
router.get('/following', auth, userControllers.getFollowingController);
router.patch(
  '/avatars',
  auth,
  upload.single('avatar'),
  userControllers.updateUserAvatarController
);
router.get('/followers', auth, userControllers.getFollowersController);
router.post('/logout', auth, userControllers.logout);

export default router;
