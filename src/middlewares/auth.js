import jwt from 'jsonwebtoken';
import User from '../../db/models/User.js';
import HttpError from '../helpers/HttpError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const auth = async (req, res, next) => {
    try {
        const { authorization = '' } = req.headers;
        const [bearer, token] = authorization.split(' ');

        if (bearer !== 'Bearer' || !token) {
            throw HttpError(401, 'Not authorized');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw HttpError(401, 'Not authorized');
        }
        const user = await User.findByPk(decoded.id);
        if (!user || user.token !== token) {
            throw HttpError(401, 'Not authorized');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
