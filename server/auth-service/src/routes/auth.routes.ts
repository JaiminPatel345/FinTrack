import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-token', authController.verifyToken);

export default router;
