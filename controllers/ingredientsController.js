import Ingredient from "../db/models/Ingredient.js";

export const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};
