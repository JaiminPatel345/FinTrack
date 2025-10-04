import { useCallback, useEffect, useState } from 'react';
import { approvalsService } from '@services/approvals.service';
import { ApprovalRule, PendingApproval } from '@types/approval.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

export const useApprovalRules = (autoFetch = true) => {
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyError, notifySuccess } = useNotificationContext();

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalsService.getApprovalRules();
      setRules(response.data.rules ?? response.data);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const saveRule = async (data: Partial<ApprovalRule>) => {
    try {
      setLoading(true);
      if (data.id) {
        await approvalsService.updateApprovalRule(data.id, data);
        notifySuccess('Approval rule updated');
      } else {
        await approvalsService.createApprovalRule(data as ApprovalRule);
        notifySuccess('Approval rule created');
      }
      await fetchRules();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRule = async (id: string) => {
    try {
      setLoading(true);
      await approvalsService.deleteApprovalRule(id);
      notifySuccess('Approval rule removed');
      await fetchRules();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRules();
    }
  }, [autoFetch, fetchRules]);

  return {
    rules,
    loading,
    error,
    fetchRules,
    saveRule,
    deleteRule,
  };
};

export const usePendingApprovals = (autoFetch = true) => {
  const [pending, setPending] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyError, notifySuccess } = useNotificationContext();

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await approvalsService.getPendingApprovals();
      setPending(response.data.pending ?? response.data);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  const approve = async (approvalId: string, comments?: string) => {
    try {
      await approvalsService.approveExpense(approvalId, comments);
      notifySuccess('Expense approved');
      await fetchPending();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    }
  };

  const reject = async (approvalId: string, comments: string) => {
    try {
      await approvalsService.rejectExpense(approvalId, comments);
      notifySuccess('Expense rejected');
      await fetchPending();
    } catch (err) {
      notifyError(handleApiError(err));
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchPending();
    }
  }, [autoFetch, fetchPending]);

  return {
    pending,
    loading,
    error,
    fetchPending,
    approve,
    reject,
  };
};
