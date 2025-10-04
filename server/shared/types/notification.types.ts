import { NotificationType } from './common.types';

export interface Notification {
  _id?: string;
  companyId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  channels: string[];
  isRead: boolean;
  readAt?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  emailError?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
}

export interface CreateNotificationRequest {
  userId: string;
  companyId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  channels?: string[];
  priority?: 'low' | 'medium' | 'high';
  emailData?: Record<string, any>;
}
