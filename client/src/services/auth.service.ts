import apiClient from './apiClient';
import type { SignupRequest, SignupResponse, SigninRequest, SigninResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth.types';
import { setAuthToken, removeAuthToken } from '../utils/helpers';

export const authService = {
  /**
   * Signup new user
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<{ data: SignupResponse }>('/api/auth/signup', data);
    if (response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data.data;
  },

  /**
   * Signin user
   */
  signin: async (data: SigninRequest): Promise<SigninResponse> => {
    const response = await apiClient.post<{ data: SigninResponse }>('/api/auth/signin', data);
    if (response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data.data;
  },

  /**
   * Forgot password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ data: { message: string } }>('/api/auth/forgot-password', data);
    return response.data.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ data: { message: string } }>('/api/auth/reset-password', data);
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    removeAuthToken();
    window.location.href = '/signin';
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data.data;
  },
};
