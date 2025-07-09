import express from "express";
import auth from "../middlewares/auth.js";
import recipesController from "../controllers/recipesController.js";
import ctrlWrapper from "../helpers/controllerWrapper.js";

const router = express.Router();

// Отримати власні рецепти
router.get("/own", auth, ctrlWrapper(recipesController.getOwnRecipes));

// Видалити власний рецепт
router.delete("/:id", auth, ctrlWrapper(recipesController.deleteOwnRecipe));

// Додати рецепт до списку улюблених
router.post(
  "/:id/favorite",
  auth,
  ctrlWrapper(recipesController.addToFavorites)
);

export default router;
