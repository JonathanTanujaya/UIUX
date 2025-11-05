import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavigationProvider } from '../../contexts/NavigationContext';
import TopNavbar from './TopNavbar';
import CommandPalette from './CommandPalette';

const DashboardLayout = () => {
  return (
    <NavigationProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Top Navigation Only */}
        <TopNavbar />

        {/* Main Content - Full Width without Sidebar */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          <Outlet />
        </Box>

        {/* Command Palette */}
        <CommandPalette />
      </Box>
    </NavigationProvider>
  );
};

export default DashboardLayout;
