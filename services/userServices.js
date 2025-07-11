import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import User from '../db/models/User.js';
import Follow from '../db/models/Follow.js';
import Recipe from '../db/models/Recipe.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const createUser = async ({ name, email, password }) => {
  const avatarURL = gravatar.url(email);
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarURL,
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

export const logoutUser = async user => {
  if (!user) {
    throw HttpError(401, 'Not authorized');
  }
  user.token = null;
  await user.save();
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

export const getFollowersByUserId = async userId => {
  const followersLinks = await Follow.findAll({
    where: { followingId: userId },
    attributes: ['followerId'],
  });

  const followerIds = followersLinks.map(link => link.followerId);

  const followers = await User.findAll({
    where: { id: followerIds },
    attributes: ['id', 'name', 'avatarURL'],
  });

  const result = await Promise.all(
    followers.map(async follower => {
      const recipes = await Recipe.findAll({
        where: { ownerId: follower.id },
        attributes: ['id', 'title', 'thumb'],
        limit: 4,
        order: [['createdAt', 'DESC']],
      });

      const totalRecipes = await Recipe.count({
        where: { ownerId: follower.id },
      });

      return {
        ...follower.toJSON(),
        recipes,
        totalRecipes,
      };
    })
  );

  return result;
};

export const modifyUserAvatar = async (id, avatarURL) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw HttpError(401, 'Not authorized');
  await user.update({ ...user, avatarURL });
  return { avatarURL };
};
