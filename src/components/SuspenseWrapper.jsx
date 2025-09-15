import React, { Suspense } from 'react';
import { Box, LinearProgress, Typography, Container } from '@mui/material';
import { PageLoading } from './LoadingComponents';

// Suspense wrapper with custom loading UI
export const SuspenseWrapper = ({ children, fallback = null }) => {
  const defaultFallback = (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
      >
        <Typography variant="h6" color="text.secondary">
          Loading page...
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <LinearProgress />
        </Box>
      </Box>
    </Container>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
};

// Page-specific suspense wrapper
export const PageSuspense = ({ children }) => (
  <SuspenseWrapper fallback={<PageLoading />}>{children}</SuspenseWrapper>
);

// Component-level suspense wrapper
export const ComponentSuspense = ({ children, height = '200px' }) => {
  const componentFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" height={height}>
      <LinearProgress sx={{ width: '60%' }} />
    </Box>
  );

  return <SuspenseWrapper fallback={componentFallback}>{children}</SuspenseWrapper>;
};

export default SuspenseWrapper;
