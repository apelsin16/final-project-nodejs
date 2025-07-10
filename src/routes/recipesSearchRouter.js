import express from 'express';
import { searchRecipes } from '../controllers/recipesSearchControllers.js';

const router = express.Router();

// 🔓 Публічний роут — без авторизації
router.get('/search', searchRecipes);

export default router;
