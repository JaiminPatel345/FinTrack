import React from 'react';
import { usePendingApprovals } from '@hooks/useApprovals';
import { ApprovalsList } from '@components/approvals/ApprovalsList';
import { Card } from '@components/common/Card';

export const ManagerDashboard: React.FC = () => {
  const { pending, loading, approve, reject } = usePendingApprovals();

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-lg font-semibold text-neutral-900">Approvals overview</h1>
        <p className="text-sm text-neutral-500">Expenses awaiting your decision appear below. Review receipts, leave comments, and unblock reimbursements.</p>
      </Card>
      <ApprovalsList approvals={pending} loading={loading} onApprove={approve} onReject={reject} />
    </div>
  );
};

export default ManagerDashboard;
