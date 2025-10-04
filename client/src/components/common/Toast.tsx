import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastContainer: React.FC = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      style: {
        fontSize: '0.9rem',
      },
    }}
  />
);
