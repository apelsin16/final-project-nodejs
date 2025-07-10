import request from 'supertest';
import app from '../app.js'; 
import sequelize from '../db/sequelize.js';



describe('GET /api/recipes/search', () => {
  beforeAll(async () => {
    await sequelize.authenticate(); 
  });

  test('повертає рецепти за категорією', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ category: 'Dessert' })
      .expect(200);

    expect(res.body.recipes).toBeInstanceOf(Array);
    if (res.body.recipes.length > 0) {
      expect(res.body.recipes[0]).toHaveProperty('category', 'Dessert');
    }
  });

  test('повертає рецепти за інгредієнтом', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ ingredient: 'Sugar' })
      .expect(200);

    expect(res.body.recipes).toBeInstanceOf(Array);
    // додаткові перевірки можна реалізувати, якщо точно знаєш структуру
  });

  test('повертає рецепти за регіоном', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ area: 'Italian' })
      .expect(200);

    expect(res.body.recipes).toBeInstanceOf(Array);
  });

  test('підтримує пагінацію', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ page: 1, limit: 5 })
      .expect(200);

    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.limit).toBe(5);
    expect(res.body.recipes.length).toBeLessThanOrEqual(5);
  });
});
