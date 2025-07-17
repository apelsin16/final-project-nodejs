import Ingredient from '../db/models/Ingredient.js';
import Recipe from '../db/models/Recipe.js';
import Category from '../db/models/Category.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import { sequelize } from '../db/models/index.js';

export const getIngredients = async (categoryName = null) => {
    if (!categoryName) {
        // Якщо категорія не вказана, повертаємо всі інгредієнти
        const ingredients = await Ingredient.findAll({
            attributes: ['id', 'name', 'img', 'desc'],
            order: [['name', 'ASC']],
        });
        return ingredients;
    }

    // Фільтруємо інгредієнти за категорією використовуючи підзапит
    const ingredients = await Ingredient.findAll({
        attributes: ['id', 'name', 'img', 'desc'],
        where: {
            id: {
                [sequelize.Sequelize.Op.in]: sequelize.literal(`(
                    SELECT DISTINCT ri."ingredientId"
                    FROM recipe_ingredients ri
                    JOIN recipes r ON ri."recipeId" = r.id
                    JOIN categories c ON r."categoryId" = c.id
                    WHERE c.name = '${categoryName}'
                )`)
            }
        },
        order: [['name', 'ASC']],
    });

    return ingredients;
};
