import {
    createUser,
    loginUser,
    getFollowingByUserId,
    getFollowersByUserId,
    modifyUserAvatar,
    logoutUser,
    getCurrentUserDetailed,
    getUserById,
    followUser,
    unfollowUser,
} from '../services/userServices.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';
import HttpError from '../helpers/HttpError.js';
import { join } from 'path';
import { rename } from 'fs/promises';

const avatarsDir = join(process.cwd(), 'public', 'avatars');

export const registerUser = async (req, res) => {
    const result = await createUser(req.body);
    res.status(201).json(result);
};

const login = async (req, res, next) => {
    const data = await loginUser(req.body);

    res.status(200).json(data);
};

const getFollowingController = async (req, res) => {
    const userId = req.user.id;

    const following = await getFollowingByUserId(userId);

    res.json({ following });
};

const getFollowersController = async (req, res) => {
    const userId = req.user.id;

    const followers = await getFollowersByUserId(userId);

    res.json({ followers });
};

export const getFollowersByUserIdController = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await getFollowersByUserId(userId, { page, limit });
    res.json(result);
};

const updateUserAvatarController = async (req, res) => {
    if (!req.file) {
        throw HttpError(400, 'No file provided. Please upload an image file and try again.');
    }

    const { path: oldPath, filename } = req.file;
    const newPath = join(avatarsDir, filename);
    await rename(oldPath, newPath);

    const avatarURL = `/avatars/${filename}`;

    const result = await modifyUserAvatar(req.user.id, avatarURL);
    res.json(result);
};

export const logout = ctrlWrapper(async (req, res) => {
    await logoutUser(req.user);
    res.status(204).send();
});

const getCurrent = async (req, res) => {
    res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatarURL: req.user.avatarURL,
    });
};

const getCurrentDetailed = async (req, res) => {
    const result = await getCurrentUserDetailed(req.user);
    res.status(200).json(result);
};

const getUserByIdController = async (req, res) => {
    const { userId } = req.params;
    const requesterId = req.user.id;

    if (userId === requesterId) {
        const result = await getCurrentUserDetailed(req.user);
        res.status(200).json({ ...result, requestedBy: requesterId });
    } else {
        const result = await getUserById(userId);
        res.status(200).json({ ...result, requestedBy: requesterId });
    }
};

const followUserController = async (req, res) => {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    const result = await followUser(followerId, followingId);
    res.status(201).json(result);
};

const unfollowUserController = async (req, res) => {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    const result = await unfollowUser(followerId, followingId);
    res.status(200).json(result);
};

export default {
    getFollowersController: ctrlWrapper(getFollowersController),
    registerUser: ctrlWrapper(registerUser),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    updateUserAvatarController: ctrlWrapper(updateUserAvatarController),
    getFollowingController: ctrlWrapper(getFollowingController),
    getCurrent: ctrlWrapper(getCurrent),
    getCurrentDetailed: ctrlWrapper(getCurrentDetailed),
    getUserByIdController: ctrlWrapper(getUserByIdController),
    followUserController: ctrlWrapper(followUserController),
    unfollowUserController: ctrlWrapper(unfollowUserController),
    getFollowersByUserIdController: ctrlWrapper(getFollowersByUserIdController),
};
