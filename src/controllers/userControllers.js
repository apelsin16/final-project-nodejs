import { createUser, loginUser } from '../services/userServices.js';
import { loginSchema } from '../schemas/authSchemas.js';
import HttpError from '../helpers/HttpError.js';

export const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const data = await loginUser(req.body);

    res.status(200).json(data);
  } catch (error) {
    console.error('Controller error:', error);
    next(error);
  }
};