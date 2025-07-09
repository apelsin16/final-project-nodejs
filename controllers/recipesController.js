import { Recipe, User } from "../models/index.js";

const getOwnRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const recipes = await Recipe.findAll({
      where: { ownerId: userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};

const deleteOwnRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const recipe = await Recipe.findOne({
      where: { id: recipeId, ownerId: userId },
    });

    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or access denied" });
    }

    await recipe.destroy();

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeId = req.params.id;

    // Перевірка існування рецепта
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Знаходимо користувача
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Перевірка, чи вже в улюблених
    const favorites = await user.getFavoriteRecipes({
      where: { id: recipeId },
    });
    if (favorites.length > 0) {
      return res.status(400).json({ message: "Recipe already in favorites" });
    }

    await user.addFavoriteRecipe(recipe);

    res.status(201).json({ message: "Recipe added to favorites" });
  } catch (error) {
    next(error);
  }
};

export default {
  getOwnRecipes,
  deleteOwnRecipe,
  addToFavorites,
};
