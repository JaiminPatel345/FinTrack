import apiClient from './apiClient';
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest, ExpenseCategory } from '../types/expense.types';

export const expensesService = {
  /**
   * Get all expenses
   */
  getAll: async (params?: {
    status?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ expenses: Expense[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/expenses', { params });
    return response.data.data;
  },

  /**
   * Get expense by ID
   */
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get<{ data: Expense }>(`/api/expenses/${id}`);
    return response.data.data;
  },

  /**
   * Create new expense
   */
  create: async (data: CreateExpenseRequest): Promise<Expense> => {
    const response = await apiClient.post<{ data: Expense }>('/api/expenses', data);
    return response.data.data;
  },

  /**
   * Update expense
   */
  update: async (id: string, data: UpdateExpenseRequest): Promise<Expense> => {
    const response = await apiClient.put<{ data: Expense }>(`/api/expenses/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete expense
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/expenses/${id}`);
  },

  /**
   * Submit expense for approval
   */
  submit: async (id: string): Promise<Expense> => {
    const response = await apiClient.post<{ data: Expense }>(`/api/expenses/${id}/submit`);
    return response.data.data;
  },

  /**
   * Get expense categories
   */
  getCategories: async (): Promise<ExpenseCategory[]> => {
    const response = await apiClient.get<{ data: ExpenseCategory[] }>('/api/expenses/categories');
    return response.data.data;
  },

  /**
   * Get expense statistics
   */
  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/api/expenses/stats');
    return response.data.data;
  },

  /**
   * Get my expenses
   */
  getMyExpenses: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ expenses: Expense[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/api/expenses/my', { params });
    return response.data.data;
  },
};
