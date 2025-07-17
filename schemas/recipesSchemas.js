import Joi from 'joi';
import { UUID_REGEX } from '../constants/index.js';

export const getFavoritesQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(9),
});

export const getPopularRecipesQuerySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(4).messages({
        'number.base': 'Limit must be a number. Please provide a valid number.',
        'number.integer': 'Limit must be an integer. Please provide a whole number.',
        'number.min': 'Limit must be at least 1. Please provide a value greater than 0.',
        'number.max': 'Limit cannot exceed 100. Please provide a smaller value.',
    }),
});

export const recipeIdParamsSchema = Joi.object({
    recipeId: Joi.string().pattern(UUID_REGEX).required().messages({
        'string.pattern.base': 'Invalid recipe ID format. Please provide a valid UUID.',
        'any.required': 'Recipe ID is required',
    }),
});

export const idParamsSchema = Joi.object({
    id: Joi.string().pattern(UUID_REGEX).required().messages({
        'string.pattern.base': 'Invalid recipe ID format. Please provide a valid UUID.',
        'any.required': 'Recipe ID is required',
    }),
});

export const categoryIdParamsSchema = Joi.object({
    categoryId: Joi.string().pattern(UUID_REGEX).required().messages({
        'string.pattern.base': 'Invalid category ID format. Please provide a valid UUID.',
        'any.required': 'Category ID is required',
    }),
});

export const userIdParamsSchema = Joi.object({
    userId: Joi.string().required(),
});

export const createRecipeSchema = Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title must be at least 1 character long',
        'string.max': 'Title cannot exceed 255 characters',
        'any.required': 'Title is required',
    }),
    description: Joi.string().min(1).max(1000).required().messages({
        'string.empty': 'Description cannot be empty',
        'string.min': 'Description must be at least 1 character long',
        'string.max': 'Description cannot exceed 1000 characters',
        'any.required': 'Description is required',
    }),
    instructions: Joi.string().min(1).max(5000).required().messages({
        'string.empty': 'Instructions cannot be empty',
        'string.min': 'Instructions must be at least 1 character long',
        'string.max': 'Instructions cannot exceed 5000 characters',
        'any.required': 'Instructions is required',
    }),
    time: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'Time cannot be empty',
        'string.min': 'Time must be at least 1 character long',
        'string.max': 'Time cannot exceed 100 characters',
        'any.required': 'Time is required',
    }),
    thumb: Joi.string().uri().optional().messages({
        'string.uri': 'Thumb must be a valid URL',
    }),
    categoryId: Joi.string().pattern(UUID_REGEX).required().messages({
        'string.pattern.base': 'Invalid category ID format',
        'any.required': 'Category ID is required',
    }),
    areaId: Joi.string().pattern(UUID_REGEX).optional().messages({
        'string.pattern.base': 'Invalid area ID format',
    }),
    ingredients: Joi.array()
        .items(
            Joi.object({
                ingredientId: Joi.string().pattern(UUID_REGEX).required().messages({
                    'string.pattern.base': 'Invalid ingredient ID format',
                    'any.required': 'Ingredient ID is required',
                }),
                measure: Joi.string().min(1).max(100).required().messages({
                    'string.empty': 'Measure cannot be empty',
                    'string.min': 'Measure must be at least 1 character long',
                    'string.max': 'Measure cannot exceed 100 characters',
                    'any.required': 'Measure is required',
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one ingredient is required. Please add ingredients to your recipe.',
            'any.required': 'Ingredients are required. Please add at least one ingredient.',
        }),
});
