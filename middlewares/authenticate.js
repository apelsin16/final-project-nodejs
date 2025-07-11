import jwt from 'jsonwebtoken';
import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const authenticate = async (req, res, next) => {
    try {
        const { authorization = '' } = req.headers;
        const [bearer, token] = authorization.split(' ');

        if (bearer !== 'Bearer' || !token) {
            throw HttpError(401, 'You need to log in first. Please sign in to access this feature.');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw HttpError(401, 'Your session has expired. Please log in again to continue.');
        }
        const user = await User.findByPk(decoded.id);
        if (!user || user.token !== token) {
            throw HttpError(401, 'Your login session is no longer valid. Please sign in again.');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
