import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, User } from '@types/auth.types';
import { authApi } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  hydrated: boolean;
}

type CredentialsPayload = {
  user: User;
  token: string;
};

const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'token';

const readInitialAuth = (): CredentialsPayload | null => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userRaw = localStorage.getItem(USER_STORAGE_KEY);
    if (!token || !userRaw) {
      return null;
    }
    const user = JSON.parse(userRaw) as User;
    return { token, user };
  } catch (error) {
    console.warn('Failed to read auth from storage', error);
    return null;
  }
};

const persistAuth = (payload: CredentialsPayload | null) => {
  if (!('localStorage' in globalThis)) {
    return;
  }

  if (!payload) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload.user));
};

const initialCredentials = typeof window !== 'undefined' ? readInitialAuth() : null;

const initialState: AuthState = {
  user: initialCredentials?.user ?? null,
  token: initialCredentials?.token ?? null,
  status: 'idle',
  error: null,
  hydrated: !initialCredentials,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      state.hydrated = true;
      persistAuth(action.payload);
    },
    setAuthStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
      if (action.payload === 'loading') {
        state.hydrated = false;
      }
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.status = 'failed';
        state.hydrated = true;
      }
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.hydrated = true;
      persistAuth(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          authApi.endpoints.signin.matchPending,
          authApi.endpoints.signup.matchPending,
          authApi.endpoints.verifyToken.matchPending,
          authApi.endpoints.refreshToken.matchPending,
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
          state.hydrated = false;
        },
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.signin.matchFulfilled,
          authApi.endpoints.signup.matchFulfilled,
          authApi.endpoints.refreshToken.matchFulfilled,
        ),
        (state, { payload }: { payload: AuthResponse }) => {
          const credentials = payload.data;
          state.user = credentials.user;
          state.token = credentials.token;
          state.status = 'succeeded';
          state.error = null;
          state.hydrated = true;
          persistAuth(credentials);
        },
      )
      .addMatcher(authApi.endpoints.verifyToken.matchFulfilled, (state, { payload }: { payload: AuthResponse }) => {
        state.user = payload.data.user;
        state.token = payload.data.token;
        state.status = 'succeeded';
        state.error = null;
        state.hydrated = true;
        persistAuth(payload.data);
      })
      .addMatcher(
        isAnyOf(
          authApi.endpoints.signin.matchRejected,
          authApi.endpoints.signup.matchRejected,
          authApi.endpoints.verifyToken.matchRejected,
          authApi.endpoints.refreshToken.matchRejected,
        ),
        (state, { error }) => {
          state.status = 'failed';
          state.error = error?.message ?? 'Authentication failed';
          state.hydrated = true;
        },
      );
  },
});

export const { setCredentials, clearCredentials, setAuthStatus, setAuthError, setHydrated } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.token && state.auth.user);
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;

export default authReducer;
