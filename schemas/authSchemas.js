import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const resendSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'missing required field email',
        'string.email': 'Invalid email format',
    }),
});

export const userIdSchema = Joi.object({
    userId: Joi.string().min(1).required().messages({
        'string.min': 'User ID cannot be empty.',
        'any.required': 'User ID is required.',
    }),
});

export const avatarFileSchema = {
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error('Invalid file type. Please upload only JPEG, PNG, or GIF images.');
            error.code = 'INVALID_FILE_TYPE';
            cb(error, false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB максимум
    },
};
