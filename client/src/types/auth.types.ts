export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  currency: string;
}

export interface SigninFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
