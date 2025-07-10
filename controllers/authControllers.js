import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserAvatar,
    verifyUserByToken,
    resendEmail,
} from '../services/authServices.js';
import ctrlWrapper from '../helpers/controllerWrapper.js';

export const register = ctrlWrapper(async (req, res) => {
    const result = await registerUser(req.body);
    res.status(201).json(result);
});

export const login = ctrlWrapper(async (req, res) => {
    const result = await loginUser(req.body);
    res.json(result);
});

export const logout = ctrlWrapper(async (req, res) => {
    await logoutUser(req.user);
    res.status(204).send();
});

export const getCurrent = ctrlWrapper(async (req, res) => {
    const result = await getCurrentUser(req.user);
    res.json(result);
});

export const updateAvatar = ctrlWrapper(async (req, res) => {
    const avatarURL = await updateUserAvatar(req.user, req.file);
    res.json({ avatarURL });
});

export const verifyEmail = ctrlWrapper(async (req, res) => {
    const { verificationToken } = req.params;
    const result = await verifyUserByToken(verificationToken);
    
    if (!result) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Verification successful' });
});

export const resendVerificationEmail = ctrlWrapper(async (req, res) => {
    const { email } = req.body;
    await resendEmail(email);
    res.json({ message: 'Verification email sent' });
}); 