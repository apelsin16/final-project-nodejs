import Ingredient from '../db/models/Ingredient.js';

export const getIngredients = async () => {
    const ingredients = await Ingredient.findAll({
        attributes: ['id', 'name', 'img', 'desc'],
        order: [['name', 'ASC']],
    });

    return ingredients;
};
