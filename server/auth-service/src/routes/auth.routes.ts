import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-token', authController.verifyToken);

export default router;
