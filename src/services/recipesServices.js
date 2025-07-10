import { User, Recipe, Category, Area, Ingredient } from '../../db/models/index.js';
import Favorite from '../../db/models/Favorite.js';
import HttpError from '../helpers/HttpError.js';

export const getRecipeById = async (recipeId) => {
    const recipe = await Recipe.findByPk(recipeId, {
        include: [
            {
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'email', 'avatarURL'],
            },
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
            },
            {
                model: Area,
                as: 'area',
                attributes: ['id', 'name'],
            },
            {
                model: Ingredient,
                as: 'ingredients',
                attributes: ['id', 'name', 'img', 'desc'],
                through: {
                    attributes: ['measure'],
                },
            },
        ],
    });

    if (!recipe) {
        throw HttpError(404, 'Recipe not found');
    }

    return recipe;
};

export const getFavoriteRecipes = async (user, { page = 1, limit = 9 }) => {
    const offset = (page - 1) * limit;

    // Получаем общее количество избранных рецептов
    const totalCount = await Favorite.count({
        where: { userId: user.id },
    });

    // Получаем избранные рецепты с пагинацией
    const favoriteRecipes = await Recipe.findAll({
        attributes: ['id', 'title', 'thumb', 'description'],
        include: [
            {
                model: Favorite,
                as: 'favoriteEntries',
                where: { userId: user.id },
                attributes: [],
            },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
        recipes: favoriteRecipes || [],
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalRecipes: totalCount,
            recipesPerPage: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};

export const removeFavoriteRecipe = async (user, recipeId) => {
    console.log(user.id);
    console.log(recipeId);
    const favorite = await Favorite.findOne({
        where: {
            userId: user.id,
            recipeId: recipeId,
        },
    });
    console.log(favorite);

    if (!favorite) {
        throw HttpError(404, 'Recipe not found in favorites');
    }

    await favorite.destroy();

    return { message: 'Recipe removed from favorites', recepy: favorite };
};
