import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

import { AuthMiddleware } from '../middleware/auth';
import { config } from '../config';

const router: Router = express.Router();
const authMiddleware = new AuthMiddleware();

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: 'editor'  // Default role for new users
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config!.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
}
const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Ensure lastLogin field exists on user
    if ('lastLogin' in user) {
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
}
const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving profile' });
  }
}
const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
}

const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
}
// Registro de usuario
router.post('/register', registerUser);
// Inicio de sesión
router.post('/login', loginUser);

// Ruta protegida - Obtener perfil de usuario
router.get('/profile', authMiddleware.authenticate, getUserProfile);
// Actualizar perfil de usuario
router.put('/profile', authMiddleware.authenticate, updateProfile);

// Cambiar contraseña
router.put('/change-password', authMiddleware.authenticate, changePassword);

export default router;