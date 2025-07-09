import { createUser } from '../services/userServices.js';

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