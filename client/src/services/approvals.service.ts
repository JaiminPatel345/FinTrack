import api from './api';
import { ApprovalRule, PendingApproval } from '@types/approval.types';

export const approvalsService = {
  // Get all approval rules
  getApprovalRules: async () => {
    const response = await api.get('/approval-rules');
    return response.data;
  },

  // Get approval rule by ID
  getApprovalRule: async (id: string) => {
    const response = await api.get(`/approval-rules/${id}`);
    return response.data;
  },

  // Create approval rule (Admin only)
  createApprovalRule: async (data: Omit<ApprovalRule, 'id' | 'companyId' | 'createdAt'>) => {
    const response = await api.post('/approval-rules', data);
    return response.data;
  },

  // Update approval rule
  updateApprovalRule: async (id: string, data: Partial<ApprovalRule>) => {
    const response = await api.put(`/approval-rules/${id}`, data);
    return response.data;
  },

  // Delete approval rule
  deleteApprovalRule: async (id: string) => {
    const response = await api.delete(`/approval-rules/${id}`);
    return response.data;
  },

  // Get pending approvals for current user
  getPendingApprovals: async () => {
    const response = await api.get('/approvals/pending');
    return response.data;
  },

  // Approve expense
  approveExpense: async (approvalId: string, comments?: string) => {
    const response = await api.post(`/approvals/${approvalId}/approve`, { comments });
    return response.data;
  },

  // Reject expense
  rejectExpense: async (approvalId: string, comments: string) => {
    const response = await api.post(`/approvals/${approvalId}/reject`, { comments });
    return response.data;
  },

  // Get approval details for expense
  getApprovalDetails: async (expenseId: string) => {
    const response = await api.get(`/approvals/${expenseId}`);
    return response.data;
  },
};
