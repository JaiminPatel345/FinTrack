import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/auth.service';
import { User, SignupFormData, SigninFormData } from '@types/auth.types';
import { useNotificationContext } from './NotificationContext';
import { handleApiError } from '@utils/helpers';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotificationContext();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      const response = await authService.verifyToken();
      if (response.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      notifyError(handleApiError(error));
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupFormData) => {
    try {
      const response = await authService.signup(data);
      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        notifySuccess('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      notifyError(handleApiError(error));
      throw error;
    }
  };

  const signin = async (data: SigninFormData) => {
    try {
      const response = await authService.signin(data);
      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        notifySuccess('Welcome back!');
        navigate('/dashboard');
      }
    } catch (error) {
      notifyError(handleApiError(error));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
    notifySuccess('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    signin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
