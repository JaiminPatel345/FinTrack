import api from './api';
import { ExpenseFormData, Expense } from '@types/expense.types';

export const expensesService = {
  // Get all expenses (filtered by role)
  getExpenses: async (params?: {
    status?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  // Get expense by ID
  getExpense: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Create expense
  createExpense: async (data: ExpenseFormData) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  // Update expense
  updateExpense: async (id: string, data: Partial<ExpenseFormData>) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  // Delete expense (draft only)
  deleteExpense: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Submit expense for approval
  submitExpense: async (id: string) => {
    const response = await api.post(`/expenses/${id}/submit`);
    return response.data;
  },

  // Get expense approval history
  getExpenseHistory: async (id: string) => {
    const response = await api.get(`/expenses/${id}/history`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create category (Admin only)
  createCategory: async (name: string, description?: string) => {
    const response = await api.post('/categories', { name, description });
    return response.data;
  },
};
