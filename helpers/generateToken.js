import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'super-secret-key';

const generateToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: '7d' });
};

export default generateToken;