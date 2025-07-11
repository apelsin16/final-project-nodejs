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
      expect(res.body.recipes[0].category?.name).toBe('Dessert');
    }
  });

  test('повертає рецепти за інгредієнтом', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ ingredient: 'Sugar' }) // 🔁 Підстав актуальний інгредієнт
      .expect(200);

    expect(res.body.recipes).toBeInstanceOf(Array);
    if (res.body.recipes.length > 0) {
      const hasIngredient = res.body.recipes[0].ingredients?.some(i =>
        i.name.toLowerCase().includes('sugar')
      );
      expect(hasIngredient).toBe(true);
    }
  });

  test('повертає рецепти за регіоном', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ area: 'Italian' }) // 🔁 Підстав актуальний регіон
      .expect(200);

    expect(res.body.recipes).toBeInstanceOf(Array);
    if (res.body.recipes.length > 0) {
      expect(res.body.recipes[0].area?.name).toBe('Italian');
    }
  });

  test('підтримує пагінацію', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ page: 1, limit: 5 })
      .expect(200);

    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.limit).toEqual('5'); // якщо API повертає рядок

    expect(Array.isArray(res.body.recipes)).toBe(true);
    expect(res.body.recipes.length).toBeLessThanOrEqual(5);
  });

  test('працює комбінований фільтр: category + area + ingredient', async () => {
    const res = await request(app)
      .get('/api/recipes/search')
      .query({ category: 'Dessert', area: 'Italian', ingredient: 'Sugar' })
      .expect(200);

    expect(res.body.recipes).toBeInstanceOf(Array);
    // Якщо є результати — перевір, що всі умови збігаються
    if (res.body.recipes.length > 0) {
      const recipe = res.body.recipes[0];
      expect(recipe.category?.name).toBe('Dessert');
      expect(recipe.area?.name).toBe('Italian');
      const hasSugar = recipe.ingredients?.some(i => i.name.toLowerCase().includes('sugar'));
      expect(hasSugar).toBe(true);
    }
  });
});
