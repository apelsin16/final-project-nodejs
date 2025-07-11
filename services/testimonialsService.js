import Testimonial from '../db/models/Testimonial.js';
import User from '../db/models/User.js';

export const getAllTestimonials = async () => {
    const testimonials = await Testimonial.findAll({
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name'],
            },
        ],
        order: [['id', 'DESC']],
    });
    return testimonials;
};
