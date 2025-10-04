import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Toaster, toast, ToastOptions } from 'react-hot-toast';

interface NotificationContextValue {
  notify: (message: string, options?: ToastOptions) => string;
  notifySuccess: (message: string, options?: ToastOptions) => string;
  notifyError: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useCallback((message: string, options?: ToastOptions) => toast(message, options), []);

  const notifySuccess = useCallback(
    (message: string, options?: ToastOptions) =>
      toast.success(message, {
        duration: 4000,
        ...options,
      }),
    []
  );

  const notifyError = useCallback(
    (message: string, options?: ToastOptions) =>
      toast.error(message, {
        duration: 5000,
        ...options,
      }),
    []
  );

  const dismiss = useCallback((toastId?: string) => toast.dismiss(toastId), []);

  const value = useMemo(
    () => ({
      notify,
      notifySuccess,
      notifyError,
      dismiss,
    }),
    [notify, notifySuccess, notifyError, dismiss]
  );

  return (
    <NotificationContext.Provider value={value}>
      <Toaster position="top-right" />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};
