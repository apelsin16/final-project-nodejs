import * as recipesSearchServices from '../services/recipesSearchServices.js';

export const searchRecipes = async (req, res, next) => {
  try {
    const { ingredient, category, area, page = 1, limit = 10 } = req.query;

    const result = await recipesSearchServices.searchRecipes({ ingredient, category, area, page, limit });

    res.status(200).json({
      recipes: result.recipes,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
