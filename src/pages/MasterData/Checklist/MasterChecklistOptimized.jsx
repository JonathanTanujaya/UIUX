import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert
} from '@mui/material';
import {
  Construction as ConstructionIcon
} from '@mui/icons-material';

const MasterChecklistOptimized = () => {
  return (
    <Box sx={{ width: '100%', px: 3, pb: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <ConstructionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Halaman checklist sedang dalam pengembangan.
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body2">
              Fitur checklist akan segera tersedia. Saat ini belum ada endpoint API yang tersedia untuk module ini.
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Box>
  );
};

export default MasterChecklistOptimized;
