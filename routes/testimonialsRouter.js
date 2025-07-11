import express from 'express';
import testimonialsController from '../controllers/testimonialsController.js';

const router = express.Router();

router.get('/', testimonialsController.getAllTestimonials);

export default router;
