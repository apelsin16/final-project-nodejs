import * as recipesServices from '../services/recipesServices.js';

export const getRecipeById = async (req, res, next) => {
    try {
        const { recipeId } = req.params;

        const recipe = await recipesServices.getRecipeById(recipeId);

        res.status(200).json({
            success: true,
            data: recipe,
        });
    } catch (error) {
        next(error);
    }
};

export const getFavoriteRecipes = async (req, res, next) => {
    try {
        const { page = 1, limit = 9 } = req.query;

        const result = await recipesServices.getFavoriteRecipes(req.user, { page, limit });

        res.status(200).json({
            favorites: result.recipes,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

export const removeFavoriteRecipe = async (req, res, next) => {
    try {
        const { recipeId } = req.params;

        const result = await recipesServices.removeFavoriteRecipe(req.user, recipeId);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
