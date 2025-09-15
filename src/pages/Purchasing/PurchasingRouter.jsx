// Purchasing navigation and routing
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Paper, Tabs, Tab, Badge } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

// Import purchasing components
import PurchaseRequestForm from './PurchaseRequestForm';
import PurchaseOrderManagement from './PurchaseOrderManagement';
import GoodsReceiving from './GoodsReceiving';
import SupplierDashboard from './SupplierDashboard';

// Import service functions
import { purchasingAPI } from '../../services/api';

const PurchasingRouter = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  // Fetch notification counts for badges
  const { data: notifications = {} } = useQuery({
    queryKey: ['purchasingNotifications'],
    queryFn: () => purchasingAPI.getNotificationCounts(),
    refetchInterval: 30000, // Refresh every 30 seconds
    select: data => data.data || {},
  });

  const tabs = [
    {
      label: 'Purchase Requests',
      path: '/purchasing/requests',
      component: PurchaseRequestForm,
      badge: notifications.pendingRequests || 0,
    },
    {
      label: 'Purchase Orders',
      path: '/purchasing/orders',
      component: PurchaseOrderManagement,
      badge: notifications.pendingApprovals || 0,
    },
    {
      label: 'Goods Receiving',
      path: '/purchasing/receiving',
      component: GoodsReceiving,
      badge: notifications.pendingReceiving || 0,
    },
    {
      label: 'Supplier Dashboard',
      path: '/purchasing/suppliers',
      component: SupplierDashboard,
      badge: notifications.supplierAlerts || 0,
    },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Navigation Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.path}
              label={
                tab.badge > 0 ? (
                  <Badge badgeContent={tab.badge} color="error">
                    {tab.label}
                  </Badge>
                ) : (
                  tab.label
                )
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {tabs.map((tab, index) => (
          <Box
            key={tab.path}
            role="tabpanel"
            hidden={currentTab !== index}
            sx={{ display: currentTab === index ? 'block' : 'none' }}
          >
            <tab.component />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PurchasingRouter;
