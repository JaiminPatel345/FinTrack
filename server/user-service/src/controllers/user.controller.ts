import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      const users = await userService.getAllUsers(companyId);
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;
      
      const user = await userService.getUserById(userId, companyId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;
      const requestUserId = (req as any).user.userId;

      // Users can only update their own profile unless they're admin
      if (userId !== requestUserId && (req as any).user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      const user = await userService.updateUser(userId, companyId, req.body);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;

      // Only admins can delete users
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      await userService.deleteUser(userId, companyId);
      res.json({ success: true, message: 'User deactivated successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserManagers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;
      
      const managers = await userService.getUserManagers(userId, companyId);
      res.json({ success: true, data: managers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUserSubordinates(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;
      
      const subordinates = await userService.getUserSubordinates(userId, companyId);
      res.json({ success: true, data: subordinates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async assignManager(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const { managerId } = req.body;
      const companyId = (req as any).user.companyId;

      if (!managerId) {
        return res.status(400).json({ success: false, message: 'Manager ID is required' });
      }

      const relationship = await userService.assignManager(userId, managerId, companyId);
      res.json({ success: true, data: relationship });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async removeManager(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const managerId = parseInt(req.params.managerId);

      await userService.removeManager(userId, managerId);
      res.json({ success: true, message: 'Manager removed successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUsersByRole(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      const { role } = req.query;

      if (!role) {
        return res.status(400).json({ success: false, message: 'Role is required' });
      }

      const users = await userService.getUsersByRole(companyId, role as string);
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUsersByDepartment(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      const { department } = req.query;

      if (!department) {
        return res.status(400).json({ success: false, message: 'Department is required' });
      }

      const users = await userService.getUsersByDepartment(companyId, department as string);
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
