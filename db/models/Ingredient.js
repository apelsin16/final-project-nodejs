import sequelize from '../sequelize.js';
import { DataTypes } from 'sequelize';


const Ingredient = sequelize.define(
    'Ingredient',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: 'ingredients',
    }
);

export default Ingredient;
