import toast, { ToastOptions } from 'react-hot-toast';

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => toast.success(message, options);
  const error = (message: string, options?: ToastOptions) => toast.error(message, options);
  const info = (message: string, options?: ToastOptions) => toast(message, options);
  const dismiss = (toastId?: string) => toast.dismiss(toastId);

  return { success, error, info, dismiss };
};
