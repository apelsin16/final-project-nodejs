import ctrlWrapper from '../helpers/controllerWrapper.js';
import { getAllIngredients } from '../services/ingredientsService.js';

export const getIngredients = async (_, res) => {
  const ingredients = await getAllIngredients();
  res.status(200).json(ingredients);
};

export default {
  getIngredients: ctrlWrapper(getIngredients),
};
