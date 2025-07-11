import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const createToken = id => {
    const payload = { id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    return token;
};
