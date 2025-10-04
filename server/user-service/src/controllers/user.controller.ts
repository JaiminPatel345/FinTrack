import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { JwtPayload, UserRole } from '../types/auth.types';

// Extend Request interface
interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

const userService = new UserService();

export class UserController {
  // GET /api/users - Get all users (Admin only)
  async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId, role } = req.user;

      // Only admin can view all users
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const users = await userService.getAllUsers(companyId);
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/users/:id - Get user by ID
  async getUserById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { companyId } = req.user;
      
      const user = await userService.getUserById(userId, companyId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/users - Create user (Admin only)
  async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { companyId, role } = req.user;

      // Only admin can create users
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const { name, email, role: userRole } = req.body;

      if (!name || !email || !userRole) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, email, and role are required' 
        });
      }

      const result = await userService.createUser(
        { name, email, role: userRole },
        companyId
      );
      
      res.status(201).json({ 
        success: true, 
        data: result.user,
        tempPassword: result.tempPassword,
        message: 'User created successfully. Temporary password provided.' 
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // PUT /api/users/:id - Update user
  async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { companyId, userId: requestUserId, role: requestUserRole } = req.user;

      // Users can only update their own profile unless they're admin
      if (userId !== requestUserId && requestUserRole !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const user = await userService.updateUser(userId, companyId, req.body);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/users/:id - Deactivate user (Admin only)
  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { companyId, role } = req.user;

      // Only admins can delete users
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      await userService.deleteUser(userId, companyId);
      res.json({ success: true, message: 'User deactivated successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // POST /api/users/:id/send-password - Send password setup email (Admin only)
  async sendPasswordSetupEmail(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { companyId, role } = req.user;

      // Only admins can send password setup emails
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const result = await userService.sendPasswordSetupEmail(userId, companyId);
      res.json({ 
        success: true, 
        tempPassword: result.tempPassword,
        message: result.message 
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // GET /api/users/:id/manager - Get user's manager
  async getUserManager(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { companyId } = req.user;
      
      const manager = await userService.getUserManager(userId, companyId);
      res.json({ success: true, data: manager });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/users/:id/manager - Assign manager (Admin only)
  async assignManager(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { managerId } = req.body;
      const { companyId, role } = req.user;

      // Only admin can assign managers
      if (role !== UserRole.ADMIN) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      if (!managerId) {
        return res.status(400).json({ success: false, message: 'Manager ID is required' });
      }

      const result = await userService.assignManager(userId, managerId, companyId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // GET /api/users/:id/subordinates - Get user's subordinates
  async getUserSubordinates(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.params.id;
      const { companyId } = req.user;
      
      const subordinates = await userService.getUserSubordinates(userId, companyId);
      res.json({ success: true, data: subordinates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
