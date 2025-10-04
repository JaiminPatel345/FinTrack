import type { UserRole } from './common.types';

// Auth related types

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Signup
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  companyName?: string;
}

export interface SignupResponse {
  token: string;
  user: User;
}

// Signin
export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  token: string;
  user: User;
}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Reset Password
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Change Password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
