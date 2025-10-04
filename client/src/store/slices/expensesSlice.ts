import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { expensesService } from '../../services/expenses.service';
import type { Expense, ExpenseCategory } from '../../types/expense.types';
import { getErrorMessage } from '../../utils/helpers';

interface ExpensesState {
  expenses: Expense[];
  categories: ExpenseCategory[];
  selectedExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const initialState: ExpensesState = {
  expenses: [],
  categories: [],
  selectedExpense: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

// Async Thunks
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (params: any, { rejectWithValue }) => {
    try {
      return await expensesService.getAll(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await expensesService.getById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (data: any, { rejectWithValue }) => {
    try {
      return await expensesService.create(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      return await expensesService.update(id, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const submitExpense = createAsyncThunk(
  'expenses/submit',
  async (id: string, { rejectWithValue }) => {
    try {
      return await expensesService.submit(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'expenses/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await expensesService.getCategories();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setSelectedExpense: (state, action: PayloadAction<Expense | null>) => {
      state.selectedExpense = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload.expenses;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Expense By ID
      .addCase(fetchExpenseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedExpense = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Expense
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Submit Expense
      .addCase(submitExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      })
      .addCase(submitExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setSelectedExpense, clearError } = expensesSlice.actions;
export default expensesSlice.reducer;
