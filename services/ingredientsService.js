import Ingredient from '../db/models/Ingredient.js';

export const getAllIngredients = async () => {
  return Ingredient.findAll();
};
