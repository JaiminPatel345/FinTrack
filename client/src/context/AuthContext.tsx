import React, { ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SigninFormData,
  SignupFormData,
  User,
} from '@types/auth.types';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  selectAuthState,
  clearCredentials,
  setAuthStatus,
  setHydrated,
  setAuthError,
} from '@store/slices/authSlice';
import {
  useSigninMutation,
  useSignupMutation,
  useLazyVerifyTokenQuery,
} from '@store/api/authApi';
import { useNotificationContext } from './NotificationContext';
import { handleApiError } from '@utils/helpers';

type Role = 'admin' | 'manager' | 'employee';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (data: SignupFormData) => Promise<void>;
  signin: (data: SigninFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
}

const resolveRole = (role: Role | undefined, target: Role) => role === target;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, hydrated } = useAppSelector(selectAuthState);
  const [verifyToken] = useLazyVerifyTokenQuery();
  const hasRequestedVerification = useRef(false);

  useEffect(() => {
    if (!token) {
      dispatch(setAuthStatus('idle'));
      dispatch(setHydrated(true));
      hasRequestedVerification.current = false;
      return;
    }

    if (!hydrated && !hasRequestedVerification.current) {
      hasRequestedVerification.current = true;
      dispatch(setAuthStatus('loading'));
      verifyToken()
        .unwrap()
        .catch(() => {
          dispatch(setAuthError('Session expired. Please sign in again.'));
          dispatch(clearCredentials());
        })
        .finally(() => {
          dispatch(setHydrated(true));
          hasRequestedVerification.current = false;
        });
    }
  }, [token, hydrated, verifyToken, dispatch]);

  return <>{children}</>;
};

export const useAuthContext = (): AuthContextValue => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);
  const { notifySuccess, notifyError } = useNotificationContext();

  const [signupMutation, { isLoading: isSignupLoading }] = useSignupMutation();
  const [signinMutation, { isLoading: isSigninLoading }] = useSigninMutation();

  const signup = async (data: SignupFormData) => {
    try {
      await signupMutation(data).unwrap();
      notifySuccess('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = handleApiError(error);
      notifyError(message);
      throw error;
    }
  };

  const signin = async (data: SigninFormData) => {
    try {
      await signinMutation(data).unwrap();
      notifySuccess('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const message = handleApiError(error);
      notifyError(message);
      throw error;
    }
  };

  const logout = () => {
    dispatch(clearCredentials());
    navigate('/signin');
    notifySuccess('Logged out successfully');
  };

  const loading =
    authState.status === 'loading' ||
    !authState.hydrated ||
    isSignupLoading ||
    isSigninLoading;

  const role = authState.user?.role as Role | undefined;

  return {
    user: authState.user,
    loading,
    signup,
    signin,
    logout,
    isAuthenticated: Boolean(authState.user && authState.token),
    isAdmin: resolveRole(role, 'admin'),
    isManager: resolveRole(role, 'manager'),
    isEmployee: resolveRole(role, 'employee'),
  };
};
