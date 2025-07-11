import express from 'express';
import { searchRecipes } from '../controllers/recipesSearchControllers.js';

const router = express.Router();

router.get('/', searchRecipes);

export default router;
