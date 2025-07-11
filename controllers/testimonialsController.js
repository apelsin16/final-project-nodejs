import { getAllTestimonials as getTestimonialsService } from '../services/testimonialsService.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';

const getAllTestimonials = async (req, res) => {
    const testimonials = await getTestimonialsService();
    res.status(200).json({ testimonials });
};

export default {
    getAllTestimonials: ctrlWrapper(getAllTestimonials),
};
