import jwt from 'jsonwebtoken';
import User from '../db/models/User.js';
import Follow from '../db/models/Follow.js';
import Recipe from '../db/models/Recipe.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcryptjs';

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

export const getFollowingByUserId = async userId => {
  const followingLinks = await Follow.findAll({
    where: { followerId: userId },
    attributes: ['followingId'],
  });

  const followingIds = followingLinks.map(link => link.followingId);

  const following = await User.findAll({
    where: { id: followingIds },
    attributes: ['id', 'name', 'avatarURL'],
  });

  const result = await Promise.all(
    following.map(async user => {
      const recipes = await Recipe.findAll({
        where: { ownerId: user.id },
        attributes: ['id', 'title', 'thumb'],
        limit: 4,
        order: [['createdAt', 'DESC']],
      });

      const totalRecipes = await Recipe.count({
        where: { ownerId: user.id },
      });

      return {
        ...user.toJSON(),
        recipes,
        totalRecipes,
      };
    })
  );

  return result;
};
