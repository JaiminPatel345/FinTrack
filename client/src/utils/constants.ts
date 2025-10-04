// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// App Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Expense Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

// Expense Status
export const EXPENSE_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
} as const;

// Approval Status
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'company_card', label: 'Company Card' },
  { value: 'personal', label: 'Personal' },
];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  { value: 'travel', label: 'Travel' },
  { value: 'meals', label: 'Meals & Entertainment' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'transport', label: 'Transport' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'software', label: 'Software & Subscriptions' },
  { value: 'training', label: 'Training & Development' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

// Approval Rule Types
export const APPROVAL_RULE_TYPES = {
  SEQUENTIAL: 'sequential',
  PERCENTAGE: 'percentage',
  SPECIFIC_APPROVER: 'specific_approver',
  HYBRID: 'hybrid',
} as const;

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATE_TIME_FORMAT = 'MMM dd, yyyy hh:mm a';
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

// Toast Duration
export const TOAST_DURATION = 3000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];

// Currency
export const DEFAULT_CURRENCY = 'USD';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;
