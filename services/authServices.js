import bcrypt from 'bcryptjs';
import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import sendVerificationEmail from '../helpers/sendVerificationEmail.js';
import { v4 as uuidv4 } from 'uuid';

const { JWT_SECRET, BASE_URL } = process.env;

export const registerUser = async ({ email, password }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw HttpError(409, 'Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const avatarURL = gravatar.url(email, { s: '200', d: 'retro' }, true);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        verificationToken,
        avatarURL,
    });

    await sendVerificationEmail(email, verificationToken);

    return {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw HttpError(401, 'Email or password is wrong');
    }

    if (!user.verify) {
        throw HttpError(401, 'Email not verified');
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

export const getCurrentUser = async user => {
    if (!user) {
        throw HttpError(401, 'Not authorized');
    }
    return {
        email: user.email,
        avatarURL: user.avatarURL,
        subscription: user.subscription,
    };
};

export const updateUserAvatar = async (user, file) => {
    const { path: tempPath, filename } = file;
    const avatarsDir = path.resolve('public/avatars');
    const finalPath = path.join(avatarsDir, filename);
    const avatarURL = `/avatars/${filename}`;

    await fs.rename(tempPath, finalPath);

    user.avatarURL = avatarURL;
    await user.save();

    return avatarURL;
};

export const verifyUserByToken = async verificationToken => {
    const user = await User.findOne({ where: { verificationToken } });

    if (!user) {
        return null;
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return {
        email: user.email,
        subscription: user.subscription,
    };
};

export const resendEmail = async email => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw HttpError(404, 'User not found');
    }

    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    await sendVerificationEmail(email, user.verificationToken);
};
