import request from 'supertest';
import app from '../app.js';

describe('GET /api/testimonials', () => {
  it('should return a list of testimonials', async () => {
    const res = await request(app).get('/api/testimonials');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      res.body.forEach((testimonial) => {
        expect(testimonial).toHaveProperty('id');
        expect(testimonial).toHaveProperty('testimonial');
        expect(testimonial).toHaveProperty('owner');
      });
    }
  });
});
