import Testimonial from "../db/models/Testimonial.js";


export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};
