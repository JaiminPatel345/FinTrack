// Approval Rule Types
export type ApprovalRuleType = 'sequential' | 'percentage' | 'specific_approver' | 'hybrid';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ApprovalAction = 'approved' | 'rejected';

export interface ApprovalRule {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  minAmount: number;
  maxAmount?: number;
  isManagerApprover: boolean;
  approvalType: ApprovalRuleType;
  minApprovalPercentage?: number;
  specificApproverId?: string;
  specificApproverName?: string;
  priority: number;
  isActive: boolean;
  companyId: string;
  steps: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStep {
  id: string;
  approvalRuleId: string;
  approverId: string;
  approverName?: string;
  approverEmail?: string;
  order: number;
  createdAt: string;
}

export interface ExpenseApproval {
  id: string;
  expenseId: string;
  approvalRuleId: string;
  currentStep: number;
  totalSteps: number;
  status: ApprovalStatus;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  actions: ApprovalActionItem[];
  expense?: any; // Can be typed as Expense if needed
}

export interface ApprovalActionItem {
  id: string;
  expenseApprovalId: string;
  approverId: string;
  approverName?: string;
  approverEmail?: string;
  stepOrder: number;
  action: ApprovalAction | null;
  comments?: string;
  actionDate?: string;
  createdAt: string;
}

export interface CreateApprovalRuleRequest {
  name: string;
  categoryId: string;
  minAmount: number;
  maxAmount?: number;
  isManagerApprover: boolean;
  approvalType: ApprovalRuleType;
  minApprovalPercentage?: number;
  specificApproverId?: string;
  priority?: number;
  steps: {
    approverId: string;
    order: number;
  }[];
}

export interface UpdateApprovalRuleRequest {
  name?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  isManagerApprover?: boolean;
  approvalType?: ApprovalRuleType;
  minApprovalPercentage?: number;
  specificApproverId?: string;
  priority?: number;
  isActive?: boolean;
  steps?: {
    approverId: string;
    order: number;
  }[];
}

export interface ApproveExpenseRequest {
  comments?: string;
}

export interface RejectExpenseRequest {
  comments: string;
}
