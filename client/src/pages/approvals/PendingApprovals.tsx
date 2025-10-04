import React from 'react';
import { usePendingApprovals } from '@hooks/useApprovals';
import { ApprovalsList } from '@components/approvals/ApprovalsList';

export const PendingApprovals: React.FC = () => {
  const { pending, loading, approve, reject } = usePendingApprovals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Pending approvals</h1>
        <p className="text-sm text-neutral-500">Review expenses requiring your sign-off.</p>
      </div>
      <ApprovalsList approvals={pending} loading={loading} onApprove={approve} onReject={reject} />
    </div>
  );
};

export default PendingApprovals;
