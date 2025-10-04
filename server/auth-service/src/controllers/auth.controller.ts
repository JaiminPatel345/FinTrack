import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  country: z.string().min(2, 'Country is required'),
  currency: z.string().length(3, 'Invalid currency code'),
  companyName: z.string().optional(),
});

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      const result = await authService.signup(validatedData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Account created successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  },

  signin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = signinSchema.parse(req.body);
      const result = await authService.signin(validatedData);
      
      res.status(200).json({
        success: true,
        data: result,
        message: 'Signed in successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  },

  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = forgotPasswordSchema.parse(req.body);
      await authService.forgotPassword(validatedData.email);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(validatedData.token, validatedData.password);
      
      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  },

  verifyToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
        });
      }

      const payload = await authService.verifyToken(token);
      
      res.status(200).json({
        success: true,
        data: payload,
      });
    } catch (error) {
      next(error);
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = changePasswordSchema.parse(req.body);
      
      // Get userId from authenticated user (from JWT middleware)
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      await authService.changePassword(userId, validatedData.currentPassword, validatedData.newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  },
};
