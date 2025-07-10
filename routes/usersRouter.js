import express from 'express';
import userControllers from '../controllers/userControllers.js';
import { validateBody } from '../middlewares/validation.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), userControllers.registerUser);
router.post('/login', validateBody(loginSchema), userControllers.login);

export default router;
