export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Expense Management System';

export const USER_ROLES = ['admin', 'manager', 'employee'] as const;

export const EXPENSE_STATUSES = [
  'draft',
  'submitted',
  'pending_approval',
  'approved',
  'rejected',
] as const;

export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

export const OCR_CONFIDENCE_THRESHOLDS = {
  warning: 0.6,
  success: 0.85,
};
