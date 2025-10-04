import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseList } from '@components/expenses/ExpenseList';
import { ExpenseFilters } from '@components/expenses/ExpenseFilters';
import { Button } from '@components/common/Button';
import { useExpenses } from '@hooks/useExpenses';
import { expensesService } from '@services/expenses.service';
import { Category } from '@types/expense.types';

export const ExpensesList: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const { expenses, loading, fetchExpenses, submitExpense, deleteExpense } = useExpenses({ status, categoryId });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await expensesService.getCategories();
        setCategories(response.data.categories ?? response.data);
      } catch (error) {
        // ignore for now; filters will just show empty list
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [status, categoryId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Expenses</h1>
          <p className="text-sm text-neutral-500">Filter, submit, and review all expenses across statuses.</p>
        </div>
        <Button onClick={() => navigate('/expenses/create')}>Create expense</Button>
      </div>

      <ExpenseFilters
        categories={categories}
        status={status}
        onStatusChange={setStatus}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        startDate={startDate}
        endDate={endDate}
        onDateChange={({ startDate: start, endDate: end }) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

      <ExpenseList
        expenses={expenses}
        loading={loading}
        onSubmit={async (expenseId) => {
          await submitExpense(expenseId);
          fetchExpenses();
        }}
        onDelete={async (expenseId) => {
          await deleteExpense(expenseId);
          fetchExpenses();
        }}
        onEdit={(expense) => navigate(/expenses//edit)}
      />
    </div>
  );
};

export default ExpensesList;
