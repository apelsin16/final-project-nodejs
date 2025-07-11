'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn('recipes', 'ingredients');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('recipes', 'ingredients', {
    type: Sequelize.TEXT,
    allowNull: true,
  });
}
