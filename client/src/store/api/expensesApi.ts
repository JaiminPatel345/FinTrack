import { ApiResponse } from '@types/common.types';
import { Category, Expense, ExpenseFormData } from '@types/expense.types';
import { baseApi } from './baseApi';

type ExpenseQueryParams = {
  status?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

type ExpenseListResponse = ApiResponse<{
  expenses: Expense[];
  total: number;
}>;

type ExpenseResponse = ApiResponse<Expense>;

type CategoriesResponse = ApiResponse<{ categories: Category[] }>;

type UpdateExpensePayload = { id: string; data: Partial<ExpenseFormData> };

type CreateCategoryPayload = { name: string; description?: string };

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExpenses: build.query<ExpenseListResponse['data'], ExpenseQueryParams | void>({
      query: (params) => ({
        url: '/expenses',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.expenses
          ? [
              ...result.expenses.map(({ id }) => ({ type: 'Expense' as const, id })),
              { type: 'Expenses' as const, id: 'LIST' },
            ]
          : [{ type: 'Expenses' as const, id: 'LIST' }],
      transformResponse: (response: ExpenseListResponse) => response.data,
    }),
    getExpense: build.query<ExpenseResponse['data'], string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Expense', id }],
      transformResponse: (response: ExpenseResponse) => response.data,
    }),
    createExpense: build.mutation<ExpenseResponse['data'], ExpenseFormData>({
      query: (body) => ({
        url: '/expenses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
      transformResponse: (response: ExpenseResponse) => response.data,
    }),
    updateExpense: build.mutation<ExpenseResponse['data'], UpdateExpensePayload>({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Expenses', id: 'LIST' },
        { type: 'Expense', id },
      ],
      transformResponse: (response: ExpenseResponse) => response.data,
    }),
    deleteExpense: build.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Expenses', id: 'LIST' },
        { type: 'Expense', id },
      ],
    }),
    submitExpense: build.mutation<ApiResponse<Expense>, string>({
      query: (id) => ({
        url: `/expenses/${id}/submit`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Expenses', id: 'LIST' },
        { type: 'Expense', id },
        { type: 'Approvals', id: 'LIST' },
      ],
    }),
    getExpenseHistory: build.query<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/expenses/${id}/history`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Expense', id }],
    }),
    getCategories: build.query<CategoriesResponse['data'], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: [{ type: 'Categories', id: 'LIST' }],
      transformResponse: (response: CategoriesResponse) => response.data,
    }),
    createCategory: build.mutation<CategoriesResponse['data'], CreateCategoryPayload>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
      transformResponse: (response: CategoriesResponse) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExpensesQuery,
  useLazyGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useSubmitExpenseMutation,
  useGetExpenseHistoryQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = expensesApi;
