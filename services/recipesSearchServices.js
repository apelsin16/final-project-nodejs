import { Op } from 'sequelize';
import { Recipe, Category, Area, Ingredient } from '../db/models/index.js';

export const getFilteredRecipes = async ({ category, categoryId, area, areaId, ingredient, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const where = {};
  const include = [];

  // 🔍 Category filter
if (categoryId) {
  where.categoryId = categoryId;
} else if (category) {
  include.push({
    model: Category,
    as: 'category',
    where: {
      name: {
        [Op.iLike]: category,
      },
    },
    required: true,
  });
}

  // 🌍 Area filter
  include.push({
    model: Area,
    as: 'area',
    where: area ? { name: { [Op.iLike]: area } } : undefined,
    required: !!area,
  });

  if (areaId) {
    where.areaId = areaId;
  }

  // 🧂 Ingredient filter
  if (ingredient) {
    include.push({
      model: Ingredient,
      as: 'ingredients',
      where: {
        name: { [Op.iLike]: ingredient },
      },
      through: { attributes: [] },
      required: true,
    });
  } else {
    include.push({
      model: Ingredient,
      as: 'ingredients',
      through: { attributes: [] },
      required: false,
    });
  }

  const { rows, count } = await Recipe.findAndCountAll({
    where,
    include,
    offset,
    limit,
  });

  return {
    recipes: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
