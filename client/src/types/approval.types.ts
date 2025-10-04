export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  isManagerApprover: boolean;
  ruleType: 'sequential' | 'percentage' | 'specific_approver' | 'hybrid';
  percentageRequired?: number;
  steps: ApprovalStep[];
  isActive: boolean;
  priority: number;
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  approvalRuleId: string;
  stepOrder: number;
  approverId?: string;
  approverName?: string;
  roleRequired?: string;
  isAutoApprove: boolean;
}

export interface ExpenseApproval {
  id: string;
  expenseId: string;
  approvalRuleId: string;
  currentStep: number;
  totalSteps: number;
  status: 'pending' | 'approved' | 'rejected';
  startedAt: string;
  completedAt?: string;
  actions: ApprovalAction[];
}

export interface ApprovalAction {
  id: string;
  expenseApprovalId: string;
  stepOrder: number;
  approverId: string;
  approverName: string;
  action: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionDate?: string;
}

export interface PendingApproval {
  approvalId?: string;
  expenseId: string;
  description: string;
  employeeName: string;
  categoryName: string;
  amount: number;
  convertedAmount: number;
  companyCurrency: string;
  expenseDate: string;
  submittedAt: string;
  currentStep: number;
  totalSteps: number;
  receiptUrl?: string;
}
