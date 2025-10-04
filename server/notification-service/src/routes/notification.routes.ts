import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();
const notificationController = new NotificationController();

// Get user notifications
router.get('/', (req, res) => notificationController.getUserNotifications(req, res));

// Get unread count
router.get('/unread/count', (req, res) => notificationController.getUnreadCount(req, res));

// Mark notification as read
router.put('/:id/read', (req, res) => notificationController.markAsRead(req, res));

// Mark all notifications as read
router.put('/read-all', (req, res) => notificationController.markAllAsRead(req, res));

// Delete notification
router.delete('/:id', (req, res) => notificationController.deleteNotification(req, res));

// Send test notification
router.post('/test', (req, res) => notificationController.sendTestNotification(req, res));

export default router;
