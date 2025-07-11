'use strict';

const users = require('../db/source/users.json');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async up(queryInterface) {

        const usersData = [];
        for (let user of users) {
            const passHash = await bcrypt.hash(user.password || "password", 10);

            usersData.push(
                {
                    id: uuidv4(),
                    name: user.name,
                    email: user.email,
                    password: passHash,
                    avatarURL: user.avatar,
                    token: user.token || null,

                }

            )
        };
        await queryInterface.bulkInsert('users', usersData, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
