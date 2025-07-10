import HttpError from "../helpers/HttpError.js";
import {registerSchema, loginSchema, resendSchema} from "../schemas/authSchemas.js";
import * as authServices from "../services/authServices.js";

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const user = await authServices.registerUser(req.body);

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const data = await authServices.loginUser(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authServices.logoutUser(req.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const currentUser = await authServices.getCurrentUser(req.user);
    res.status(200).json(currentUser);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "File is required");
    }

    const avatarURL = await authServices.updateUserAvatar(req.user, req.file);

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await authServices.verifyUserByToken(verificationToken);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { error } = resendSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email } = req.body;
    await authServices.resendEmail(email);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};