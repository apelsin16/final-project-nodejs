import Testimonial from '../db/models/Testimonial.js';

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ order: [['id', 'DESC']] });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};
