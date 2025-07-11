import express from 'express';
import ingredientsController from '../controllers/ingredientsController.js';

const router = express.Router();

router.get('/', ingredientsController.getIngredients);

export default router;
