import { getFilteredRecipes } from '../services/recipesSearchServices.js';

export const searchRecipes = async (req, res) => {
  try {
    const { category, area, ingredient, page = 1, limit = 6 } = req.query;
    const result = await getFilteredRecipes({ category, area, ingredient, page, limit });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
