import bcrypt from 'bcryptjs';
import User from '../../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    await User.update({ token }, { where: { id: user.id } });

    return {
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    };
};