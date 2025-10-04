import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// Get all users (company-wide)
router.get('/', (req, res) => userController.getAllUsers(req, res));

// Get users by role
router.get('/role', (req, res) => userController.getUsersByRole(req, res));

// Get users by department
router.get('/department', (req, res) => userController.getUsersByDepartment(req, res));

// Get user by ID
router.get('/:id', (req, res) => userController.getUserById(req, res));

// Update user
router.put('/:id', (req, res) => userController.updateUser(req, res));

// Delete (deactivate) user
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

// Get user's managers
router.get('/:id/managers', (req, res) => userController.getUserManagers(req, res));

// Get user's subordinates
router.get('/:id/subordinates', (req, res) => userController.getUserSubordinates(req, res));

// Assign manager to user
router.post('/:id/managers', (req, res) => userController.assignManager(req, res));

// Remove manager from user
router.delete('/:id/managers/:managerId', (req, res) => userController.removeManager(req, res));

export default router;
