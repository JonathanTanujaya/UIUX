import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Divider,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
} from '@mui/material';
import {
  QrCodeScanner,
  Add,
  Remove,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Save,
  History,
  Warning,
  CheckCircle,
  Error,
  Notifications,
  NotificationsActive,
  Vibration,
  CameraAlt,
  FlashOn,
  FlashOff,
  ExpandMore,
  Close,
  Settings,
  Inventory,
  Search,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import StockEngine from '../../services/StockEngine';

const BarcodeStockScanner = ({ onStockUpdate, onProductScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [operation, setOperation] = useState('ADD'); // ADD, REMOVE, COUNT
  const [location, setLocation] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [cameraPermission, setCameraPermission] = useState('prompt');

  const scannerRef = useRef(null);
  const html5QrcodeScanner = useRef(null);
  const stockEngine = useRef(new StockEngine());
  const audioContext = useRef(null);

  useEffect(() => {
    initializeScanner();
    loadProducts();
    requestPermissions();

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [scanning]);

  const initializeScanner = () => {
    try {
      // Initialize audio context for beep sounds
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setCameraPermission('granted');
      stream.getTracks().forEach(track => track.stop());

      // Request notification permission
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setCameraPermission('denied');
    }
  };

  const loadProducts = async () => {
    try {
      // Mock API call - replace with actual backend call
      const mockProducts = [
        {
          id: 1,
          name: 'Product A',
          barcode: '1234567890123',
          currentStock: 45,
          location: 'Warehouse A',
          unitCost: 100,
          category: 'Electronics',
        },
        {
          id: 2,
          name: 'Product B',
          barcode: '2345678901234',
          currentStock: 120,
          location: 'Warehouse B',
          unitCost: 200,
          category: 'Tools',
        },
        {
          id: 3,
          name: 'Product C',
          barcode: '3456789012345',
          currentStock: 0,
          location: 'Warehouse A',
          unitCost: 50,
          category: 'Consumables',
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const startScanning = () => {
    if (cameraPermission !== 'granted') {
      addNotification('Camera permission required for scanning', 'error');
      return;
    }

    try {
      html5QrcodeScanner.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanner.SCAN_TYPE_CAMERA],
        },
        false
      );

      html5QrcodeScanner.current.render(
        (decodedText, decodedResult) => {
          handleScanSuccess(decodedText, decodedResult);
        },
        error => {
          // Handle scan failure (usually can be ignored)
          // console.warn('Scan error:', error);
        }
      );

      setScanning(true);
      addNotification('Scanner started', 'success');
    } catch (error) {
      console.error('Failed to start scanner:', error);
      addNotification('Failed to start scanner', 'error');
    }
  };

  const stopScanning = () => {
    try {
      if (html5QrcodeScanner.current) {
        html5QrcodeScanner.current.clear();
        html5QrcodeScanner.current = null;
      }
      setScanning(false);
      addNotification('Scanner stopped', 'info');
    } catch (error) {
      console.error('Failed to stop scanner:', error);
    }
  };

  const cleanup = () => {
    stopScanning();
    if (audioContext.current) {
      audioContext.current.close();
    }
  };

  const handleScanSuccess = async (decodedText, decodedResult) => {
    try {
      setScanResult(decodedText);

      // Play success sound
      if (soundEnabled) {
        playSuccessSound();
      }

      // Vibrate if enabled and supported
      if (vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }

      // Find product by barcode
      const product = products.find(p => p.barcode === decodedText);

      if (product) {
        setCurrentProduct(product);
        await processStockOperation(product);

        // Add to scan history
        const historyEntry = {
          id: Date.now(),
          barcode: decodedText,
          product: product,
          operation: operation,
          quantity: quantity,
          timestamp: new Date().toISOString(),
          location: location,
        };

        setScanHistory(prev => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 scans

        // Notify parent components
        if (onProductScanned) {
          onProductScanned(product, operation, quantity);
        }

        addNotification(`${operation}: ${product.name} (${quantity})`, 'success');

        // Auto-continue scanning in continuous mode
        if (!continuousMode) {
          setDialogOpen(true);
        }
      } else {
        addNotification(`Product not found: ${decodedText}`, 'warning');
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to process scan result:', error);
      addNotification('Failed to process scan result', 'error');
    }
  };

  const processStockOperation = async product => {
    try {
      let updatedStock = product.currentStock;

      switch (operation) {
        case 'ADD':
          updatedStock += quantity;
          break;
        case 'REMOVE':
          updatedStock = Math.max(0, updatedStock - quantity);
          break;
        case 'COUNT':
          updatedStock = quantity;
          break;
        default:
          return;
      }

      // Update local product data
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? { ...p, currentStock: updatedStock } : p))
      );

      // Notify parent component
      if (onStockUpdate) {
        onStockUpdate({
          productId: product.id,
          oldStock: product.currentStock,
          newStock: updatedStock,
          operation,
          quantity,
          location,
          timestamp: new Date().toISOString(),
        });
      }

      // Post to backend (mock)
      await fetch('/api/stock/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          operation,
          quantity,
          location,
          barcode: product.barcode,
        }),
      });

      // Check for low stock alerts
      const reorderPoint = await stockEngine.current.calculateReorderPoint({
        id: product.id,
        averageDemand: 10, // Mock data
        leadTime: 7,
        serviceLevel: 0.95,
      });

      if (updatedStock <= reorderPoint) {
        addNotification(`Low stock alert: ${product.name} (${updatedStock} remaining)`, 'warning');

        // Send system notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Low Stock Alert', {
            body: `${product.name} is below reorder point`,
            icon: '/favicon.ico',
          });
        }
      }
    } catch (error) {
      console.error('Failed to process stock operation:', error);
      addNotification('Failed to update stock', 'error');
    }
  };

  const playSuccessSound = () => {
    try {
      if (!audioContext.current) return;

      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.2);

      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + 0.2);
    } catch (error) {
      console.warn('Failed to play success sound:', error);
    }
  };

  const addNotification = (message, severity = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      severity,
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = id => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearScanHistory = () => {
    setScanHistory([]);
    addNotification('Scan history cleared', 'info');
  };

  const getSeverityColor = severity => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const getOperationIcon = op => {
    switch (op) {
      case 'ADD':
        return <Add color="success" />;
      case 'REMOVE':
        return <Remove color="error" />;
      case 'COUNT':
        return <Inventory color="primary" />;
      default:
        return <Search />;
    }
  };

  const renderScanner = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Barcode Scanner</Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Settings">
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Scan History">
              <IconButton onClick={() => setHistoryOpen(true)}>
                <Badge badgeContent={scanHistory.length} color="primary">
                  <History />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Scanner Controls */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Operation</InputLabel>
              <Select value={operation} onChange={e => setOperation(e.target.value)}>
                <MenuItem value="ADD">Add Stock</MenuItem>
                <MenuItem value="REMOVE">Remove Stock</MenuItem>
                <MenuItem value="COUNT">Stock Count</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select value={location} onChange={e => setLocation(e.target.value)}>
                <MenuItem value="">Select Location</MenuItem>
                <MenuItem value="Warehouse A">Warehouse A</MenuItem>
                <MenuItem value="Warehouse B">Warehouse B</MenuItem>
                <MenuItem value="Store Front">Store Front</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant={scanning ? 'contained' : 'outlined'}
              color={scanning ? 'error' : 'primary'}
              onClick={() => setScanning(!scanning)}
              startIcon={scanning ? <Stop /> : <PlayArrow />}
              disabled={cameraPermission !== 'granted'}
            >
              {scanning ? 'Stop' : 'Start'} Scan
            </Button>
          </Grid>
        </Grid>

        {/* Scanner Options */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={continuousMode}
                  onChange={e => setContinuousMode(e.target.checked)}
                  size="small"
                />
              }
              label="Continuous"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={batchMode}
                  onChange={e => setBatchMode(e.target.checked)}
                  size="small"
                />
              }
              label="Batch Mode"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={soundEnabled}
                  onChange={e => setSoundEnabled(e.target.checked)}
                  size="small"
                />
              }
              label="Sound"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={vibrationEnabled}
                  onChange={e => setVibrationEnabled(e.target.checked)}
                  size="small"
                />
              }
              label="Vibration"
            />
          </Grid>
        </Grid>

        {/* Camera Permission Alert */}
        {cameraPermission !== 'granted' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Camera permission is required for barcode scanning. Please allow camera access and
            refresh the page.
          </Alert>
        )}

        {/* Scanner Display */}
        <Paper sx={{ p: 2, textAlign: 'center', minHeight: 300 }}>
          {scanning ? (
            <Box>
              <div id="qr-reader" style={{ width: '100%' }}></div>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: 250 }}
            >
              <QrCodeScanner sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Click "Start Scan" to begin scanning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Position the barcode within the camera view
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Current Product Display */}
        {currentProduct && (
          <Card sx={{ mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6">{currentProduct.name}</Typography>
              <Typography variant="body2">
                Barcode: {currentProduct.barcode} | Current Stock: {currentProduct.currentStock}
              </Typography>
              <Typography variant="body2">
                Location: {currentProduct.location} | Category: {currentProduct.category}
              </Typography>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Box sx={{ position: 'fixed', top: 80, right: 16, zIndex: 1000, maxWidth: 400 }}>
      {notifications.map(notification => (
        <Alert
          key={notification.id}
          severity={getSeverityColor(notification.severity)}
          onClose={() => removeNotification(notification.id)}
          sx={{ mb: 1 }}
        >
          {notification.message}
        </Alert>
      ))}
    </Box>
  );

  const renderScanHistory = () => (
    <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Scan History
        <IconButton
          onClick={clearScanHistory}
          sx={{ float: 'right' }}
          disabled={scanHistory.length === 0}
        >
          <Refresh />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {scanHistory.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No scan history available
          </Typography>
        ) : (
          <List>
            {scanHistory.map(entry => (
              <ListItem key={entry.id} divider>
                <ListItemIcon>{getOperationIcon(entry.operation)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">{entry.product.name}</Typography>
                      <Chip
                        label={`${entry.operation} ${entry.quantity}`}
                        color={
                          entry.operation === 'ADD'
                            ? 'success'
                            : entry.operation === 'REMOVE'
                              ? 'error'
                              : 'primary'
                        }
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        Barcode: {entry.barcode} | Location: {entry.location}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHistoryOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const renderSettings = () => (
    <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Scanner Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Camera Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch checked={flashEnabled} onChange={e => setFlashEnabled(e.target.checked)} />
              }
              label="Flash/Torch"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Feedback Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} />
              }
              label="Success Sound"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={vibrationEnabled}
                  onChange={e => setVibrationEnabled(e.target.checked)}
                />
              }
              label="Vibration Feedback"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Scanning Behavior
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={continuousMode}
                  onChange={e => setContinuousMode(e.target.checked)}
                />
              }
              label="Continuous Scanning"
            />
            <FormControlLabel
              control={
                <Switch checked={batchMode} onChange={e => setBatchMode(e.target.checked)} />
              }
              label="Batch Processing Mode"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setSettingsOpen(false)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderProductDialog = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{scanResult ? 'Scan Result' : 'Product Information'}</DialogTitle>
      <DialogContent>
        {currentProduct ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {currentProduct.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Barcode: {currentProduct.barcode}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Current Stock: {currentProduct.currentStock}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Location: {currentProduct.location}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Category: {currentProduct.category}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Operation: {operation} {quantity} units
            </Typography>

            {operation === 'REMOVE' && currentProduct.currentStock < quantity && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Insufficient stock! Current: {currentProduct.currentStock}, Requested: {quantity}
              </Alert>
            )}
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Product Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Barcode: {scanResult}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Close</Button>
        {currentProduct && (
          <Button
            variant="contained"
            onClick={() => {
              setDialogOpen(false);
              if (continuousMode) {
                // Continue scanning
              }
            }}
          >
            Confirm
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {renderScanner()}
      {renderNotifications()}
      {renderScanHistory()}
      {renderSettings()}
      {renderProductDialog()}

      {/* Floating Action Button for Quick Scan */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setScanning(!scanning)}
        disabled={cameraPermission !== 'granted'}
      >
        {scanning ? <Stop /> : <QrCodeScanner />}
      </Fab>
    </Box>
  );
};

export default BarcodeStockScanner;
