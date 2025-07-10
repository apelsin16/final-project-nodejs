import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

export default sequelize;
