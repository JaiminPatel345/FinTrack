import { ApprovalRuleType, ApprovalAction as ApprovalActionType } from './common.types';

export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  ruleType: ApprovalRuleType;
  isManagerApprover: boolean;
  percentageRequired?: number;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalStep {
  id: string;
  approvalRuleId: string;
  stepOrder: number;
  approverId: string;
  isAutoApprove: boolean;
}

export interface ExpenseApproval {
  id: string;
  expenseId: string;
  approvalRuleId: string;
  companyId: string;
  totalSteps: number;
  currentStep: number;
  status: ApprovalActionType;
  createdAt: Date;
  completedAt?: Date;
}

export interface ApprovalActionRecord {
  id: string;
  expenseApprovalId: string;
  stepOrder: number;
  approverId: string;
  action: ApprovalActionType;
  comments?: string;
  actionDate?: Date;
}

export interface CreateApprovalRuleRequest {
  name: string;
  description?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  ruleType: ApprovalRuleType;
  isManagerApprover: boolean;
  percentageRequired?: number;
  priority: number;
  approvers: {
    userId: string;
    stepOrder: number;
    isAutoApprove: boolean;
  }[];
}

export interface UpdateApprovalRuleRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  ruleType?: ApprovalRuleType;
  isManagerApprover?: boolean;
  percentageRequired?: number;
  priority?: number;
  isActive?: boolean;
  approvers?: {
    userId: string;
    stepOrder: number;
    isAutoApprove: boolean;
  }[];
}

export interface ApprovalRequestAction {
  action: 'approve' | 'reject';
  comments?: string;
}

export interface ExpenseApprovalDetails extends ExpenseApproval {
  expense: {
    id: string;
    description: string;
    amount: number;
    currency: string;
    convertedAmount: number;
    expenseDate: Date;
  };
  rule: {
    id: string;
    name: string;
    ruleType: ApprovalRuleType;
  };
  actions: {
    stepOrder: number;
    approver: {
      id: string;
      name: string;
      email: string;
    };
    action: ApprovalActionType;
    comments?: string;
    actionDate?: Date;
  }[];
}
