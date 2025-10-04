import { createToaster } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'top-end',
  duration: 3000,
});

export const showToast = (
  title: string,
  description?: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) => {
  toaster.create({
    title,
    description,
    type,
  });
};

export const showSuccessToast = (title: string, description?: string) => {
  showToast(title, description, 'success');
};

export const showErrorToast = (title: string, description?: string) => {
  showToast(title, description, 'error');
};

export const showInfoToast = (title: string, description?: string) => {
  showToast(title, description, 'info');
};

export const showWarningToast = (title: string, description?: string) => {
  showToast(title, description, 'warning');
};
