import {
  AuthResponse,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  SigninFormData,
  SignupFormData,
} from '@types/auth.types';
import { baseApi } from './baseApi';

type BasicSuccessResponse = {
  success: boolean;
  message: string;
};

type ResetPasswordPayload = ResetPasswordFormData & { token: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<AuthResponse, SignupFormData>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Users'],
    }),
    signin: build.mutation<AuthResponse, SigninFormData>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: build.mutation<BasicSuccessResponse, ForgotPasswordFormData>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: build.mutation<BasicSuccessResponse, ResetPasswordPayload>({
      query: ({ token, ...body }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, ...body },
      }),
    }),
    verifyToken: build.query<AuthResponse, void>({
      query: () => ({
        url: '/auth/verify-token',
        method: 'POST',
      }),
      providesTags: ['Auth'],
    }),
    refreshToken: build.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useSigninMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyTokenQuery,
  useLazyVerifyTokenQuery,
  useRefreshTokenMutation,
} = authApi;
