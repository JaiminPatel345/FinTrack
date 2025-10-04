import type { ExpenseStatus } from './common.types';

export interface ExpenseLineItem {
  id?: string;
  description: string;
  amount: number;
  gstPercentage?: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  companyCurrency: string;
  conversionRate: number;
  date: string;
  categoryId: string;
  categoryName: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  paidBy: string;
  status: ExpenseStatus;
  gstPercentage?: number;
  remarks?: string;
  ocrProcessed: boolean;
  ocrConfidence?: number;
  submittedBy: string;
  submittedByName: string;
  companyId: string;
  lineItems?: ExpenseLineItem[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  currency: string;
  date: string;
  categoryId: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  paidBy: string;
  gstPercentage?: number;
  remarks?: string;
  lineItems?: ExpenseLineItem[];
  submit?: boolean;
}

export interface UpdateExpenseRequest {
  description?: string;
  amount?: number;
  currency?: string;
  date?: string;
  categoryId?: string;
  paidBy?: string;
  gstPercentage?: number;
  remarks?: string;
  lineItems?: ExpenseLineItem[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface UploadReceiptResponse {
  url: string;
  publicId: string;
}

export interface ExpenseFilters {
  status?: ExpenseStatus;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}
