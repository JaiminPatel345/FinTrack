import { getDB } from '../config/mongodb';
import nodemailer from 'nodemailer';

export class NotificationService {
  private transporter: any;

  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async createNotification(data: any) {
    const db = getDB();
    const notification = {
      ...data,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('notifications').insertOne(notification);
    return { ...notification, _id: result.insertedId };
  }

  async getUserNotifications(userId: number, filters: any = {}) {
    const db = getDB();
    const query: any = { userId };

    if (filters.read !== undefined) {
      query.read = filters.read === 'true';
    }

    if (filters.type) {
      query.type = filters.type;
    }

    const notifications = await db.collection('notifications')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .toArray();

    return notifications;
  }

  async markAsRead(notificationId: string, userId: number) {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    
    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(notificationId), userId },
      { $set: { read: true, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  async markAllAsRead(userId: number) {
    const db = getDB();
    
    const result = await db.collection('notifications').updateMany(
      { userId, read: false },
      { $set: { read: true, updatedAt: new Date() } }
    );

    return result.modifiedCount;
  }

  async deleteNotification(notificationId: string, userId: number) {
    const db = getDB();
    const { ObjectId } = require('mongodb');
    
    const result = await db.collection('notifications').deleteOne(
      { _id: new ObjectId(notificationId), userId }
    );

    return result.deletedCount > 0;
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@expense.com',
        to,
        subject,
        html
      });

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendExpenseNotification(type: string, data: any) {
    // Create in-app notification
    const notification = await this.createNotification({
      userId: data.userId,
      type,
      title: data.title,
      message: data.message,
      relatedId: data.expenseId,
      relatedType: 'expense'
    });

    // Send email if user email is provided
    if (data.email) {
      await this.sendEmail(data.email, data.title, data.message);
    }

    return notification;
  }

  async getUnreadCount(userId: number) {
    const db = getDB();
    
    const count = await db.collection('notifications').countDocuments({
      userId,
      read: false
    });

    return count;
  }
}
