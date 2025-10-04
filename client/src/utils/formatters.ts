import { format } from 'date-fns';
import { DEFAULT_DATE_FORMAT } from './constants';

export const formatCurrency = (value: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return ${currency} ;
  }
};

export const formatDate = (value: string | Date, dateFormat = DEFAULT_DATE_FORMAT) => {
  try {
    return format(typeof value === 'string' ? new Date(value) : value, dateFormat);
  } catch (error) {
    return '';
  }
};

export const formatStatus = (status: string) => {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
