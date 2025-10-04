import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: error.message || 'Invalid or expired token',
    });
  }
};
