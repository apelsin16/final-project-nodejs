import Joi from 'joi';

export const getFavoritesQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(9),
});

export const recipeIdParamsSchema = Joi.object({
    recipeId: Joi.string()
        .pattern(/^[a-fA-F0-9]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid recipe ID format',
            'any.required': 'Recipe ID is required',
        }),
});
