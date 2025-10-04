import React from 'react';
import { PendingApproval } from '@types/approval.types';
import { ApprovalCard } from './ApprovalCard';
import { Loader } from '@components/common/Loader';

interface ApprovalsListProps {
  approvals: PendingApproval[];
  loading: boolean;
  onApprove: (approvalId: string, comments?: string) => Promise<void> | void;
  onReject: (approvalId: string, comments: string) => Promise<void> | void;
}

export const ApprovalsList: React.FC<ApprovalsListProps> = ({ approvals, loading, onApprove, onReject }) => {
  if (loading) {
    return <Loader label="Loading pending approvals" />;
  }

  if (approvals.length === 0) {
    return (
      <div className="card text-center text-neutral-500">
        <h3 className="text-lg font-semibold text-neutral-800">No pending approvals</h3>
        <p className="mt-2 text-sm">
          You are all caught up. New approvals will show up here instantly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => (
        <ApprovalCard key={approval.approvalId ?? approval.expenseId} approval={approval} onApprove={onApprove} onReject={onReject} />
      ))}
    </div>
  );
};
