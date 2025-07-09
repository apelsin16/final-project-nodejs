import request from 'supertest';
import app from '../app.js'; 

describe('GET /api/ingredients', () => {
  it('should return a list of ingredients', async () => {
    const response = await request(app).get('/api/ingredients');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // додатково можна перевірити структуру
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('desc');
    }
  });
});
