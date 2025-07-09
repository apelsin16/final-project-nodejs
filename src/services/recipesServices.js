import { User, Recipe, Category, Area, Ingredient } from '../../db/models/index.js';

export const getFavoriteRecipes = async (user, { page = 1, limit = 9 }) => {
    const offset = (page - 1) * limit;
    const totalCount = await user.countFavorites();

    // Получаем рецепты с пагинацией
    const userWithRecipes = await User.findByPk(user.id, {
        include: [
            {
                model: Recipe,
                as: 'favorites',
                limit: parseInt(limit),
                offset: parseInt(offset),
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
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'name', 'email'],
                    },
                    {
                        model: Ingredient,
                        as: 'ingredients',
                        attributes: ['id', 'name', 'desc'],
                        through: { attributes: ['measure'] },
                    },
                ],
            },
        ],
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
        recipes: userWithRecipes.favorites || [],
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
