import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtener token del header
  const token = req.header('x-auth-token');
  
  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ error: 'No hay token, autorización denegada' });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
};