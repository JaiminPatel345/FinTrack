import apiClient from './apiClient';

export const notificationService = {
  /**
   * Get all notifications
   */
  getAll: async (params?: { isRead?: boolean; page?: number; limit?: number }) => {
    const response = await apiClient.get('/api/notifications', { params });
    return response.data.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: string) => {
    const response = await apiClient.patch(`/api/notifications/${id}/read`);
    return response.data.data;
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async () => {
    const response = await apiClient.patch('/api/notifications/read-all');
    return response.data.data;
  },

  /**
   * Delete notification
   */
  delete: async (id: string) => {
    await apiClient.delete(`/api/notifications/${id}`);
  },

  /**
   * Get unread count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/api/notifications/unread-count');
    return response.data.data.count;
  },
};
