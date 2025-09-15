import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
  Slide,
  Fab,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  QrCodeScanner,
  Search,
  ShoppingCart,
  Receipt,
  Person,
  Save,
  Send,
  CloudOff,
  CloudQueue,
  Check,
  Error,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import MobileBarcodeScanner from './MobileBarcodeScanner';
import { useMobilePWA, useOfflineStorage } from '../hooks/useMobilePWA';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileSalesEntry = ({ onSaveTransaction, onPrintReceipt }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isOnline, saveOfflineSalesEntry, getCachedData, handleBarcodeOffline, showNotification } =
    useMobilePWA();
  const { saveData, getData, searchByIndex } = useOfflineStorage();

  // Sales state
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10); // 10% default tax
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  // UI state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      const [cachedCustomers, cachedProducts] = await Promise.all([
        getCachedData('customers'),
        getCachedData('products'),
      ]);

      setCustomers(cachedCustomers || []);
      setProducts(cachedProducts || []);
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  };

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * tax) / 100;
    const total = subtotalAfterDiscount + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
    };
  }, [cartItems, discount, tax]);

  // Handle barcode scan
  const handleBarcodeResult = async result => {
    setScannerOpen(false);

    try {
      // First try to find in cached products
      let product = products.find(p => p.barcode === result.text);

      if (!product && !isOnline) {
        // Try offline barcode search
        product = await handleBarcodeOffline(result.text);
      }

      if (product) {
        addToCart(product);
        showAlert('Product added to cart', 'success');
      } else {
        showAlert('Product not found. Please add manually.', 'warning');
        setProductSearchOpen(true);
        setSearchQuery(result.text);
      }
    } catch (error) {
      showAlert('Failed to process barcode', 'error');
    }
  };

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);

      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = productId => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Process sale
  const processSale = async () => {
    if (cartItems.length === 0) {
      showAlert('Please add items to cart', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const totals = calculateTotals();
      const saleData = {
        id: Date.now(), // Temporary ID for offline
        items: cartItems,
        customer: customer,
        discount,
        tax,
        paymentMethod,
        notes,
        totals,
        timestamp: new Date().toISOString(),
        status: isOnline ? 'completed' : 'offline_pending',
      };

      if (isOnline) {
        // Process online
        await onSaveTransaction(saleData);
        showAlert('Sale completed successfully!', 'success');

        // Show notification
        await showNotification('Sale Completed', {
          body: `Sale of $${totals.total} completed successfully`,
          tag: 'sale-completed',
        });
      } else {
        // Save offline
        await saveOfflineSalesEntry(saleData);
        await saveData('sales', saleData);
        showAlert('Sale saved offline. Will sync when online.', 'info');

        // Show notification
        await showNotification('Sale Saved Offline', {
          body: `Sale of $${totals.total} saved. Will sync when online.`,
          tag: 'sale-offline',
        });
      }

      // Clear cart
      setCartItems([]);
      setCustomer(null);
      setDiscount(0);
      setNotes('');
    } catch (error) {
      console.error('Sale processing failed:', error);
      showAlert('Failed to process sale. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show alert
  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Swipe gestures for cart items
  const createSwipeHandlers = item =>
    useSwipeable({
      onSwipedLeft: () => removeFromCart(item.id),
      onSwipedRight: () => updateQuantity(item.id, item.quantity + 1),
      preventDefaultTouchmoveEvent: true,
      trackMouse: false,
    });

  const totals = calculateTotals();

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', pb: isMobile ? 7 : 0 }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Sales Entry</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isOnline && (
              <Chip
                icon={<CloudOff />}
                label="Offline"
                size="small"
                sx={{ bgcolor: 'warning.main', color: 'white' }}
              />
            )}
            <IconButton color="inherit" onClick={() => setScannerOpen(true)}>
              <QrCodeScanner />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Customer Section */}
      <Card sx={{ m: 2, mb: 1 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {customer ? customer.name : 'Walk-in Customer'}
                </Typography>
                {customer && (
                  <Typography variant="body2" color="text.secondary">
                    {customer.phone || customer.email}
                  </Typography>
                )}
              </Box>
            </Box>
            <Button variant="outlined" size="small" onClick={() => setCustomerSearchOpen(true)}>
              {customer ? 'Change' : 'Select'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Cart Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', mx: 2 }}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                pb: 1,
              }}
            >
              <Typography variant="h6">Cart ({cartItems.length} items)</Typography>
              <Button
                startIcon={<Add />}
                variant="outlined"
                size="small"
                onClick={() => setProductSearchOpen(true)}
              >
                Add Item
              </Button>
            </Box>

            <Divider />

            {cartItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scan barcode or add items manually
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      {...createSwipeHandlers(item)}
                    >
                      <ListItem>
                        <Avatar
                          src={item.image}
                          sx={{ mr: 2, width: 40, height: 40 }}
                          variant="rounded"
                        />
                        <ListItemText primary={item.name} secondary={`$${item.price} each`} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                          <Typography
                            variant="body1"
                            sx={{ minWidth: 60, textAlign: 'right', fontWeight: 'bold' }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < cartItems.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Totals Section */}
      {cartItems.length > 0 && (
        <Card sx={{ m: 2, mt: 1 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Discount (%)"
                  type="number"
                  value={discount}
                  onChange={e =>
                    setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))
                  }
                  size="small"
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tax (%)"
                  type="number"
                  value={tax}
                  onChange={e => setTax(Math.max(0, parseFloat(e.target.value) || 0))}
                  size="small"
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${totals.subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Discount:</Typography>
                <Typography>-${totals.discountAmount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>${totals.taxAmount}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${totals.total}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={processSale}
                disabled={isProcessing || cartItems.length === 0}
                startIcon={isOnline ? <Send /> : <Save />}
                sx={{ height: 48 }}
              >
                {isProcessing ? 'Processing...' : isOnline ? 'Complete Sale' : 'Save Offline'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Floating Scanner Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 20,
          right: 20,
        }}
        onClick={() => setScannerOpen(true)}
      >
        <QrCodeScanner />
      </Fab>

      {/* Barcode Scanner */}
      <MobileBarcodeScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanResult={handleBarcodeResult}
        title="Scan Product Barcode"
        description="Scan product barcode to add to cart"
      />

      {/* Customer Search Dialog */}
      <Dialog
        open={customerSearchOpen}
        onClose={() => setCustomerSearchOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>Select Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search customers"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <List>
            <ListItem
              button
              onClick={() => {
                setCustomer(null);
                setCustomerSearchOpen(false);
              }}
            >
              <ListItemText primary="Walk-in Customer" secondary="No customer information" />
            </ListItem>
            {customers
              .filter(
                c =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (c.phone && c.phone.includes(searchQuery))
              )
              .map(cust => (
                <ListItem
                  key={cust.id}
                  button
                  onClick={() => {
                    setCustomer(cust);
                    setCustomerSearchOpen(false);
                  }}
                >
                  <ListItemText primary={cust.name} secondary={cust.phone || cust.email} />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomerSearchOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Product Search Dialog */}
      <Dialog
        open={productSearchOpen}
        onClose={() => setProductSearchOpen(false)}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search products"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <List>
            {products
              .filter(
                p =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.barcode.includes(searchQuery)
              )
              .map(product => (
                <ListItem
                  key={product.id}
                  button
                  onClick={() => {
                    addToCart(product);
                    setProductSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Avatar src={product.image} sx={{ mr: 2 }} variant="rounded" />
                  <ListItemText
                    primary={product.name}
                    secondary={`${product.barcode} • $${product.price}`}
                  />
                  <Chip
                    label={`Stock: ${product.stock || 0}`}
                    color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                    size="small"
                  />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setProductSearchOpen(false);
              setSearchQuery('');
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MobileSalesEntry;
