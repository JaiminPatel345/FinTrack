import { ApiResponse } from '@types/common.types';
import { CreateUserFormData, UserListItem, UsersResponse } from '@types/user.types';
import { baseApi } from './baseApi';

type UpdateUserPayload = { id: string; data: Partial<CreateUserFormData> };
type AssignManagerPayload = { userId: string; managerId: string };

type UsersList = UsersResponse['data'];

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersList, void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
      transformResponse: (response: UsersResponse) => response.data,
    }),
    getUser: build.query<ApiResponse<UserListItem>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    createUser: build.mutation<ApiResponse<UserListItem>, CreateUserFormData>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: build.mutation<ApiResponse<UserListItem>, UpdateUserPayload>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id: 'LIST' },
        { type: 'User', id },
      ],
    }),
    deactivateUser: build.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id: 'LIST' },
        { type: 'User', id },
      ],
    }),
    sendPasswordEmail: build.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/users/${id}/send-password`,
        method: 'POST',
      }),
    }),
    assignManager: build.mutation<ApiResponse<UserListItem>, AssignManagerPayload>({
      query: ({ userId, managerId }) => ({
        url: `/users/${userId}/manager`,
        method: 'POST',
        body: { managerId },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'Users', id: 'LIST' },
        { type: 'User', id: userId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeactivateUserMutation,
  useSendPasswordEmailMutation,
  useAssignManagerMutation,
} = usersApi;
