import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useSendPasswordEmailMutation,
} from '@store/api/usersApi';
import type { CreateUserFormData, UserListItem } from '@types/user.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

export const useUsers = (autoFetch = true) => {
  const { notifyError, notifySuccess } = useNotificationContext();

  const [fetchUsersTrigger, { data, isFetching, isLoading, isUninitialized }] = useLazyGetUsersQuery();
  const [createUserMutation, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deactivateUserMutation, { isLoading: isDeactivating }] = useDeactivateUserMutation();
  const [sendPasswordEmailMutation, { isLoading: isSendingPassword }] = useSendPasswordEmailMutation();

  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      await fetchUsersTrigger().unwrap();
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      notifyError(message);
      throw err;
    }
  }, [fetchUsersTrigger, notifyError]);

  useEffect(() => {
    if (autoFetch) {
      fetchUsers().catch(() => undefined);
    }
  }, [autoFetch, fetchUsers]);

  const safeMutation = useCallback(
    async <T,>(mutation: () => Promise<T>, successMessage?: string) => {
      try {
        setError(null);
        const result = await mutation();
        if (successMessage) {
          notifySuccess(successMessage);
        }
        await fetchUsers();
        return result;
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [fetchUsers, notifyError, notifySuccess],
  );

  const createUser = useCallback(
    (payload: CreateUserFormData) =>
      safeMutation(() => createUserMutation(payload).unwrap(), 'User invited successfully'),
    [createUserMutation, safeMutation],
  );

  const updateUser = useCallback(
    (id: string, payload: Partial<CreateUserFormData>) =>
      safeMutation(() => updateUserMutation({ id, data: payload }).unwrap(), 'User updated successfully'),
    [safeMutation, updateUserMutation],
  );

  const deactivateUser = useCallback(
    (id: string) => safeMutation(() => deactivateUserMutation(id).unwrap(), 'User deactivated'),
    [deactivateUserMutation, safeMutation],
  );

  const sendPasswordEmail = useCallback(
    async (id: string) => {
      try {
        await sendPasswordEmailMutation(id).unwrap();
        notifySuccess('Password reset email sent');
      } catch (err) {
        const message = handleApiError(err);
        notifyError(message);
        throw err;
      }
    },
    [notifyError, notifySuccess, sendPasswordEmailMutation],
  );

  const users: UserListItem[] = useMemo(() => data?.users ?? [], [data?.users]);

  const loading =
    isFetching ||
    isLoading ||
    isCreating ||
    isUpdating ||
    isDeactivating ||
    isSendingPassword ||
    (!data && !error && !isUninitialized && isFetching);

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
