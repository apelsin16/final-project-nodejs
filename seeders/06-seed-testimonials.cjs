'use strict';

const testimonials = require('../db/source/testimonials.json');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            'SELECT id FROM users',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const testimonialsData = testimonials.map((testimonial, i) => {
            return (
                {
                    id: uuidv4(),
                    testimonial: testimonial.testimonial,
                    owner: users[i].id,
                }
            )
        });

        await queryInterface.bulkInsert('testimonials', testimonialsData, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('testimonials', null, {});
    }
};