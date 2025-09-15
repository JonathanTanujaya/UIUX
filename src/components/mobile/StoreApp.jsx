import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mobile Components
import MobileNavigationSystem from './components/mobile/MobileNavigationSystem';
import MobileStockManager from './components/mobile/MobileStockManager';
import MobileSalesEntry from './components/mobile/MobileSalesEntry';
import MobileBarcodeScanner from './components/mobile/MobileBarcodeScanner';

// Hooks
import { useMobilePWA, useOfflineStorage } from './hooks/useMobilePWA';

// Create mobile-first theme
const createMobileTheme = prefersDarkMode =>
  createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: prefersDarkMode ? '#121212' : '#f5f5f5',
        paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      // Mobile-optimized typography
      h1: { fontSize: '2rem' },
      h2: { fontSize: '1.75rem' },
      h3: { fontSize: '1.5rem' },
      h4: { fontSize: '1.25rem' },
      h5: { fontSize: '1.1rem' },
      h6: { fontSize: '1rem' },
      body1: { fontSize: '0.875rem' },
      body2: { fontSize: '0.75rem' },
    },
    components: {
      // Mobile-optimized component overrides
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: '44px', // Touch-friendly minimum height
            borderRadius: '8px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              minHeight: '44px',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

const StoreApp = () => {
  // Theme detection
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createMobileTheme(prefersDarkMode);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // PWA hooks
  const {
    isOnline,
    isInstalled,
    installPrompt,
    updateAvailable,
    syncStatus,
    installPWA,
    updateServiceWorker,
    cacheData,
    showNotification,
  } = useMobilePWA();

  const { saveData, getData, isReady: dbReady } = useOfflineStorage();

  // App state
  const [user] = useState({
    name: 'Store Manager',
    email: 'manager@stoir.com',
    role: 'admin',
  });
  const [installDialogOpen, setInstallDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load initial data
        await loadInitialData();

        // Show install prompt if available
        if (installPrompt && !isInstalled && isMobile) {
          setTimeout(() => setInstallDialogOpen(true), 3000);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [installPrompt, isInstalled, isMobile]);

  // Handle app updates
  useEffect(() => {
    if (updateAvailable) {
      setUpdateDialogOpen(true);
    }
  }, [updateAvailable]);

  // Load initial data and cache it
  const loadInitialData = async () => {
    try {
      // Mock data - in real app, this would come from API
      const mockProducts = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        barcode: `123456789${String(i + 1).padStart(3, '0')}`,
        price: (Math.random() * 100 + 10).toFixed(2),
        stock: Math.floor(Math.random() * 100),
        category: ['electronics', 'clothing', 'food', 'books'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/200/200?random=${i + 1}`,
      }));

      const mockCustomers = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
      }));

      // Cache data for offline use
      await cacheData('products', mockProducts);
      await cacheData('customers', mockCustomers);

      // Store in IndexedDB
      if (dbReady) {
        await saveData('products', mockProducts);
        await saveData('customers', mockCustomers);
      }

      console.log('Initial data loaded and cached');
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  // Handle PWA installation
  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setInstallDialogOpen(false);
      await showNotification('App Installed', {
        body: 'Stoir has been installed on your device!',
        tag: 'app-installed',
      });
    }
  };

  // Handle app update
  const handleUpdate = () => {
    updateServiceWorker();
    setUpdateDialogOpen(false);
  };

  // Handle barcode scanning
  const handleScanBarcode = () => {
    // This will be handled by individual components
    console.log('Global barcode scan requested');
  };

  // Handle quick add
  const handleQuickAdd = () => {
    // Navigate to add product or show quick add dialog
    console.log('Quick add requested');
  };

  // Handle transaction save
  const handleSaveTransaction = async transactionData => {
    try {
      if (isOnline) {
        // In real app, send to API
        console.log('Saving transaction online:', transactionData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success notification
        await showNotification('Transaction Saved', {
          body: `Sale of $${transactionData.totals.total} completed`,
          tag: 'transaction-saved',
        });
      } else {
        // Handle offline - already handled in component
        console.log('Transaction saved offline:', transactionData);
      }
    } catch (error) {
      console.error('Failed to save transaction:', error);
      throw error;
    }
  };

  // Add notification
  const addNotification = (message, severity = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      severity,
      timestamp: new Date(),
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Connection status effect
  useEffect(() => {
    if (isOnline) {
      addNotification('Connected to internet', 'success');
    } else {
      addNotification('Working offline', 'warning');
    }
  }, [isOnline]);

  // Loading screen
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Stoir
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Loading your store...
        </Typography>
        <LinearProgress sx={{ width: '60%', mb: 2 }} />
        <Typography variant="caption">
          {isOnline ? 'Syncing data...' : 'Loading offline data...'}
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Navigation */}
          <MobileNavigationSystem
            user={user}
            onScanBarcode={handleScanBarcode}
            onQuickAdd={handleQuickAdd}
            syncStatus={syncStatus}
            isOnline={isOnline}
          />

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route
                  path="/dashboard"
                  element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h4" gutterBottom>
                          Dashboard
                        </Typography>
                        <Typography variant="body1">
                          Welcome to your mobile store management system!
                        </Typography>
                      </Box>
                    </motion.div>
                  }
                />

                <Route
                  path="/stock"
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MobileStockManager
                        onAddProduct={() => console.log('Add product')}
                        onEditProduct={product => console.log('Edit product:', product)}
                        onViewProduct={product => console.log('View product:', product)}
                        onScanBarcode={() => console.log('Scan barcode')}
                      />
                    </motion.div>
                  }
                />

                <Route
                  path="/sales"
                  element={
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MobileSalesEntry
                        onSaveTransaction={handleSaveTransaction}
                        onPrintReceipt={receipt => console.log('Print receipt:', receipt)}
                      />
                    </motion.div>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h4" gutterBottom>
                          Reports
                        </Typography>
                        <Typography variant="body1">
                          Sales analytics and reports coming soon...
                        </Typography>
                      </Box>
                    </motion.div>
                  }
                />
              </Routes>
            </AnimatePresence>
          </Box>

          {/* Notifications */}
          <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 2000 }}>
            <AnimatePresence>
              {notifications.map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginBottom: 8 }}
                >
                  <Alert
                    severity={notification.severity}
                    onClose={() =>
                      setNotifications(prev => prev.filter(n => n.id !== notification.id))
                    }
                    sx={{ minWidth: 280 }}
                  >
                    {notification.message}
                  </Alert>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          {/* Install Dialog */}
          <Dialog
            open={installDialogOpen}
            onClose={() => setInstallDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Install Stoir App</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                Install Stoir on your device for the best mobile experience:
              </Typography>
              <ul>
                <li>Quick access from your home screen</li>
                <li>Work offline with automatic sync</li>
                <li>Fast performance and smooth animations</li>
                <li>Push notifications for important updates</li>
              </ul>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setInstallDialogOpen(false)}>Maybe Later</Button>
              <Button onClick={handleInstall} variant="contained">
                Install Now
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update Dialog */}
          <Dialog
            open={updateDialogOpen}
            onClose={() => setUpdateDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>App Update Available</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                A new version of Stoir is available with improvements and bug fixes. Update now to
                get the latest features.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateDialogOpen(false)}>Later</Button>
              <Button onClick={handleUpdate} variant="contained">
                Update Now
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default StoreApp;
