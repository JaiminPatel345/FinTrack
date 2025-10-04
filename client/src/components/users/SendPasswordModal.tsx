import React from 'react';
import { Modal } from '@components/common/Modal';
import { Button } from '@components/common/Button';

interface SendPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  userEmail?: string;
}

export const SendPasswordModal: React.FC<SendPasswordModalProps> = ({ isOpen, onClose, onConfirm, userEmail }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send password setup email"
      description={We will send a secure password setup email to .}
      size="sm"
    >
      <div className="space-y-6">
        <p className="text-sm text-neutral-600">
          The user will receive an email with a secure link to set their password. This link will be
          valid for 60 minutes.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Send email</Button>
        </div>
      </div>
    </Modal>
  );
};
