import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../../../shared/middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/users - Get all users (Admin only)
router.get('/', authorize('admin'), (req, res) => userController.getAllUsers(req, res));

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => userController.getUserById(req, res));

// POST /api/users - Create user (Admin only)
router.post('/', authorize('admin'), (req, res) => userController.createUser(req, res));

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => userController.updateUser(req, res));

// DELETE /api/users/:id - Deactivate user (Admin only)
router.delete('/:id', authorize('admin'), (req, res) => userController.deleteUser(req, res));

// POST /api/users/:id/send-password - Send password setup email (Admin only)
router.post('/:id/send-password', authorize('admin'), (req, res) => userController.sendPasswordSetupEmail(req, res));

// GET /api/users/:id/manager - Get user's manager
router.get('/:id/manager', (req, res) => userController.getUserManager(req, res));

// POST /api/users/:id/manager - Assign manager to user (Admin only)
router.post('/:id/manager', authorize('admin'), (req, res) => userController.assignManager(req, res));

// GET /api/users/:id/subordinates - Get user's subordinates
router.get('/:id/subordinates', (req, res) => userController.getUserSubordinates(req, res));

export default router;
