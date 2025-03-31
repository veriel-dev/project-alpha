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

export class AuthMiddleware {
  public authenticate = (req: Request, res: Response, next: NextFunction): void => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
      res.status(401).json({ error: 'No token provided, authorization denied' });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
  public authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Check if user exists and has a role
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  }
}