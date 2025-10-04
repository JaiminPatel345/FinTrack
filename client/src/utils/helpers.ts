import { AxiosError } from 'axios';

export const handleApiError = (error: unknown) => {
  const defaultMessage = 'Something went wrong. Please try again.';

  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || defaultMessage;
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  return defaultMessage;
};

export const downloadFile = (url: string, filename: string) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  anchor.remove();
};

export const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');
