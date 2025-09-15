import React from 'react';
import { Box, CircularProgress, Typography, Paper, Skeleton, Stack } from '@mui/material';

// Loading Spinner Component
export const LoadingSpinner = ({ message = 'Loading...', size = 40 }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight={200}
    gap={2}
  >
    <CircularProgress size={size} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Page Loading Component
export const PageLoading = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
    <Paper sx={{ p: 3, mb: 3 }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Stack spacing={1}>
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} width="80%" />
        <Skeleton variant="text" height={20} width="60%" />
      </Stack>
    </Paper>
    <Paper sx={{ p: 3 }}>
      <Skeleton variant="text" width="25%" height={30} sx={{ mb: 2 }} />
      <Stack spacing={1}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} display="flex" gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box flexGrow={1}>
              <Skeleton variant="text" height={20} width="40%" />
              <Skeleton variant="text" height={16} width="60%" />
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  </Box>
);

// Table Loading Component
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <Paper sx={{ p: 2 }}>
    <Stack spacing={1}>
      {/* Header */}
      <Box display="flex" gap={2}>
        {[...Array(columns)].map((_, index) => (
          <Skeleton key={index} variant="text" height={30} width={`${100 / columns}%`} />
        ))}
      </Box>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <Box key={rowIndex} display="flex" gap={2}>
          {[...Array(columns)].map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height={25} width={`${100 / columns}%`} />
          ))}
        </Box>
      ))}
    </Stack>
  </Paper>
);

// Form Loading Component
export const FormLoading = () => (
  <Paper sx={{ p: 3 }}>
    <Stack spacing={3}>
      <Skeleton variant="text" width="30%" height={30} />
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2}>
        {[...Array(6)].map((_, index) => (
          <Box key={index}>
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} />
          </Box>
        ))}
      </Box>
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Stack>
  </Paper>
);

export default LoadingSpinner;
