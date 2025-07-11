import express from 'express';
import areasController from '../controllers/areasController.js';

const router = express.Router();

router.get('/', areasController.getAreas);

export default router;
