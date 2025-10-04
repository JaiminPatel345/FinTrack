import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const notifications = await notificationService.getUserNotifications(userId, req.query);
      res.json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      
      const success = await notificationService.markAsRead(id, userId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      
      res.json({ success: true, message: 'Notification marked as read' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const count = await notificationService.markAllAsRead(userId);
      res.json({ success: true, message: `${count} notifications marked as read` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      
      const success = await notificationService.deleteNotification(id, userId);
      
      if (!success) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      
      res.json({ success: true, message: 'Notification deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async sendTestNotification(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { title, message } = req.body;
      
      const notification = await notificationService.createNotification({
        userId,
        type: 'test',
        title: title || 'Test Notification',
        message: message || 'This is a test notification'
      });
      
      res.json({ success: true, data: notification });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
