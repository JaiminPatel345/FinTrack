import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useGetApprovalRulesQuery,
  useCreateApprovalRuleMutation,
  useUpdateApprovalRuleMutation,
  useDeleteApprovalRuleMutation,
  useGetPendingApprovalsQuery,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
} from '@store/api/approvalsApi';
import type { ApprovalRule, PendingApproval } from '@types/approval.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

export const useApprovalRules = (autoFetch = true) => {
  const { notifyError, notifySuccess } = useNotificationContext();

  const {
    data,
    isFetching,
    refetch,
    error: queryError,
  } = useGetApprovalRulesQuery(undefined, { skip: !autoFetch });

  const [createRuleMutation, { isLoading: isCreating }] = useCreateApprovalRuleMutation();
  const [updateRuleMutation, { isLoading: isUpdating }] = useUpdateApprovalRuleMutation();
  const [deleteRuleMutation, { isLoading: isDeleting }] = useDeleteApprovalRuleMutation();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryError) {
      const message = handleApiError(queryError);
      setError(message);
      notifyError(message);
    }
  }, [queryError, notifyError]);

  const saveRule = useCallback(
    async (payload: Partial<ApprovalRule>) => {
      try {
        const mutation = payload.id ? updateRuleMutation : createRuleMutation;
        await mutation(payload as ApprovalRule).unwrap();
        notifySuccess(payload.id ? 'Approval rule updated' : 'Approval rule created');
        await refetch();
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [createRuleMutation, notifyError, notifySuccess, refetch, updateRuleMutation],
  );

  const deleteRule = useCallback(
    async (id: string) => {
      try {
        await deleteRuleMutation(id).unwrap();
        notifySuccess('Approval rule removed');
        await refetch();
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [deleteRuleMutation, notifyError, notifySuccess, refetch],
  );

  const rules: ApprovalRule[] = useMemo(() => data?.rules ?? [], [data?.rules]);

  return {
    rules,
    loading: isFetching || isCreating || isUpdating || isDeleting,
    error,
    fetchRules: refetch,
    saveRule,
    deleteRule,
  };
};

export const usePendingApprovals = (autoFetch = true) => {
  const { notifyError, notifySuccess } = useNotificationContext();

  const {
    data,
    isFetching,
    refetch,
    error: queryError,
  } = useGetPendingApprovalsQuery(undefined, { skip: !autoFetch });

  const [approveMutation, { isLoading: isApproving }] = useApproveExpenseMutation();
  const [rejectMutation, { isLoading: isRejecting }] = useRejectExpenseMutation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryError) {
      const message = handleApiError(queryError);
      setError(message);
      notifyError(message);
    }
  }, [notifyError, queryError]);

  const approve = useCallback(
    async (approvalId: string, comments?: string) => {
      try {
        await approveMutation({ approvalId, comments }).unwrap();
        notifySuccess('Expense approved');
        await refetch();
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [approveMutation, notifyError, notifySuccess, refetch],
  );

  const reject = useCallback(
    async (approvalId: string, comments: string) => {
      try {
        await rejectMutation({ approvalId, comments }).unwrap();
        notifySuccess('Expense rejected');
        await refetch();
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [notifyError, notifySuccess, refetch, rejectMutation],
  );

  const pending: PendingApproval[] = useMemo(() => data?.pending ?? [], [data?.pending]);

  return {
    pending,
    loading: isFetching || isApproving || isRejecting,
    error,
    fetchPending: refetch,
    approve,
    reject,
  };
};
