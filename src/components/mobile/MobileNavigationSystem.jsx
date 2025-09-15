import React, { useState, useEffect } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fab,
  Box,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  Analytics,
  Settings,
  Menu,
  Add,
  QrCodeScanner,
  Sync,
  Notifications,
  Person,
  Store,
  Receipt,
  TrendingUp,
  Wifi,
  WifiOff,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileNavigationSystem = ({
  user,
  onScanBarcode,
  onQuickAdd,
  syncStatus,
  isOnline = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Bottom navigation items for mobile
  const bottomNavItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Stock', icon: <Inventory />, path: '/stock' },
    { label: 'Sales', icon: <ShoppingCart />, path: '/sales' },
    { label: 'Reports', icon: <Analytics />, path: '/reports' },
  ];

  // Main menu items for drawer
  const drawerItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Stock Management', icon: <Inventory />, path: '/stock' },
    { label: 'Sales Entry', icon: <ShoppingCart />, path: '/sales' },
    { label: 'Purchase Orders', icon: <Receipt />, path: '/purchase' },
    { label: 'Reports & Analytics', icon: <TrendingUp />, path: '/reports' },
    { label: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  // Update bottom nav based on current route
  useEffect(() => {
    const currentIndex = bottomNavItems.findIndex(item => location.pathname.startsWith(item.path));
    if (currentIndex !== -1) {
      setBottomNavValue(currentIndex);
    }
  }, [location.pathname]);

  // Monitor sync status
  useEffect(() => {
    if (syncStatus) {
      const totalPending =
        (syncStatus.salesQueue || 0) +
        (syncStatus.stockQueue || 0) +
        (syncStatus.purchaseQueue || 0);
      setPendingSyncCount(totalPending);
    }
  }, [syncStatus]);

  // Swipe gestures for drawer
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => setDrawerOpen(true),
    onSwipedLeft: () => setDrawerOpen(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    navigate(bottomNavItems[newValue].path);
  };

  const handleDrawerItemClick = path => {
    navigate(path);
    setDrawerOpen(false);
  };

  // Floating Action Button with speed dial functionality
  const FloatingActionMenu = () => {
    const [fabOpen, setFabOpen] = useState(false);

    const fabActions = [
      { icon: <QrCodeScanner />, label: 'Scan Barcode', action: onScanBarcode },
      { icon: <Add />, label: 'Quick Add', action: onQuickAdd },
      { icon: <Sync />, label: 'Sync Data', action: () => window.location.reload() },
    ];

    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 20,
          right: 20,
          zIndex: 1300,
        }}
      >
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {fabActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ marginBottom: 10 }}
                >
                  <Fab
                    size="small"
                    color="secondary"
                    onClick={() => {
                      action.action();
                      setFabOpen(false);
                    }}
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.light,
                      },
                    }}
                  >
                    {action.icon}
                  </Fab>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Fab
          color="primary"
          onClick={() => setFabOpen(!fabOpen)}
          sx={{
            transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <Add />
        </Fab>
      </Box>
    );
  };

  if (!isMobile) {
    // Desktop navigation
    return (
      <>
        <AppBar position="sticky" elevation={1}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Stoir
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isOnline && <WifiOff sx={{ color: 'error.main' }} />}

              {pendingSyncCount > 0 && (
                <Badge badgeContent={pendingSyncCount} color="warning">
                  <Sync />
                </Badge>
              )}

              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.charAt(0) || 'U'}</Avatar>
            </Box>
          </Toolbar>
        </AppBar>
        <FloatingActionMenu />
      </>
    );
  }

  // Mobile navigation
  return (
    <div {...swipeHandlers} style={{ height: '100%' }}>
      {/* Mobile App Bar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Stoir
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isOnline ? (
              <WifiOff sx={{ color: 'error.main', fontSize: 20 }} />
            ) : (
              <Wifi sx={{ color: 'success.main', fontSize: 20 }} />
            )}

            {pendingSyncCount > 0 && (
              <Badge badgeContent={pendingSyncCount} color="warning" max={99}>
                <Sync sx={{ fontSize: 20 }} />
              </Badge>
            )}

            <IconButton color="inherit" size="small">
              <Badge badgeContent={notificationCount} color="error" max={99}>
                <Notifications sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        value={bottomNavValue}
        onChange={handleBottomNavChange}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {bottomNavItems.map((item, index) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              color:
                index === bottomNavValue
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            }}
          />
        ))}
      </BottomNavigation>

      {/* Swipeable Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        disableSwipeToOpen={false}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main }}>
            <Store />
          </Avatar>
          <Box>
            <Typography variant="h6">Stoir</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user?.name || 'User'}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Online/Offline Status */}
        <Box
          sx={{
            p: 2,
            bgcolor: isOnline ? 'success.light' : 'warning.light',
            color: isOnline ? 'success.contrastText' : 'warning.contrastText',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isOnline ? <Wifi /> : <WifiOff />}
            <Typography variant="body2">{isOnline ? 'Online' : 'Offline Mode'}</Typography>
          </Box>
          {pendingSyncCount > 0 && (
            <Typography variant="caption">{pendingSyncCount} items pending sync</Typography>
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        <List sx={{ flexGrow: 1 }}>
          {drawerItems.map(item => (
            <ListItem
              key={item.label}
              button
              onClick={() => handleDrawerItemClick(item.path)}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.contrastText,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* User Profile Section */}
        <Box sx={{ p: 2 }}>
          <ListItem
            button
            onClick={() => handleDrawerItemClick('/profile')}
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" secondary={user?.email || 'user@stoir.com'} />
          </ListItem>
        </Box>
      </SwipeableDrawer>

      <FloatingActionMenu />

      {/* Bottom padding to account for bottom navigation */}
      <Box sx={{ height: 56 }} />
    </div>
  );
};

export default MobileNavigationSystem;
