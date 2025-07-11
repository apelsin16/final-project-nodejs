import Joi from 'joi';

export const searchRecipesQuerySchema = Joi.object({
    category: Joi.string().min(1).max(50).optional().messages({
        'string.min': 'Category must be at least 1 character long. Please provide a valid category name.',
        'string.max': 'Category cannot exceed 50 characters. Please use a shorter category name.',
    }),
    area: Joi.string().min(1).max(50).optional().messages({
        'string.min': 'Area must be at least 1 character long. Please provide a valid area name.',
        'string.max': 'Area cannot exceed 50 characters. Please use a shorter area name.',
    }),
    ingredient: Joi.string().min(1).max(50).optional().messages({
        'string.min': 'Ingredient must be at least 1 character long. Please provide a valid ingredient name.',
        'string.max': 'Ingredient cannot exceed 50 characters. Please use a shorter ingredient name.',
    }),
    page: Joi.number().integer().min(1).default(1).messages({
        'number.min': 'Page number must be at least 1. Please provide a valid page number.',
        'number.integer': 'Page must be a whole number. Please provide a valid page number.',
    }),
    limit: Joi.number().integer().min(1).max(50).default(6).messages({
        'number.min': 'Limit must be at least 1. Please provide a valid limit value.',
        'number.max': 'Limit cannot exceed 50. Please use a smaller limit value.',
        'number.integer': 'Limit must be a whole number. Please provide a valid limit value.',
    }),
})
    .min(1)
    .messages({
        'object.min':
            'At least one search parameter is required. Please provide category, area, or ingredient.',
    });
