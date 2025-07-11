import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Foodies API',
            version: '1.0.0',
            description: 'API для додатка Foodies - платформа для рецептів та кулінарії',
            license: {
                name: 'Apache 2.0',
                url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js', './controllers/*.js'], // Указываем где искать JSDoc комментарии
};

export const swaggerDocs = () => {
    try {
        const specs = swaggerJSDoc(swaggerOptions);
        return [...swaggerUI.serve, swaggerUI.setup(specs)];
    } catch (err) {
        console.error('Swagger setup error:', err);
        return (req, res, next) => next(createHttpError(500, "Can't load swagger docs"));
    }
};
