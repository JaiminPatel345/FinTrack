import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  SignupRequest,
  SignupResponse,
  SigninRequest,
  SigninResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '../types/auth.types';
import type { ApiResponse } from '../types/common.types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'User', 'Expense', 'Approval', 'Category'],
  endpoints: (builder) => ({
    // Auth endpoints
    signup: builder.mutation<ApiResponse<SignupResponse>, SignupRequest>({
      query: (credentials) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    signin: builder.mutation<ApiResponse<SigninResponse>, SigninRequest>({
      query: (credentials) => ({
        url: '/api/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponse>,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<ResetPasswordResponse>,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = api;
