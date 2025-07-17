import Favorite from '../db/models/Favorite.js';
import Recipe from '../db/models/Recipe.js';
import Area from '../db/models/Area.js';
import Category from '../db/models/Category.js';
import Ingredient from '../db/models/Ingredient.js';
import RecipeIngredient from '../db/models/RecipeIngredient.js';
import HttpError from '../helpers/HttpError.js';
import User from '../db/models/User.js';
import { sequelize } from '../db/models/index.js';

export const getRecipeById = async recipeId => {
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
        throw HttpError(404, 'Recipe not found. Please check the recipe ID and try again.');
    }

    return recipe;
};

export const getOwnRecipes = async (userId, { page = 1, limit = 9 }) => {
    const offset = (page - 1) * limit;

    // Получаем общее количество собственных рецептов
    const totalCount = await Recipe.count({
        where: { ownerId: userId },
    });

    if (totalCount === 0) {
        return {
            recipes: [],
            pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalRecipes: 0,
                recipesPerPage: parseInt(limit),
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }

    // Получаем собственные рецепты с полной информацией и пагинацией
    const recipes = await Recipe.findAll({
        where: { ownerId: userId },
        include: [
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
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
        recipes: recipes || [],
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

export const deleteOwnRecipe = async (recipeId, userId) => {
    const recipe = await Recipe.findOne({
        where: { id: recipeId, ownerId: userId },
    });

    if (!recipe) return null;

    await recipe.destroy();
    return recipe;
};

export const addToFavorites = async (userId, recipeId) => {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
        throw HttpError(404, 'Recipe not found. Please check the recipe ID and try again.');
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw HttpError(401, 'Authentication required. Please log in and try again.');
    }

    const existingFavorite = await Favorite.findOne({
        where: { userId, recipeId },
    });
    if (existingFavorite) {
        throw HttpError(
            409,
            'Recipe already in favorites. This recipe is already saved to your favorites list.'
        );
    }

    await Favorite.create({ userId, recipeId });
};

export const getFavoriteRecipes = async (user, { page = 1, limit = 9 }) => {
    const offset = (page - 1) * limit;
    const totalCount = await Favorite.count({
        where: { userId: user.id },
    });

    const favoriteRecipes = await Recipe.findAll({
        attributes: ['id', 'title', 'thumb', 'description', 'instructions'],
        include: [
            {
                model: Favorite,
                as: 'favoriteEntries',
                where: { userId: user.id },
                attributes: [],
            },
            {
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'avatarURL'],
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
        order: [['createdAt', 'DESC']],
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
    const favorite = await Favorite.findOne({
        where: {
            userId: user.id,
            recipeId: recipeId,
        },
    });

    if (!favorite) {
        throw HttpError(
            404,
            'Recipe not found in favorites. Please check if this recipe was added to your favorites list.'
        );
    }

    await favorite.destroy();

    return {
        success: true,
        message:
            'Recipe removed from favorites successfully. The recipe has been removed from your favorites list.',
        recipe: favorite,
    };
};

export const createRecipe = async (user, recipeData) => {
    const { ingredients, ...recipeFields } = recipeData;

    const category = await Category.findByPk(recipeFields.categoryId);
    if (!category) {
        throw HttpError(400, 'Category not found. Please select a valid category.');
    }

    if (recipeFields.areaId) {
        const area = await Area.findByPk(recipeFields.areaId);
        if (!area) {
            throw HttpError(400, 'Area not found. Please select a valid area.');
        }
    }

    const ingredientIds = ingredients.map(ing => ing.ingredientId);
    const existingIngredients = await Ingredient.findAll({
        where: { id: ingredientIds },
        attributes: ['id'],
    });

    if (existingIngredients.length !== ingredientIds.length) {
        throw HttpError(
            400,
            'One or more ingredients not found. Please check your ingredient selection.'
        );
    }

    const newRecipe = await Recipe.create({
        ...recipeFields,
        ownerId: user.id,
    });

    const recipeIngredients = ingredients.map(ing => ({
        recipeId: newRecipe.id,
        ingredientId: ing.ingredientId,
        measure: ing.measure,
    }));

    await RecipeIngredient.bulkCreate(recipeIngredients);

    const createdRecipe = await Recipe.findByPk(newRecipe.id, {
        include: [
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

    return createdRecipe;
};

export const getPopularRecipes = async ({ limit = 10 }) => {
    const recipes = await Recipe.findAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM favorites
                        WHERE favorites."recipeId" = "Recipe"."id"
                    )`),
                    'favorites_count',
                ],
            ],
        },
        include: [
            {
                model: User,
                as: 'owner',
                attributes: ['id', 'name', 'avatarURL'],
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
        order: [
            [sequelize.literal('favorites_count'), 'DESC'],
            ['createdAt', 'DESC'],
        ],
        limit: parseInt(limit),
        subQuery: false,
    });

    return recipes || [];
};

export const getFilteredRecipes = async ({ category, area, ingredient, page = 1, limit = 12 }) => {
    const offset = (page - 1) * limit;

    const where = {};
    const include = [
        {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'avatarURL'],
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
    ];

    // Додаткові фільтри
    if (category) {
        // Змінюємо підхід - замість додавання нового include, додаємо where умову до існуючого
        const categoryInclude = include.find(inc => inc.as === 'category');
        categoryInclude.where = { name: category };
        categoryInclude.required = true;
    }

    if (area) {
        const areaInclude = include.find(inc => inc.as === 'area');
        areaInclude.where = { name: area };
        areaInclude.required = true;
    }

    if (ingredient) {
        const ingredientInclude = include.find(inc => inc.as === 'ingredients');
        ingredientInclude.where = { name: ingredient };
        ingredientInclude.required = true;
    }

    const { rows, count } = await Recipe.findAndCountAll({
        where,
        include,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
        distinct: true, // Fix pagination count with many-to-many relationships
    });

    const totalPages = Math.ceil(count / limit);

    return {
        recipes: rows,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalRecipes: count,
            recipesPerPage: parseInt(limit),
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
};
