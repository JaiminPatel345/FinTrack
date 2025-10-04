import React, { useCallback, useMemo } from 'react';
import { Toaster, toast, ToastOptions } from 'react-hot-toast';
import { nanoid } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  enqueueNotification,
  removeNotification,
  selectNotificationsQueue,
  NotificationTone,
} from '@store/slices/notificationsSlice';

const NotificationListener: React.FC = () => {
  const dispatch = useAppDispatch();
  const queue = useAppSelector(selectNotificationsQueue);

  React.useEffect(() => {
    queue.forEach(({ id, message, tone, options }) => {
      const toastOptions: ToastOptions = { id, ...options };

      switch (tone) {
        case 'success': {
          toast.success(message, toastOptions);
          break;
        }
        case 'error': {
          toast.error(message, toastOptions);
          break;
        }
        case 'warning': {
          toast(message, {
            icon: '??',
            ...toastOptions,
          });
          break;
        }
        default: {
          toast(message, toastOptions);
        }
      }

      dispatch(removeNotification(id));
    });
  }, [queue, dispatch]);

  return null;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <NotificationListener />
      {children}
    </>
  );
};

const dispatchNotification = (
  dispatch: ReturnType<typeof useAppDispatch>,
  tone: NotificationTone,
  message: string,
  options?: ToastOptions,
) => {
  const id = nanoid();
  dispatch(
    enqueueNotification({
      id,
      tone,
      message,
      options,
    }),
  );
  return id;
};

export const useNotificationContext = () => {
  const dispatch = useAppDispatch();

  const notify = useCallback(
    (message: string, options?: ToastOptions) => dispatchNotification(dispatch, 'default', message, options),
    [dispatch],
  );

  const notifySuccess = useCallback(
    (message: string, options?: ToastOptions) => dispatchNotification(dispatch, 'success', message, options),
    [dispatch],
  );

  const notifyError = useCallback(
    (message: string, options?: ToastOptions) => dispatchNotification(dispatch, 'error', message, options),
    [dispatch],
  );

  const dismiss = useCallback((toastId?: string) => toast.dismiss(toastId), []);

  return useMemo(
    () => ({
      notify,
      notifySuccess,
      notifyError,
      dismiss,
    }),
    [dismiss, notify, notifyError, notifySuccess],
  );
};
