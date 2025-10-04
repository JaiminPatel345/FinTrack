import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectTheme, setTheme as setThemeAction, toggleTheme as toggleThemeAction, Theme } from '@store/slices/themeSlice';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
};

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const toggleTheme = React.useCallback(() => {
    dispatch(toggleThemeAction());
  }, [dispatch]);

  const setTheme = React.useCallback(
    (value: Theme) => {
      dispatch(setThemeAction(value));
    },
    [dispatch],
  );

  return {
    theme,
    toggleTheme,
    setTheme,
  };
};
