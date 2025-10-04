import { ApiResponse } from '@types/common.types';
import { ApprovalRule, ExpenseApproval, PendingApproval } from '@types/approval.types';
import { baseApi } from './baseApi';

type SaveRulePayload = Partial<ApprovalRule> & { id?: string };

type ApprovePayload = { approvalId: string; comments?: string };

type RejectPayload = { approvalId: string; comments: string };

export const approvalsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getApprovalRules: build.query<ApiResponse<{ rules: ApprovalRule[] }>['data'], void>({
      query: () => ({
        url: '/approval-rules',
        method: 'GET',
      }),
      providesTags: [{ type: 'Approvals', id: 'RULES' }],
      transformResponse: (response: ApiResponse<{ rules: ApprovalRule[] }>) => response.data,
    }),
    getApprovalRule: build.query<ApiResponse<ApprovalRule>['data'], string>({
      query: (id) => ({
        url: `/approval-rules/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Approvals', id }],
      transformResponse: (response: ApiResponse<ApprovalRule>) => response.data,
    }),
    createApprovalRule: build.mutation<ApiResponse<ApprovalRule>['data'], SaveRulePayload>({
      query: (body) => ({
        url: '/approval-rules',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Approvals', id: 'RULES' }],
      transformResponse: (response: ApiResponse<ApprovalRule>) => response.data,
    }),
    updateApprovalRule: build.mutation<ApiResponse<ApprovalRule>['data'], SaveRulePayload>({
      query: ({ id, ...body }) => ({
        url: `/approval-rules/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Approvals', id: 'RULES' },
        id ? { type: 'Approvals', id } : { type: 'Approvals', id: 'RULES' },
      ],
      transformResponse: (response: ApiResponse<ApprovalRule>) => response.data,
    }),
    deleteApprovalRule: build.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/approval-rules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Approvals', id: 'RULES' }],
    }),
    getPendingApprovals: build.query<ApiResponse<{ pending: PendingApproval[] }>['data'], void>({
      query: () => ({
        url: '/approvals/pending',
        method: 'GET',
      }),
      providesTags: [{ type: 'Approvals', id: 'PENDING' }],
      transformResponse: (response: ApiResponse<{ pending: PendingApproval[] }>) => response.data,
    }),
    approveExpense: build.mutation<ApiResponse<ExpenseApproval>['data'], ApprovePayload>({
      query: ({ approvalId, comments }) => ({
        url: `/approvals/${approvalId}/approve`,
        method: 'POST',
        body: { comments },
      }),
      invalidatesTags: [{ type: 'Approvals', id: 'PENDING' }, { type: 'Expenses', id: 'LIST' }],
      transformResponse: (response: ApiResponse<ExpenseApproval>) => response.data,
    }),
    rejectExpense: build.mutation<ApiResponse<ExpenseApproval>['data'], RejectPayload>({
      query: ({ approvalId, comments }) => ({
        url: `/approvals/${approvalId}/reject`,
        method: 'POST',
        body: { comments },
      }),
      invalidatesTags: [{ type: 'Approvals', id: 'PENDING' }, { type: 'Expenses', id: 'LIST' }],
      transformResponse: (response: ApiResponse<ExpenseApproval>) => response.data,
    }),
    getApprovalDetails: build.query<ApiResponse<ExpenseApproval>['data'], string>({
      query: (expenseId) => ({
        url: `/approvals/${expenseId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, expenseId) => [{ type: 'Approvals', id: expenseId }],
      transformResponse: (response: ApiResponse<ExpenseApproval>) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetApprovalRulesQuery,
  useGetApprovalRuleQuery,
  useCreateApprovalRuleMutation,
  useUpdateApprovalRuleMutation,
  useDeleteApprovalRuleMutation,
  useGetPendingApprovalsQuery,
  useApproveExpenseMutation,
  useRejectExpenseMutation,
  useGetApprovalDetailsQuery,
} = approvalsApi;
