import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'ems-theme';

const resolveInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored) {
    return stored;
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

interface ThemeState {
  current: Theme;
}

const initialState: ThemeState = {
  current: resolveInitialTheme(),
};

const persistTheme = (theme: Theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.current = action.payload;
      persistTheme(action.payload);
    },
    toggleTheme: (state) => {
      state.current = state.current === 'dark' ? 'light' : 'dark';
      persistTheme(state.current);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.current;

export default themeReducer;
