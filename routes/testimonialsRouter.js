import express from 'express';
import { getAllTestimonials } from '../controllers/testimonialsController.js';

const router = express.Router();

router.get('/', getAllTestimonials);

export default router;
