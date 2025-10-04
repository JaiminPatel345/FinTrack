import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/auth.service';
import { User } from '@types/auth.types';
import { useNotificationContext } from '@context/NotificationContext';
import { handleApiError } from '@utils/helpers';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useNotificationContext();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
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

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    notifySuccess('Welcome back!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isManager,
    isEmployee,
    isAuthenticated: !!user,
  };
};
