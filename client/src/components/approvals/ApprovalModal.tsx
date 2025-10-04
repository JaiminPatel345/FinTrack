import React from 'react';
import { Modal } from '@components/common/Modal';
import { StatusTimeline, TimelineStep } from '@components/expenses/StatusTimeline';
import { ApprovalAction } from '@types/approval.types';
import { formatDate } from '@utils/formatters';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ApprovalAction[];
  title: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, actions, title }) => {
  const steps: TimelineStep[] = actions.map((action) => ({
    title: ${action.stepOrder}. ,
    description: action.comments,
    status: action.action === 'approved' ? 'completed' : action.action === 'rejected' ? 'rejected' : 'current',
    timestamp: action.actionDate ? formatDate(action.actionDate) : undefined,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description="Approval history" size="lg">
      <StatusTimeline steps={steps} />
    </Modal>
  );
};
