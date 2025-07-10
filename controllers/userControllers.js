import { rename } from 'node:fs/promises';
import { resolve, join } from 'node:path';

import {
  createUser,
  loginUser,
  modifyUserAvatar,
  getFollowersByUserId,
  getFollowingByUserId,
} from '../services/userServices.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';

const avatarsDir = resolve('public', 'avatars');

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

export default {
  getFollowersController: ctrlWrapper(getFollowersController),
  registerUser: ctrlWrapper(registerUser),
  login: ctrlWrapper(login),
  updateUserAvatarController: ctrlWrapper(updateUserAvatarController),
  getFollowingController: ctrlWrapper(getFollowingController),
};
