import {
  createUser,
  getFollowingByUserId,
  loginUser,
} from '../services/userServices.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';

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

export default {
  registerUser: ctrlWrapper(registerUser),
  login: ctrlWrapper(login),
  getFollowingController: ctrlWrapper(getFollowingController),
};
