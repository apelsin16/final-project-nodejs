// import { DataTypes } from 'sequelize';
// import sequelize from '../../db/sequelize.js';
// import { User } from './User.js'; // важливо: імпортуй User, якщо хочеш асоціацію

// export const Contact = sequelize.define('contact', {
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     phone: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     favorite: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
//     owner: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'users', // назва таблиці
//             key: 'id',
//         },
//         onDelete: 'CASCADE',
//     },
// });
