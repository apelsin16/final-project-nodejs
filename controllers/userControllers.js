import { createUser, loginUser } from '../services/userServices.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';
import * as userServices from '../services/userServices.js';
import { User, Recipe, Favorite, Follow } from '../db/models/index.js';


export const registerUser = async (req, res) => {
    const user = await createUser(req.body);
    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarURL: user.avatarURL,
    });
};

const login = async (req, res, next) => {
    const data = await loginUser(req.body);
    res.status(200).json(data);
};

const getFollowingController = async (req, res) => {
  const userId = req.user.id;
  const following = await userServices.getFollowingByUserId(userId);
  res.json(following);
};

const getFollowersController = async (req, res) => {
  const userId = req.user.id;
  const followers = await userServices.getFollowersByUserId(userId);
  res.json(followers);
};

const updateUserAvatarController = async (req, res) => {
  let avatar = null;
  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = join(avatarsDir, filename);
    await rename(oldPath, newPath);
    avatar = join('avatars', filename);
  }
  const result = await userServices.modifyUserAvatar(req.user.id, avatar);
  res.json(result);
};

export const logout = ctrlWrapper(async (req, res) => {
  await userServices.logoutUser(req.user);
  res.status(204).send();
});

const getCurrent = async (req, res) => {
    res.status(200).json({ ...req.user.dataValues });
};

export const followUserController = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;
    const result = await userServices.followUser(followerId, followingId);
    res.status(201).json(result);
export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;
    const isSelf = id === currentUserId;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'avatarURL'],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipesCount = await Recipe.count({ where: { ownerId: id } });
    const followersCount = await Follow.count({ where: { followingId: id } });

    let result = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      recipesCount,
      followersCount,
    };

    if (isSelf) {      
      const favoritesCount = await Favorite.count({ where: { userId: id } });
      const followingCount = await Follow.count({ where: { followerId: id } });
      result = {
        ...result,
        favoritesCount,
        followingCount,
      };
    }

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};

export default {
  getFollowersController: ctrlWrapper(getFollowersController),
  registerUser: ctrlWrapper(registerUser),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  updateUserAvatarController: ctrlWrapper(updateUserAvatarController),
  getFollowingController: ctrlWrapper(getFollowingController),
  getCurrent: ctrlWrapper(getCurrent),
  followUserController: ctrlWrapper(followUserController),
  getUserDetails: ctrlWrapper(getUserDetails),

};
