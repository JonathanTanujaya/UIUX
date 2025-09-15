import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
} from '@mui/material';
import {
  Refresh,
  Warning,
  CheckCircle,
  Error,
  Download,
  Upload,
  Settings,
  TrendingUp,
  TrendingDown,
  Analytics,
  Inventory,
  Schedule,
  History,
  NotificationsActive,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StockEngine from '../../services/StockEngine';

const RealTimeStockDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [calculations, setCalculations] = useState(new Map());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [viewMode, setViewMode] = useState('overview'); // overview, alerts, analytics
  const [valuationMethod, setValuationMethod] = useState('FIFO');

  const stockEngine = useRef(new StockEngine());
  const refreshTimer = useRef(null);
  const wsConnection = useRef(null);

  // Initialize component
  useEffect(() => {
    initializeStockMonitoring();
    connectWebSocket();

    return () => {
      cleanup();
    };
  }, []);

  // Auto refresh setup
  useEffect(() => {
    if (autoRefresh) {
      refreshTimer.current = setInterval(refreshStockData, refreshInterval * 1000);
    } else {
      clearInterval(refreshTimer.current);
    }

    return () => clearInterval(refreshTimer.current);
  }, [autoRefresh, refreshInterval]);

  const initializeStockMonitoring = async () => {
    try {
      setLoading(true);

      // Initialize stock engine
      stockEngine.current.startBackgroundCalculations();

      // Add listener for calculation updates
      stockEngine.current.addListener(handleStockEngineUpdate);

      // Load initial data
      await Promise.all([loadStockData(), loadStockAlerts(), performCalculations()]);
    } catch (error) {
      console.error('Failed to initialize stock monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (wsConnection.current) return;

    try {
      wsConnection.current = new WebSocket('ws://localhost:8080/stock-updates');

      wsConnection.current.onopen = () => {
        console.log('Stock WebSocket connected');
      };

      wsConnection.current.onmessage = event => {
        const data = JSON.parse(event.data);
        handleRealTimeUpdate(data);
      };

      wsConnection.current.onclose = () => {
        console.log('Stock WebSocket disconnected');
        // Attempt reconnection after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      wsConnection.current.onerror = error => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const cleanup = () => {
    clearInterval(refreshTimer.current);
    if (wsConnection.current) {
      wsConnection.current.close();
    }
  };

  const loadStockData = async () => {
    try {
      // Mock API call - replace with actual backend call
      const response = await fetch('/api/stock/realtime');
      const data = await response.json();

      // Mock data for demonstration
      const mockData = [
        {
          id: 1,
          name: 'Product A',
          barcode: '1234567890123',
          currentStock: 45,
          reorderPoint: 50,
          maxStock: 200,
          minStock: 20,
          cost: 100,
          lastMovement: '2024-01-15T10:30:00Z',
          location: 'Warehouse A',
          category: 'Electronics',
          turnoverRate: 2.5,
          daysOfInventory: 30,
          status: 'LOW_STOCK',
          lots: [
            { id: 'LOT001', quantity: 25, expiryDate: '2024-06-15', unitCost: 95 },
            { id: 'LOT002', quantity: 20, expiryDate: '2024-08-20', unitCost: 105 },
          ],
        },
        {
          id: 2,
          name: 'Product B',
          barcode: '2345678901234',
          currentStock: 120,
          reorderPoint: 75,
          maxStock: 300,
          minStock: 50,
          cost: 200,
          lastMovement: '2024-01-14T14:20:00Z',
          location: 'Warehouse B',
          category: 'Tools',
          turnoverRate: 4.2,
          daysOfInventory: 18,
          status: 'OK',
          lots: [{ id: 'LOT003', quantity: 120, expiryDate: '2025-12-31', unitCost: 200 }],
        },
        {
          id: 3,
          name: 'Product C',
          barcode: '3456789012345',
          currentStock: 0,
          reorderPoint: 30,
          maxStock: 150,
          minStock: 15,
          cost: 50,
          lastMovement: '2024-01-10T09:15:00Z',
          location: 'Warehouse A',
          category: 'Consumables',
          turnoverRate: 6.8,
          daysOfInventory: 0,
          status: 'OUT_OF_STOCK',
          lots: [],
        },
      ];

      setStockData(mockData);
      return mockData;
    } catch (error) {
      console.error('Failed to load stock data:', error);
      return [];
    }
  };

  const loadStockAlerts = async () => {
    try {
      // Generate alerts based on stock data
      const alertsData = stockData
        .map(product => {
          const alerts = [];

          if (product.currentStock <= 0) {
            alerts.push({
              id: `${product.id}-out-of-stock`,
              productId: product.id,
              productName: product.name,
              type: 'OUT_OF_STOCK',
              severity: 'error',
              message: `${product.name} is out of stock`,
              timestamp: new Date().toISOString(),
            });
          } else if (product.currentStock <= product.reorderPoint) {
            alerts.push({
              id: `${product.id}-low-stock`,
              productId: product.id,
              productName: product.name,
              type: 'LOW_STOCK',
              severity: 'warning',
              message: `${product.name} is below reorder point (${product.currentStock}/${product.reorderPoint})`,
              timestamp: new Date().toISOString(),
            });
          }

          // Check for near-expiry items
          product.lots?.forEach(lot => {
            const expiryDate = new Date(lot.expiryDate);
            const daysToExpiry = Math.ceil((expiryDate - new Date()) / (24 * 60 * 60 * 1000));

            if (daysToExpiry <= 30 && daysToExpiry > 0) {
              alerts.push({
                id: `${product.id}-${lot.id}-near-expiry`,
                productId: product.id,
                productName: product.name,
                type: 'NEAR_EXPIRY',
                severity: 'warning',
                message: `Lot ${lot.id} expires in ${daysToExpiry} days`,
                timestamp: new Date().toISOString(),
              });
            } else if (daysToExpiry <= 0) {
              alerts.push({
                id: `${product.id}-${lot.id}-expired`,
                productId: product.id,
                productName: product.name,
                type: 'EXPIRED',
                severity: 'error',
                message: `Lot ${lot.id} has expired`,
                timestamp: new Date().toISOString(),
              });
            }
          });

          return alerts;
        })
        .flat();

      setAlerts(alertsData);
      return alertsData;
    } catch (error) {
      console.error('Failed to load stock alerts:', error);
      return [];
    }
  };

  const performCalculations = async () => {
    try {
      const products = stockData.filter(p => p.id); // Ensure we have valid products
      const results = await stockEngine.current.batchCalculateReorderPoints(products);
      setCalculations(results);
      return results;
    } catch (error) {
      console.error('Failed to perform calculations:', error);
      return new Map();
    }
  };

  const refreshStockData = useCallback(async () => {
    try {
      await Promise.all([loadStockData(), loadStockAlerts(), performCalculations()]);
    } catch (error) {
      console.error('Failed to refresh stock data:', error);
    }
  }, [stockData]);

  const handleStockEngineUpdate = event => {
    const { type, data } = event;

    switch (type) {
      case 'calculationUpdate':
        setCalculations(prev => new Map(prev.set(data.productId, data.results)));
        break;
      default:
        console.log('Unknown stock engine event:', event);
    }
  };

  const handleRealTimeUpdate = data => {
    const { type, payload } = data;

    switch (type) {
      case 'STOCK_UPDATED':
        setStockData(prev =>
          prev.map(product =>
            product.id === payload.productId
              ? { ...product, currentStock: payload.newStock, lastMovement: payload.timestamp }
              : product
          )
        );
        break;
      case 'ALERT_GENERATED':
        setAlerts(prev => [payload, ...prev]);
        break;
      default:
        console.log('Unknown real-time update:', data);
    }
  };

  const getStockStatusColor = status => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return 'error';
      case 'LOW_STOCK':
        return 'warning';
      case 'OK':
        return 'success';
      case 'OVERSTOCK':
        return 'info';
      default:
        return 'default';
    }
  };

  const getAlertSeverityColor = severity => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const calculateStockValue = product => {
    if (valuationMethod === 'FIFO') {
      const movements =
        product.lots?.map(lot => ({
          type: 'IN',
          quantity: lot.quantity,
          unitCost: lot.unitCost,
          date: lot.date,
          lotNumber: lot.id,
        })) || [];

      const valuation = stockEngine.current.calculateFIFOValuation(movements);
      return valuation.totalValue;
    }

    return product.currentStock * product.cost;
  };

  const generateTrendData = product => {
    // Mock trend data - replace with actual historical data
    const days = 30;
    const data = [];
    let stock = product.currentStock;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simulate stock movements
      stock += Math.floor(Math.random() * 20) - 10;
      stock = Math.max(0, stock);

      data.push({
        date: date.toLocaleDateString(),
        stock,
        reorderPoint: product.reorderPoint,
      });
    }

    return data;
  };

  const handleProductClick = product => {
    setSelectedProduct(product);
    setDetailsOpen(true);
  };

  const exportStockReport = () => {
    try {
      const reportData = stockData.map(product => ({
        'Product Name': product.name,
        Barcode: product.barcode,
        'Current Stock': product.currentStock,
        'Reorder Point': product.reorderPoint,
        'Stock Value': calculateStockValue(product),
        Status: product.status,
        Location: product.location,
        'Last Movement': new Date(product.lastMovement).toLocaleDateString(),
      }));

      const csvContent = [
        Object.keys(reportData[0]).join(','),
        ...reportData.map(row => Object.values(row).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const renderOverviewCards = () => {
    const totalProducts = stockData.length;
    const outOfStock = stockData.filter(p => p.currentStock <= 0).length;
    const lowStock = stockData.filter(
      p => p.currentStock > 0 && p.currentStock <= p.reorderPoint
    ).length;
    const totalValue = stockData.reduce((sum, p) => sum + calculateStockValue(p), 0);

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="primary">
                    {totalProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
                <Inventory color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="error">
                    {outOfStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Out of Stock
                  </Typography>
                </Box>
                <Error color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {lowStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" color="success.main">
                    ${totalValue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderStockTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Barcode</TableCell>
            <TableCell align="right">Current Stock</TableCell>
            <TableCell align="right">Reorder Point</TableCell>
            <TableCell align="right">Stock Value</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Last Movement</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockData.map(product => (
            <TableRow
              key={product.id}
              hover
              onClick={() => handleProductClick(product)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Typography variant="subtitle2">{product.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.category}
                </Typography>
              </TableCell>
              <TableCell>{product.barcode}</TableCell>
              <TableCell align="right">
                <Typography
                  variant="body2"
                  color={product.currentStock <= product.reorderPoint ? 'error' : 'inherit'}
                >
                  {product.currentStock}
                </Typography>
              </TableCell>
              <TableCell align="right">{product.reorderPoint}</TableCell>
              <TableCell align="right">${calculateStockValue(product).toLocaleString()}</TableCell>
              <TableCell>
                <Chip
                  label={product.status}
                  color={getStockStatusColor(product.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{product.location}</TableCell>
              <TableCell>{new Date(product.lastMovement).toLocaleDateString()}</TableCell>
              <TableCell>
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => handleProductClick(product)}>
                    <Analytics />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAlerts = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Stock Alerts
          <Badge badgeContent={alerts.length} color="error" sx={{ ml: 2 }} />
        </Typography>

        {alerts.length === 0 ? (
          <Alert severity="success">No active stock alerts</Alert>
        ) : (
          alerts.map(alert => (
            <Alert key={alert.id} severity={getAlertSeverityColor(alert.severity)} sx={{ mb: 1 }}>
              <Typography variant="subtitle2">{alert.productName}</Typography>
              <Typography variant="body2">{alert.message}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(alert.timestamp).toLocaleString()}
              </Typography>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Real-Time Stock Dashboard
          <IconButton onClick={refreshStockData} disabled={loading} sx={{ ml: 1 }}>
            <Refresh />
          </IconButton>
        </Typography>

        <Box display="flex" gap={1}>
          <Button variant="outlined" startIcon={<Download />} onClick={exportStockReport}>
            Export
          </Button>

          <Button variant="outlined" startIcon={<Settings />} onClick={() => setSettingsOpen(true)}>
            Settings
          </Button>
        </Box>
      </Box>

      {/* Loading Progress */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* View Mode Tabs */}
      <Box display="flex" gap={1} mb={3}>
        <Button
          variant={viewMode === 'overview' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('overview')}
        >
          Overview
        </Button>
        <Button
          variant={viewMode === 'alerts' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('alerts')}
          startIcon={
            alerts.length > 0 ? <Badge badgeContent={alerts.length} color="error" /> : null
          }
        >
          Alerts
        </Button>
        <Button
          variant={viewMode === 'analytics' ? 'contained' : 'outlined'}
          onClick={() => setViewMode('analytics')}
        >
          Analytics
        </Button>
      </Box>

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <>
          {renderOverviewCards()}
          {renderStockTable()}
        </>
      )}

      {viewMode === 'alerts' && renderAlerts()}

      {viewMode === 'analytics' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stock Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'In Stock',
                          value: stockData.filter(p => p.currentStock > p.reorderPoint).length,
                        },
                        {
                          name: 'Low Stock',
                          value: stockData.filter(
                            p => p.currentStock > 0 && p.currentStock <= p.reorderPoint
                          ).length,
                        },
                        {
                          name: 'Out of Stock',
                          value: stockData.filter(p => p.currentStock <= 0).length,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell fill="#4caf50" />
                      <Cell fill="#ff9800" />
                      <Cell fill="#f44336" />
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Stock Value by Category
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <RechartsTooltip formatter={value => [`$${value.toLocaleString()}`, 'Value']} />
                    <Bar dataKey={item => calculateStockValue(item)} fill="#2196f3" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Product Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="lg" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.name} - Stock Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Stock Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>
                      Current Stock: <strong>{selectedProduct.currentStock}</strong>
                    </Typography>
                    <Typography>
                      Reorder Point: <strong>{selectedProduct.reorderPoint}</strong>
                    </Typography>
                    <Typography>
                      Max Stock: <strong>{selectedProduct.maxStock}</strong>
                    </Typography>
                    <Typography>
                      Stock Value:{' '}
                      <strong>${calculateStockValue(selectedProduct).toLocaleString()}</strong>
                    </Typography>
                    <Typography>
                      Turnover Rate: <strong>{selectedProduct.turnoverRate}x</strong>
                    </Typography>
                    <Typography>
                      Days of Inventory: <strong>{selectedProduct.daysOfInventory}</strong>
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Lot Information
                  </Typography>
                  {selectedProduct.lots?.map(lot => (
                    <Box key={lot.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Lot {lot.id}</Typography>
                      <Typography variant="body2">Quantity: {lot.quantity}</Typography>
                      <Typography variant="body2">Unit Cost: ${lot.unitCost}</Typography>
                      <Typography variant="body2">
                        Expiry: {new Date(lot.expiryDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Stock Trend (30 days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={generateTrendData(selectedProduct)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="stock"
                        stroke="#2196f3"
                        strokeWidth={2}
                        name="Stock Level"
                      />
                      <Line
                        type="monotone"
                        dataKey="reorderPoint"
                        stroke="#ff9800"
                        strokeDasharray="5 5"
                        name="Reorder Point"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<History />}>
                View History
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Dashboard Settings</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            <FormControlLabel
              control={
                <Switch checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
              }
              label="Auto Refresh"
            />

            <TextField
              label="Refresh Interval (seconds)"
              type="number"
              value={refreshInterval}
              onChange={e => setRefreshInterval(parseInt(e.target.value))}
              disabled={!autoRefresh}
              inputProps={{ min: 10, max: 300 }}
            />

            <FormControl fullWidth>
              <InputLabel>Valuation Method</InputLabel>
              <Select value={valuationMethod} onChange={e => setValuationMethod(e.target.value)}>
                <MenuItem value="FIFO">FIFO (First In, First Out)</MenuItem>
                <MenuItem value="LIFO">LIFO (Last In, First Out)</MenuItem>
                <MenuItem value="WEIGHTED_AVERAGE">Weighted Average</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RealTimeStockDashboard;
