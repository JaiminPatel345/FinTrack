import { UserRole } from './common.types';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  country: string;
  currency: string;
  companyName?: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    companyId: string;
    companyName: string;
    currency: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  companyId: string;
  iat?: number;
  exp?: number;
}

export interface VerifyTokenResponse {
  valid: boolean;
  payload?: JwtPayload;
}
