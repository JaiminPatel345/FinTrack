import apiClient from './apiClient';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

export const usersService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<{ data: User[] }>('/api/users');
    return response.data.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<{ data: User }>(`/api/users/${id}`);
    return response.data.data;
  },

  /**
   * Create new user
   */
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<{ data: User }>('/api/users', data);
    return response.data.data;
  },

  /**
   * Update user
   */
  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<{ data: User }>(`/api/users/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete user (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/users/${id}`);
  },

  /**
   * Get managers list
   */
  getManagers: async (): Promise<User[]> => {
    const response = await apiClient.get<{ data: User[] }>('/api/users?role=manager');
    return response.data.data;
  },

  /**
   * Send password setup email
   */
  sendPasswordEmail: async (userId: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ data: { message: string } }>(`/api/users/${userId}/send-password`);
    return response.data.data;
  },

  /**
   * Get user statistics
   */
  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/api/users/stats');
    return response.data.data;
  },
};
