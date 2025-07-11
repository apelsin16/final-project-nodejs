import request from 'supertest';
import app from '../app.js';

describe('GET /api/ingredients', () => {
  it('should return status 200 and an array of ingredients', async () => {
    const response = await request(app).get('/api/ingredients');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const ingredient = response.body[0];
      expect(ingredient).toHaveProperty('id');
      expect(ingredient).toHaveProperty('name');
    }
  });
});
