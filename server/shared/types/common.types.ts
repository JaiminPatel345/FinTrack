export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  timestamp?: Date;
  requestId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ApprovalRuleType {
  SEQUENTIAL = 'sequential',
  PERCENTAGE = 'percentage',
  SPECIFIC_APPROVER = 'specific_approver',
  HYBRID = 'hybrid'
}

export enum ApprovalAction {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum NotificationType {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  PASSWORD_SETUP = 'password_setup',
  EXPENSE_SUBMITTED = 'expense_submitted',
  APPROVAL_PENDING = 'approval_pending',
  EXPENSE_APPROVED = 'expense_approved',
  EXPENSE_REJECTED = 'expense_rejected',
  APPROVAL_REMINDER = 'approval_reminder'
}

export enum PaidByMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  COMPANY_CARD = 'company_card',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  OTHER = 'other'
}
