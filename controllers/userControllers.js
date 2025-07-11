import { createUser, loginUser } from '../services/userServices.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';
import { getFollowingByUserId, getFollowersByUserId, modifyUserAvatar, logoutUser, unfollowUser } from '../services/userServices.js';

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
  const following = await getFollowingByUserId(userId);
  res.json(following);
};

const getFollowersController = async (req, res) => {
  const userId = req.user.id;
  const followers = await getFollowersByUserId(userId);
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
  const result = await modifyUserAvatar(req.user.id, avatar);
  res.json(result);
};

export const logout = ctrlWrapper(async (req, res) => {
  await logoutUser(req.user);
  res.status(204).send();
});

const getCurrent = async (req, res) => {
    res.status(200).json({ ...req.user.dataValues });
};

export const unfollowUserController = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;
    const result = await unfollowUser(followerId, followingId);
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
  unfollowUserController: ctrlWrapper(unfollowUserController),
};
