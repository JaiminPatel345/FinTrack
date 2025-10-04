import { useState, useEffect } from 'react';
import { expensesService } from '@services/expenses.service';
import { Expense, ExpenseFormData } from '@types/expense.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

interface UseExpensesOptions {
  status?: string;
  categoryId?: string;
  autoFetch?: boolean;
}

export const useExpenses = (options: UseExpensesOptions = {}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyError, notifySuccess } = useNotificationContext();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expensesService.getExpenses({
        status: options.status,
        categoryId: options.categoryId,
      });
      setExpenses(response.data.expenses ?? response.data);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: ExpenseFormData) => {
    try {
      setLoading(true);
      const response = await expensesService.createExpense(data);
      notifySuccess('Expense created successfully');
      await fetchExpenses();
      return response.data.expense ?? response.data;
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseFormData>) => {
    try {
      setLoading(true);
      const response = await expensesService.updateExpense(id, data);
      notifySuccess('Expense updated successfully');
      await fetchExpenses();
      return response.data.expense ?? response.data;
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await expensesService.deleteExpense(id);
      notifySuccess('Expense deleted successfully');
      await fetchExpenses();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitExpense = async (id: string) => {
    try {
      setLoading(true);
      await expensesService.submitExpense(id);
      notifySuccess('Expense submitted for approval');
      await fetchExpenses();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchExpenses();
    }
  }, [options.status, options.categoryId]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
  };
};
