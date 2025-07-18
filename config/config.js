import dotenv from 'dotenv';
dotenv.config();

const common = {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'foodies',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions:
        process.env.DB_SSL === 'true'
            ? {
                  ssl: {
                      require: true,
                      rejectUnauthorized: false,
                  },
              }
            : {},
};



console.log("🔍 DB_USER from .env:", process.env.DB_USER);


export default {
    development: { ...common },
    test: { ...common },
    production: { ...common },
};
