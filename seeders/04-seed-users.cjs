'use strict';

const users = require('../db/source/users.json');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface) {
        const usersData = users.map(user => ({
            id: uuidv4(),
            name: user.name,
            email: user.email,
            password: user.password || "password",
            avatarURL: user.avatar,
            token: user.token || null,
        }));

        await queryInterface.bulkInsert('users', usersData, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
