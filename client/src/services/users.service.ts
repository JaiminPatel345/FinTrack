import api from './api';
import { CreateUserFormData, UsersResponse } from '@types/user.types';

export const usersService = {
  // Get all users in company
  getUsers: async (): Promise<UsersResponse> => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user (Admin only)
  createUser: async (data: CreateUserFormData) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: Partial<CreateUserFormData>) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Deactivate user
  deactivateUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Send password setup email
  sendPasswordEmail: async (id: string) => {
    const response = await api.post(`/users/${id}/send-password`);
    return response.data;
  },

  // Get user's manager
  getManager: async (id: string) => {
    const response = await api.get(`/users/${id}/manager`);
    return response.data;
  },

  // Assign manager
  assignManager: async (userId: string, managerId: string) => {
    const response = await api.post(`/users/${userId}/manager`, { managerId });
    return response.data;
  },
};
