import { ExpenseStatus, PaidByMethod } from './common.types';

export interface Expense {
  id: string;
  companyId: string;
  userId: string;
  categoryId: string;
  description: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  companyCurrency: string;
  exchangeRate: number;
  expenseDate: Date;
  paidBy: PaidByMethod;
  gstPercentage: number;
  gstAmount: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  ocrProcessed: boolean;
  ocrConfidence?: number;
  status: ExpenseStatus;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseRequest {
  categoryId: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  paidBy: PaidByMethod;
  gstPercentage?: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
}

export interface UpdateExpenseRequest {
  categoryId?: string;
  description?: string;
  amount?: number;
  currency?: string;
  expenseDate?: Date;
  paidBy?: PaidByMethod;
  gstPercentage?: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
}

export interface ExpenseCategory {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ExpenseLineItem {
  id: string;
  expenseId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ExpenseWithDetails extends Expense {
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  lineItems?: ExpenseLineItem[];
}

export interface ExpenseFilters {
  status?: ExpenseStatus;
  categoryId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}
