import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole, JwtPayload } from '../types/auth.types';

// Extend Request interface
interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

const router = Router();
const userController = new UserController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/users - Get all users (Admin only)
router.get('/', authorize(UserRole.ADMIN), (req: Request, res: Response) => 
  userController.getAllUsers(req as AuthenticatedRequest, res)
);

// GET /api/users/:id - Get user by ID
router.get('/:id', (req: Request, res: Response) => 
  userController.getUserById(req as AuthenticatedRequest, res)
);

// POST /api/users - Create user (Admin only)
router.post('/', authorize(UserRole.ADMIN), (req: Request, res: Response) => 
  userController.createUser(req as AuthenticatedRequest, res)
);

// PUT /api/users/:id - Update user
router.put('/:id', (req: Request, res: Response) => 
  userController.updateUser(req as AuthenticatedRequest, res)
);

// DELETE /api/users/:id - Deactivate user (Admin only)
router.delete('/:id', authorize(UserRole.ADMIN), (req: Request, res: Response) => 
  userController.deleteUser(req as AuthenticatedRequest, res)
);

// POST /api/users/:id/send-password - Send password setup email (Admin only)
router.post('/:id/send-password', authorize(UserRole.ADMIN), (req: Request, res: Response) => 
  userController.sendPasswordSetupEmail(req as AuthenticatedRequest, res)
);

// GET /api/users/:id/manager - Get user's manager
router.get('/:id/manager', (req: Request, res: Response) => 
  userController.getUserManager(req as AuthenticatedRequest, res)
);

// POST /api/users/:id/manager - Assign manager to user (Admin only)
router.post('/:id/manager', authorize(UserRole.ADMIN), (req: Request, res: Response) => 
  userController.assignManager(req as AuthenticatedRequest, res)
);

// GET /api/users/:id/subordinates - Get user's subordinates
router.get('/:id/subordinates', (req: Request, res: Response) => 
  userController.getUserSubordinates(req as AuthenticatedRequest, res)
);

export default router;
