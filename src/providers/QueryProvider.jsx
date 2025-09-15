import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../config/queryClient';

// Provider component for React Query
export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          toggleButtonProps={{
            style: {
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 99999,
            },
          }}
        />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;
