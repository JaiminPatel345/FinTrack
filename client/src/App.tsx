import React from 'react';
import AppRoutes from './routes';
import { ThemeProvider } from '@context/ThemeContext';
import { NotificationProvider } from '@context/NotificationContext';
import { AuthProvider } from '@context/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
