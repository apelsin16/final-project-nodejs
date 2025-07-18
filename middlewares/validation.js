import HttpError from '../helpers/HttpError.js';

export const validateBody = schema => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body);
            if (error) {
                throw HttpError(400, error.message);
            }
            req.body = value;
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const validateParams = schema => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.params);
            if (error) {
                throw HttpError(400, error.message);
            }
            req.params = value;
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const validateQuery = schema => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.query);
            if (error) {
                throw HttpError(400, error.message);
            }
            req.query = value;
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const handleMulterError = (err, req, res, next) => {
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(HttpError(400, 'File too large. Please upload an image smaller than 5MB.'));
        }
        if (err.message.includes('Invalid file type')) {
            return next(HttpError(400, err.message));
        }
        return next(HttpError(400, 'File upload error. Please try again with a valid image file.'));
    }
    next();
};
