import Favorite from "../db/models/Favorite.js";
import Recipe from "../db/models/Recipe.js";
import Area from '../db/models/Area.js';
import Category from '../db/models/Category.js';
import Ingredient from '../db/models/Ingredient.js';
import HttpError from "../helpers/HttpError.js";
import User from "../db/models/User.js";

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

export const getOwnRecipes = async (userId) => {
  const recipes = await Recipe.findAll({
    where: { ownerId: userId },
    order: [["createdAt", "DESC"]],
  });
  return recipes;
};

// Видалити власний рецепт
export const deleteOwnRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findOne({
    where: { id: recipeId, ownerId: userId },
  });

  if (!recipe) return null;

  await recipe.destroy();
  return recipe;
};

// Додати рецепт до улюблених
export const addToFavorites = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) return { error: "RecipeNotFound" };

  const user = await User.findByPk(userId);
  if (!user) return { error: "UserNotFound" };

  const favorites = await user.getFavoriteRecipes({ where: { id: recipeId } });
  if (favorites.length > 0) return { error: "AlreadyInFavorites" };

  await user.addFavoriteRecipe(recipe);
  return { success: true };
};

export const getFavoriteRecipes = async (user, { page = 1, limit = 9 }) => {
  const offset = (page - 1) * limit;

  // Получаем общее количество избранных рецептов
  const totalCount = await Favorite.count({
    where: { userId: user.id },
  });

  // Получаем избранные рецепты с пагинацией
  const favoriteRecipes = await Recipe.findAll({
    attributes: ["id", "title", "thumb", "description"],
    include: [
      {
        model: Favorite,
        as: "favoriteEntries",
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
    throw HttpError(404, "Recipe not found in favorites");
  }

  await favorite.destroy();

  return { message: "Recipe removed from favorites", recepy: favorite };
};

export const getAreas = async () => {
    const areas = await Area.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    });

    return areas;
};

export const getCategories = async () => {
    const categories = await Category.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
    });

    return categories;
};
