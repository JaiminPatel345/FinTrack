import { useEffect, useState } from 'react';
import { usersService } from '@services/users.service';
import { CreateUserFormData, UserListItem } from '@types/user.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

export const useUsers = (autoFetch = true) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyError, notifySuccess } = useNotificationContext();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.getUsers();
      setUsers(response.data.users);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: CreateUserFormData) => {
    try {
      setLoading(true);
      await usersService.createUser(data);
      notifySuccess('User invited successfully');
      await fetchUsers();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<CreateUserFormData>) => {
    try {
      setLoading(true);
      await usersService.updateUser(id, data);
      notifySuccess('User updated successfully');
      await fetchUsers();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (id: string) => {
    try {
      setLoading(true);
      await usersService.deactivateUser(id);
      notifySuccess('User deactivated');
      await fetchUsers();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordEmail = async (id: string) => {
    try {
      await usersService.sendPasswordEmail(id);
      notifySuccess('Password reset email sent');
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deactivateUser,
    sendPasswordEmail,
  };
};
