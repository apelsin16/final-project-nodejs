import ctrlWrapper from '../helpers/controllerWrapper.js';
import { Recipe, User, Favorite } from '../db/models/index.js';
import HttpError from '../helpers/HttpError.js';
import * as recipesServices from '../services/recipesServices.js';

const getFavoriteRecipes = async (req, res, next) => {
    const { page = 1, limit = 9 } = req.query;

    const result = await recipesServices.getFavoriteRecipes(req.user, { page, limit });

    res.status(200).json({
        favorites: result.recipes,
        pagination: result.pagination,
    });
};

const removeFavoriteRecipe = async (req, res) => {
    const { recipeId } = req.params;

    const result = await recipesServices.removeFavoriteRecipe(req.user, recipeId);

    res.status(200).json(result);
};

const getOwnRecipes = async (req, res) => {
    const userId = req.user.id;

    const recipes = await Recipe.findAll({
        where: { ownerId: userId },
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json(recipes);
};

const deleteOwnRecipe = async (req, res, next) => {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const recipe = await Recipe.findOne({
        where: { id: recipeId, ownerId: userId },
    });

    if (!recipe) {
        throw HttpError(404, 'Recipe not found or access denied');
    }

    await recipe.destroy();

    res.status(200).json({ message: 'Recipe deleted successfully' });
};

const addToFavorites = async (req, res, next) => {
    const userId = req.user.id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
        throw HttpError(404, 'Recipe not found');
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw HttpError(401, 'User not found');
    }

    const existingFavorite = await Favorite.findOne({
        where: { userId, recipeId },
    });
    if (existingFavorite) {
        throw HttpError(400, 'Recipe already in favorites');
    }

    await Favorite.create({ userId, recipeId });

    res.status(201).json({ message: 'Recipe added to favorites' });
};

const getCategories = async (req, res, next) => {
    const categories = await recipesServices.getCategories();

    res.status(200).json(categories);
};

export default {
    getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
    removeFavoriteRecipe: ctrlWrapper(removeFavoriteRecipe),
    getOwnRecipes: ctrlWrapper(getOwnRecipes),
    deleteOwnRecipe: ctrlWrapper(deleteOwnRecipe),
    addToFavorites: ctrlWrapper(addToFavorites),
    getCategories: ctrlWrapper(getCategories),
};
