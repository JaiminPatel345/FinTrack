import React, { useMemo } from 'react';
import { Card } from '@components/common/Card';
import { useExpenses } from '@hooks/useExpenses';
import { useApprovalRules } from '@hooks/useApprovals';
import { Loader } from '@components/common/Loader';
import { formatCurrency } from '@utils/formatters';

export const AdminDashboard: React.FC = () => {
  const { expenses, loading: loadingExpenses } = useExpenses();
  const { rules, loading: loadingRules } = useApprovalRules();

  const totals = useMemo(() => {
    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pending = expenses.filter((expense) => expense.status === 'pending_approval').length;
    const approved = expenses.filter((expense) => expense.status === 'approved').length;

    return { totalSpend, pending, approved };
  }, [expenses]);

  if (loadingExpenses && loadingRules) {
    return <Loader label="Loading analytics" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">Total company spend</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{formatCurrency(totals.totalSpend)}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Expenses pending approval</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{totals.pending}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Approved this month</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{totals.approved}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-neutral-900">Approval workflows</h2>
        <p className="mt-1 text-sm text-neutral-500">Total configured rules: {rules.length}</p>
      </Card>
    </div>
  );
};

export default AdminDashboard;
