import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavigationProvider } from '../../contexts/NavigationContext';
import TopNavbar from './TopNavbar';
import ContextualSidebar from './ContextualSidebar';

const ModernLayout = () => {
  return (
    <NavigationProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Top Navigation */}
        <TopNavbar />

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Contextual Sidebar */}
          <ContextualSidebar />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flex: 1,
              overflow: 'hidden',
              backgroundColor: 'background.default',
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </NavigationProvider>
  );
};

export default Layout;
