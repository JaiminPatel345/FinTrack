// Common types used across the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type UserRole = 'admin' | 'manager' | 'employee';

export type ExpenseStatus = 
  | 'draft' 
  | 'submitted' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected' 
  | 'paid';

export type ApprovalAction = 'pending' | 'approved' | 'rejected';

export type ApprovalRuleType = 
  | 'sequential' 
  | 'percentage' 
  | 'specific_approver' 
  | 'hybrid';

export interface SelectOption {
  label: string;
  value: string;
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  currencies: Record<string, {
    name: string;
    symbol: string;
  }>;
  cca2: string;
  cca3: string;
  flag: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: DateRange;
  minAmount?: number;
  maxAmount?: number;
}
