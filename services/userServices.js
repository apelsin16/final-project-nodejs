import gravatar from 'gravatar';
import User from '../db/models/User.js';
import Follow from '../db/models/Follow.js';
import Recipe from '../db/models/Recipe.js';
import Favorite from '../db/models/Favorite.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../helpers/createToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(
      409,
      'Email already exists. Please use a different email address.'
    );
  }

  const avatarURL = gravatar.url(email);
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarURL,
  });

  const token = createToken(newUser.id);

  await User.update({ token }, { where: { id: newUser.id } });

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(
      401,
      'Invalid email or password provided. Please check your credentials and try again.'
    );
  }

  const token = createToken(user.id);

  await User.update({ token }, { where: { id: user.id } });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
  };
};

export const logoutUser = async user => {
  if (!user) {
    throw HttpError(
      401,
      'Authentication required. Please log in and try again.'
    );
  }
  user.token = null;
  await user.save();
};

export const getFollowingByUserId = async (userId, page = 1, limit = 9) => {
  const offset = (page - 1) * limit;

  const followingLinks = await Follow.findAll({
    where: { followerId: userId },
    attributes: ['followingId'],
  });

  const followingIds = followingLinks.map(link => link.followingId);

  const totalFollowing = followingIds.length;

  const following = await User.findAll({
    where: { id: followingIds },
    attributes: ['id', 'name', 'avatarURL'],
    limit,
    offset,
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
  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(totalFollowing / limit),
    totalFollowing,
    followersPerPage: limit,
    hasNextPage: offset + limit < totalFollowing,
  };

  return {
    following: result,
    pagination,
  };
};

export const getFollowersByUserId = async (userId, page = 1, limit = 9) => {
  const offset = (page - 1) * limit;

  const followersLinks = await Follow.findAll({
    where: { followingId: userId },
    attributes: ['followerId'],
  });

  const followerIds = followersLinks.map(link => link.followerId);

  const totalFollowers = followerIds.length;

  const followers = await User.findAll({
    where: { id: followerIds },
    attributes: ['id', 'name', 'avatarURL'],
    limit,
    offset,
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

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(totalFollowers / limit),
    totalFollowers,
    followersPerPage: limit,
    hasNextPage: offset + limit < totalFollowers,
  };

  return {
    followers: result,
    pagination,
  };
};

export const modifyUserAvatar = async (id, avatarURL) => {
  const user = await User.findOne({ where: { id } });
  if (!user)
    throw HttpError(
      401,
      'Authentication required. Please log in and try again.'
    );
  await user.update({ avatarURL });
  return {
    user: {
      id,
      name: user.name,
      email: user.email,
      avatarURL,
    },
  };
};

export const getCurrentUserDetailed = async user => {
  // Параллельное выполнение всех запросов
  const [
    ownRecipesCount,
    favoriteRecipesCount,
    followersCount,
    followingCount,
  ] = await Promise.all([
    Recipe.count({ where: { ownerId: user.id } }),
    Favorite.count({ where: { userId: user.id } }),
    Follow.count({ where: { followingId: user.id } }),
    Follow.count({ where: { followerId: user.id } }),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
    stats: {
      ownRecipesCount,
      favoriteRecipesCount,
      followersCount,
      followingCount,
    },
  };
};

export const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw HttpError(
      400,
      'Cannot follow yourself. Please select a different user to follow.'
    );
  }

  let userToFollow;
  try {
    userToFollow = await User.findByPk(followingId);
  } catch (error) {
    throw HttpError(
      404,
      'User not found. Please check the user ID and try again.'
    );
  }

  if (!userToFollow) {
    throw HttpError(
      404,
      'User not found. Please check the user ID and try again.'
    );
  }

  const existingFollow = await Follow.findOne({
    where: { followerId, followingId },
  });
  if (existingFollow) {
    throw HttpError(
      409,
      'Already following this user. You are already subscribed to this profile.'
    );
  }

  await Follow.create({ followerId, followingId });

  return {
    message:
      'Successfully followed user. You are now subscribed to their updates.',
    following: {
      id: userToFollow.id,
      name: userToFollow.name,
      avatarURL: userToFollow.avatarURL,
    },
  };
};

export const unfollowUser = async (followerId, followingId) => {
  let follow;
  try {
    follow = await Follow.findOne({
      where: { followerId, followingId },
    });
  } catch (error) {
    throw HttpError(
      404,
      'Not following this user. You are not subscribed to this profile.'
    );
  }

  if (!follow) {
    throw HttpError(
      404,
      'Not following this user. You are not subscribed to this profile.'
    );
  }

  await follow.destroy();

  return {
    message:
      'Successfully unfollowed user. You are no longer subscribed to their updates.',
  };
};

export const getUserById = async userId => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw HttpError(
      404,
      'User not found. Please check the user ID and try again.'
    );
  }

  const [ownRecipesCount, followersCount] = await Promise.all([
    Recipe.count({ where: { ownerId: user.id } }),
    Follow.count({ where: { followingId: user.id } }),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    },
    stats: {
      ownRecipesCount,
      followersCount,
    },
  };
};

export const getOtherFollowersByUserId = async (
  userId,
  page = 1,
  limit = 9
) => {
  const offset = (page - 1) * limit;

  const followersLinks = await Follow.findAll({
    where: { followingId: userId },
    attributes: ['followerId'],
  });

  const followerIds = followersLinks.map(link => link.followerId);
  const totalFollowers = followerIds.length;

  const followers = await User.findAll({
    where: { id: followerIds },
    attributes: ['id', 'name', 'avatarURL'],
    limit,
    offset,
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

  const pagination = {
    currentPage: page,
    totalPages: Math.ceil(totalFollowers / limit),
    totalFollowers,
    followersPerPage: limit,
    hasNextPage: offset + limit < totalFollowers,
  };

  return {
    followers: result,
    pagination,
  };
};
