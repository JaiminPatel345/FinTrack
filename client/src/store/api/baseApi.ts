import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type RootStateAuthSlice = {
  auth?: {
    token?: string | null;
  };
};

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL ?? 'http://localhost:5000';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootStateAuthSlice;
      const token = state?.auth?.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: [
    'Auth',
    'Users',
    'User',
    'Expenses',
    'Expense',
    'Approvals',
    'Approval',
    'Currency',
    'Categories',
    'Dashboard',
  ],
  endpoints: () => ({}),
});
