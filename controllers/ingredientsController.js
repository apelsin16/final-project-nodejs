import Ingredient from '../db/models/Ingredient.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';

export const getIngredients = async (_, res) => {
    const ingredients = await Ingredient.findAll();
    res.status(200).json(ingredients);
};

export default {
    getIngredients: ctrlWrapper(getIngredients),
};
