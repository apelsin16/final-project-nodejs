import ctrlWrapper from '../helpers/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import * as recipesServices from '../services/recipesServices.js';

const getAllRecipes = async (req, res) => {
    const { category, area, ingredient, page, limit } = req.query;

    const result = await recipesServices.getFilteredRecipes({
        category,
        area,
        ingredient,
        page: parseInt(page),
        limit: parseInt(limit),
    });

    res.status(200).json({
        success: true,
        data: result.recipes,
        pagination: result.pagination,
        filters: { category, area, ingredient },
    });
};

const getRecipeById = async (req, res) => {
    const { recipeId } = req.params;
    const recipe = await recipesServices.getRecipeById(recipeId);
    res.status(200).json(recipe);
};

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
    const { page = 1, limit = 9 } = req.query;
    const userId = req.user.id;

    const result = await recipesServices.getOwnRecipes(userId, { page, limit });

    res.status(200).json({
        success: true,
        recipes: result.recipes,
        pagination: result.pagination,
    });
};

const deleteOwnRecipe = async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const deletedRecipe = await recipesServices.deleteOwnRecipe(recipeId, userId);

    if (!deletedRecipe) {
        throw HttpError(
            404,
            'Recipe not found. Please check the recipe ID or make sure you own this recipe.'
        );
    }

    res.status(200).json({
        success: true,
        message: 'Recipe deleted successfully. Your recipe has been permanently removed.',
    });
};

const addToFavorites = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;

    await recipesServices.addToFavorites(userId, recipeId);

    res.status(201).json({
        success: true,
        message: 'Recipe added to favorites successfully. You can find it in your favorites list.',
    });
};

export const createRecipe = async (req, res, next) => {
    const recipeData = req.body;

    
    if (req.file) {
        recipeData.thumb = `/uploads/recipes/${req.file.filename}`; // збереження URL
    }
    if (typeof recipeData.ingredients === 'string') {
        recipeData.ingredients = JSON.parse(recipeData.ingredients);
    }
    const newRecipe = await recipesServices.createRecipe(req.user, recipeData);
    res.status(201).json({
        message: 'Recipe created successfully',
        recipe: newRecipe,
    });
};

export const getUserRecipes = async (req, res, next) => {
    const { userId } = req.params;
    const { page = 1, limit = 9 } = req.query;
    const result = await recipesServices.getOwnRecipes(userId, { page, limit });
    res.json(result);
};

const getPopularRecipes = async (req, res, next) => {
    const { limit = 4 } = req.query;

    const popularRecipes = await recipesServices.getPopularRecipes({ limit });

    res.status(200).json({ popularRecipes });
};

export default {
    getAllRecipes: ctrlWrapper(getAllRecipes),
    getRecipeById: ctrlWrapper(getRecipeById),
    getFavoriteRecipes: ctrlWrapper(getFavoriteRecipes),
    removeFavoriteRecipe: ctrlWrapper(removeFavoriteRecipe),
    getOwnRecipes: ctrlWrapper(getOwnRecipes),
    deleteOwnRecipe: ctrlWrapper(deleteOwnRecipe),
    addToFavorites: ctrlWrapper(addToFavorites),
    createRecipe: ctrlWrapper(createRecipe),
    getPopularRecipes: ctrlWrapper(getPopularRecipes),
    getUserRecipes: ctrlWrapper(getUserRecipes),
};
