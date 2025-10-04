import apiClient from './apiClient';
import type { ApprovalRule, CreateApprovalRuleRequest, UpdateApprovalRuleRequest, ExpenseApproval } from '../types/approval.types';

export const approvalsService = {
  /**
   * Get all approval rules
   */
  getRules: async (): Promise<ApprovalRule[]> => {
    const response = await apiClient.get<{ data: ApprovalRule[] }>('/api/approvals/rules');
    return response.data.data;
  },

  /**
   * Get approval rule by ID
   */
  getRuleById: async (id: string): Promise<ApprovalRule> => {
    const response = await apiClient.get<{ data: ApprovalRule }>(`/api/approvals/rules/${id}`);
    return response.data.data;
  },

  /**
   * Create approval rule
   */
  createRule: async (data: CreateApprovalRuleRequest): Promise<ApprovalRule> => {
    const response = await apiClient.post<{ data: ApprovalRule }>('/api/approvals/rules', data);
    return response.data.data;
  },

  /**
   * Update approval rule
   */
  updateRule: async (id: string, data: UpdateApprovalRuleRequest): Promise<ApprovalRule> => {
    const response = await apiClient.put<{ data: ApprovalRule }>(`/api/approvals/rules/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete approval rule
   */
  deleteRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/approvals/rules/${id}`);
  },

  /**
   * Get pending approvals
   */
  getPendingApprovals: async (): Promise<ExpenseApproval[]> => {
    const response = await apiClient.get<{ data: ExpenseApproval[] }>('/api/approvals/pending');
    return response.data.data;
  },

  /**
   * Get approval by expense ID
   */
  getByExpenseId: async (expenseId: string): Promise<ExpenseApproval> => {
    const response = await apiClient.get<{ data: ExpenseApproval }>(`/api/approvals/expense/${expenseId}`);
    return response.data.data;
  },

  /**
   * Approve expense
   */
  approve: async (approvalId: string, comments?: string): Promise<ExpenseApproval> => {
    const response = await apiClient.post<{ data: ExpenseApproval }>(`/api/approvals/${approvalId}/approve`, { comments });
    return response.data.data;
  },

  /**
   * Reject expense
   */
  reject: async (approvalId: string, comments: string): Promise<ExpenseApproval> => {
    const response = await apiClient.post<{ data: ExpenseApproval }>(`/api/approvals/${approvalId}/reject`, { comments });
    return response.data.data;
  },

  /**
   * Get approval history
   */
  getHistory: async (expenseId: string): Promise<any[]> => {
    const response = await apiClient.get(`/api/approvals/expense/${expenseId}/history`);
    return response.data.data;
  },
};
