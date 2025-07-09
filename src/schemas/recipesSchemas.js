import Joi from 'joi';
import { UUID_REGEX } from '../constants/index.js';

export const getFavoritesQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(9),
});

export const recipeIdParamsSchema = Joi.object({
    recipeId: Joi.string().pattern(UUID_REGEX).required().messages({
        'string.pattern.base': 'Invalid recipe ID format',
        'any.required': 'Recipe ID is required',
    }),
});
