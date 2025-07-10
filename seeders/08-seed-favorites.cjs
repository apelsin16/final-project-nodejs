'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        // Get all users and recipes from the database
        const users = await queryInterface.sequelize.query(
            'SELECT id FROM users',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const recipes = await queryInterface.sequelize.query(
            'SELECT id FROM recipes',
            { type: Sequelize.QueryTypes.SELECT }
        );

        if (!users.length || !recipes.length) {
            console.warn('⚠️ No users or recipes found. Please seed users and recipes first.');
            return;
        }

        const favorites = [];
        const numberOfFavorites = Math.min(50, users.length * recipes.length); // Limit to 50 favorites

        // Create some sample favorites
        for (let i = 0; i < numberOfFavorites; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

            // Check if this combination already exists to avoid duplicates
            const existingFavorite = favorites.find(
                fav => fav.userId === randomUser.id && fav.recipeId === randomRecipe.id
            );

            if (!existingFavorite) {
                favorites.push({
                    id: uuidv4(),
                    userId: randomUser.id,
                    recipeId: randomRecipe.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }

        if (!favorites.length) {
            console.warn('⚠️ No favorites to insert');
            return;
        }

        await queryInterface.bulkInsert('favorites', favorites);
        console.log(`✅ Inserted ${favorites.length} favorites`);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('favorites', null, {});
        console.log('🗑️ Deleted all favorites');
    }
}; 