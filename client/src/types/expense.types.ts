export interface ExpenseFormData {
  description: string;
  amount: number;
  currency: string;
  categoryId: string;
  expenseDate: string;
  paidBy: 'cash' | 'card' | 'company_card';
  gstPercentage?: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
}

export interface Expense {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  description: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  companyCurrency?: string;
  categoryId: string;
  categoryName: string;
  expenseDate: string;
  paidBy: string;
  gstPercentage?: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected';
  ocrProcessed: boolean;
  ocrConfidence?: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface OCRResult {
  vendorName?: string;
  date?: string;
  totalAmount?: number;
  currency?: string;
  taxAmount?: number;
  confidence: {
    overall: number;
    vendorName: number;
    date: number;
    amount: number;
  };
}
