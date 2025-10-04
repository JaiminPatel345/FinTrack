import React, { useState } from 'react';
import { useExpenses } from '@hooks/useExpenses';
import { ExpenseList } from '@components/expenses/ExpenseList';
import { ExpenseFilters } from '@components/expenses/ExpenseFilters';
import { Card } from '@components/common/Card';

export const EmployeeDashboard: React.FC = () => {
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const { expenses, loading, fetchExpenses, submitExpense } = useExpenses({ status, categoryId });

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-lg font-semibold text-neutral-900">My expenses</h1>
        <p className="text-sm text-neutral-500">Track drafts, pending items, and processed reimbursements. Submit receipts instantly.</p>
      </Card>

      <ExpenseFilters
        categories={[]}
        status={status}
        onStatusChange={setStatus}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        onDateChange={() => undefined}
      />

      <ExpenseList
        expenses={expenses}
        loading={loading}
        onSubmit={async (expenseId) => {
          await submitExpense(expenseId);
          fetchExpenses();
        }}
      />
    </div>
  );
};

export default EmployeeDashboard;
