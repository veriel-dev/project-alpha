import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    
    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      name,
      role: 'editor'  // Por defecto, los nuevos usuarios son editores
    });
    
    await user.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwtSecret,
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
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    
    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    
    // Actualizar último inicio de sesión
    user.lastLogin = new Date();
    await user.save();
    
    // Generar token JWT
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
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta protegida - Obtener perfil de usuario
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

// Actualizar perfil de usuario
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar campos
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
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});

// Cambiar contraseña
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña actual incorrecta' });
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

export const userRouter = router;