import ctrlWrapper from '../helpers/controllerWrapper.js';
import * as ingredientsServices from '../services/ingredientsServices.js';

const getIngredients = async (req, res, next) => {
    const { category } = req.query;
    const ingredients = await ingredientsServices.getIngredients(category);
    res.status(200).json({ ingredients });
};

export default {
    getIngredients: ctrlWrapper(getIngredients),
};
