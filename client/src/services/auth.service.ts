import api from './api';
import { 
  SignupFormData, 
  SigninFormData, 
  ForgotPasswordFormData, 
  ResetPasswordFormData,
  AuthResponse 
} from '@types/auth.types';

export const authService = {
  // Signup (Admin creates company)
  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Signin
  signin: async (data: SigninFormData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordFormData) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset Password
  resetPassword: async (token: string, data: ResetPasswordFormData) => {
    const response = await api.post('/auth/reset-password', { token, ...data });
    return response.data;
  },

  // Verify Token
  verifyToken: async () => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
};
