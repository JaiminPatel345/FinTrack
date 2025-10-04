import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { approvalsService } from '../../services/approvals.service';
import type { ApprovalRule, ExpenseApproval } from '../../types/approval.types';
import { getErrorMessage } from '../../utils/helpers';

interface ApprovalsState {
  rules: ApprovalRule[];
  pendingApprovals: ExpenseApproval[];
  selectedRule: ApprovalRule | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ApprovalsState = {
  rules: [],
  pendingApprovals: [],
  selectedRule: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchApprovalRules = createAsyncThunk(
  'approvals/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      return await approvalsService.getRules();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createApprovalRule = createAsyncThunk(
  'approvals/createRule',
  async (data: any, { rejectWithValue }) => {
    try {
      return await approvalsService.createRule(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateApprovalRule = createAsyncThunk(
  'approvals/updateRule',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      return await approvalsService.updateRule(id, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteApprovalRule = createAsyncThunk(
  'approvals/deleteRule',
  async (id: string, { rejectWithValue }) => {
    try {
      await approvalsService.deleteRule(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPendingApprovals = createAsyncThunk(
  'approvals/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      return await approvalsService.getPendingApprovals();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const approveExpense = createAsyncThunk(
  'approvals/approve',
  async ({ approvalId, comments }: { approvalId: string; comments?: string }, { rejectWithValue }) => {
    try {
      return await approvalsService.approve(approvalId, comments);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const rejectExpense = createAsyncThunk(
  'approvals/reject',
  async ({ approvalId, comments }: { approvalId: string; comments: string }, { rejectWithValue }) => {
    try {
      return await approvalsService.reject(approvalId, comments);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const approvalsSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    setSelectedRule: (state, action: PayloadAction<ApprovalRule | null>) => {
      state.selectedRule = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rules
      .addCase(fetchApprovalRules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApprovalRules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rules = action.payload;
      })
      .addCase(fetchApprovalRules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Rule
      .addCase(createApprovalRule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createApprovalRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rules.push(action.payload);
      })
      .addCase(createApprovalRule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Rule
      .addCase(updateApprovalRule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateApprovalRule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.rules.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.rules[index] = action.payload;
        }
      })
      .addCase(updateApprovalRule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Rule
      .addCase(deleteApprovalRule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteApprovalRule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rules = state.rules.filter(r => r.id !== action.payload);
      })
      .addCase(deleteApprovalRule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Pending Approvals
      .addCase(fetchPendingApprovals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingApprovals = action.payload;
      })
      .addCase(fetchPendingApprovals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Approve Expense
      .addCase(approveExpense.fulfilled, (state, action) => {
        const index = state.pendingApprovals.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.pendingApprovals[index] = action.payload;
        }
      })
      // Reject Expense
      .addCase(rejectExpense.fulfilled, (state, action) => {
        const index = state.pendingApprovals.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.pendingApprovals[index] = action.payload;
        }
      });
  },
});

export const { setSelectedRule, clearError } = approvalsSlice.actions;
export default approvalsSlice.reducer;
