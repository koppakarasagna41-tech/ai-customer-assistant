import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '../../hooks/useTheme';

export const ToastProvider: React.FC = () => {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '0.75rem',
          fontFamily: 'inherit',
        },
      }}
    />
  );
};
