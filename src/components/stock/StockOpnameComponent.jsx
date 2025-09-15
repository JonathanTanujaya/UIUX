import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Badge,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Remove,
  Save,
  Cancel,
  Upload,
  Download,
  Refresh,
  Warning,
  CheckCircle,
  Error,
  ExpandMore,
  PlayArrow,
  Pause,
  Stop,
  Visibility,
  Edit,
  Delete,
  CompareArrows,
  Assessment,
  History,
  Print,
  CloudUpload,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import StockEngine from '../../services/StockEngine';

const StockOpnameComponent = () => {
  const [opnameData, setOpnameData] = useState({
    id: null,
    title: '',
    description: '',
    location: '',
    status: 'DRAFT', // DRAFT, ACTIVE, COMPLETED, CANCELLED
    startDate: new Date(),
    endDate: null,
    createdBy: 'current_user',
    items: [],
    totalDiscrepancy: 0,
    adjustmentPosted: false,
  });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table, grid, scanner
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [discrepancyFilter, setDiscrepancyFilter] = useState('ALL');
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [showDiscrepanciesOnly, setShowDiscrepanciesOnly] = useState(false);

  const stockEngine = useRef(new StockEngine());
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const opnameSteps = [
    'Setup Opname',
    'Add Products',
    'Count Stock',
    'Review Discrepancies',
    'Post Adjustments',
  ];

  useEffect(() => {
    initializeOpname();
    loadProducts();
  }, []);

  useEffect(() => {
    if (autoCalculate) {
      calculateDiscrepancies();
    }
  }, [opnameData.items, autoCalculate]);

  const initializeOpname = async () => {
    try {
      // Load existing opname data if editing
      const opnameId = new URLSearchParams(window.location.search).get('id');
      if (opnameId) {
        await loadOpnameData(opnameId);
      }
    } catch (error) {
      console.error('Failed to initialize opname:', error);
    }
  };

  const loadProducts = async () => {
    try {
      // Mock API call - replace with actual backend call
      const response = await fetch('/api/products');

      // Mock data for demonstration
      const mockProducts = [
        {
          id: 1,
          name: 'Product A',
          barcode: '1234567890123',
          systemStock: 45,
          location: 'Warehouse A',
          category: 'Electronics',
          unitCost: 100,
          lots: [
            { id: 'LOT001', quantity: 25, expiryDate: '2024-06-15' },
            { id: 'LOT002', quantity: 20, expiryDate: '2024-08-20' },
          ],
        },
        {
          id: 2,
          name: 'Product B',
          barcode: '2345678901234',
          systemStock: 120,
          location: 'Warehouse B',
          category: 'Tools',
          unitCost: 200,
          lots: [{ id: 'LOT003', quantity: 120, expiryDate: '2025-12-31' }],
        },
        {
          id: 3,
          name: 'Product C',
          barcode: '3456789012345',
          systemStock: 0,
          location: 'Warehouse A',
          category: 'Consumables',
          unitCost: 50,
          lots: [],
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadOpnameData = async opnameId => {
    try {
      // Mock API call
      const response = await fetch(`/api/opname/${opnameId}`);
      const data = await response.json();
      setOpnameData(data);

      // Determine active step based on status
      switch (data.status) {
        case 'DRAFT':
          setActiveStep(0);
          break;
        case 'ACTIVE':
          setActiveStep(2);
          break;
        case 'COMPLETED':
          setActiveStep(4);
          break;
        default:
          setActiveStep(0);
      }
    } catch (error) {
      console.error('Failed to load opname data:', error);
    }
  };

  const calculateDiscrepancies = useCallback(async () => {
    try {
      setProcessing(true);

      const updatedItems = opnameData.items.map(item => {
        const physicalCount = item.physicalCount || 0;
        const systemStock = item.systemStock || 0;
        const variance = physicalCount - systemStock;
        const varianceValue = variance * item.unitCost;

        // Calculate ABC classification impact
        const abcClass =
          stockEngine.current
            .calculateABCClassification([
              {
                id: item.productId,
                annualUsage: item.systemStock * 12, // Approximate annual usage
                unitCost: item.unitCost,
              },
            ])
            .get(item.productId)?.class || 'C';

        return {
          ...item,
          variance,
          varianceValue,
          variancePercentage: systemStock > 0 ? (variance / systemStock) * 100 : 0,
          abcClass,
          status: variance === 0 ? 'MATCH' : variance > 0 ? 'EXCESS' : 'SHORTAGE',
          requiresApproval:
            Math.abs(varianceValue) > 1000 || Math.abs(variance / systemStock) > 0.1,
        };
      });

      const totalDiscrepancy = updatedItems.reduce(
        (sum, item) => sum + Math.abs(item.varianceValue),
        0
      );

      setOpnameData(prev => ({
        ...prev,
        items: updatedItems,
        totalDiscrepancy,
      }));
    } catch (error) {
      console.error('Failed to calculate discrepancies:', error);
    } finally {
      setProcessing(false);
    }
  }, [opnameData.items]);

  const addProductToOpname = product => {
    const existingItem = opnameData.items.find(item => item.productId === product.id);

    if (existingItem) {
      // Update existing item
      setOpnameData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.productId === product.id ? { ...item, systemStock: product.systemStock } : item
        ),
      }));
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        location: product.location,
        category: product.category,
        systemStock: product.systemStock,
        physicalCount: 0,
        unitCost: product.unitCost,
        variance: 0,
        varianceValue: 0,
        variancePercentage: 0,
        status: 'PENDING',
        countedBy: null,
        countedAt: null,
        notes: '',
        lots:
          product.lots?.map(lot => ({
            ...lot,
            physicalCount: 0,
            variance: 0,
          })) || [],
      };

      setOpnameData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }
  };

  const removeProductFromOpname = itemId => {
    setOpnameData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const updatePhysicalCount = (itemId, count, lotId = null) => {
    setOpnameData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          if (lotId) {
            // Update lot count
            const updatedLots = item.lots.map(lot =>
              lot.id === lotId
                ? { ...lot, physicalCount: count, variance: count - lot.quantity }
                : lot
            );
            const totalPhysicalCount = updatedLots.reduce((sum, lot) => sum + lot.physicalCount, 0);

            return {
              ...item,
              lots: updatedLots,
              physicalCount: totalPhysicalCount,
              countedAt: new Date().toISOString(),
              countedBy: 'current_user',
            };
          } else {
            // Update item count
            return {
              ...item,
              physicalCount: count,
              countedAt: new Date().toISOString(),
              countedBy: 'current_user',
            };
          }
        }
        return item;
      }),
    }));
  };

  const handleBarcodeScanned = async barcode => {
    try {
      const product = products.find(p => p.barcode === barcode);

      if (product) {
        const existingItem = opnameData.items.find(item => item.productId === product.id);

        if (existingItem) {
          // Increment physical count
          updatePhysicalCount(existingItem.id, existingItem.physicalCount + 1);
        } else {
          // Add product and set count to 1
          addProductToOpname(product);
          setTimeout(() => {
            const newItem = opnameData.items.find(item => item.productId === product.id);
            if (newItem) {
              updatePhysicalCount(newItem.id, 1);
            }
          }, 100);
        }

        // Show success feedback
        console.log(`Scanned: ${product.name}`);
      } else {
        // Product not found
        console.warn(`Product with barcode ${barcode} not found`);
      }
    } catch (error) {
      console.error('Failed to process scanned barcode:', error);
    }
  };

  const startBarcodeScanner = async () => {
    try {
      setScanning(true);

      // Mock barcode scanner implementation
      // In a real implementation, this would integrate with camera API
      const mockBarcodes = ['1234567890123', '2345678901234', '3456789012345'];
      const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];

      setTimeout(() => {
        handleBarcodeScanned(randomBarcode);
        setScanning(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to start barcode scanner:', error);
      setScanning(false);
    }
  };

  const exportOpnameData = () => {
    try {
      const exportData = {
        ...opnameData,
        exportedAt: new Date().toISOString(),
        exportedBy: 'current_user',
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `opname-${opnameData.id || 'draft'}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export opname data:', error);
    }
  };

  const importOpnameData = event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target.result);
        setOpnameData(importedData);
        console.log('Opname data imported successfully');
      } catch (error) {
        console.error('Failed to import opname data:', error);
      }
    };
    reader.readAsText(file);
  };

  const saveOpname = async () => {
    try {
      setProcessing(true);

      const saveData = {
        ...opnameData,
        updatedAt: new Date().toISOString(),
      };

      // Mock API call
      const response = await fetch(`/api/opname${opnameData.id ? `/${opnameData.id}` : ''}`, {
        method: opnameData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });

      if (response.ok) {
        const result = await response.json();
        setOpnameData(result);
        console.log('Opname saved successfully');
      }
    } catch (error) {
      console.error('Failed to save opname:', error);
    } finally {
      setProcessing(false);
    }
  };

  const postAdjustments = async () => {
    try {
      setProcessing(true);

      const adjustments = opnameData.items
        .filter(item => item.variance !== 0)
        .map(item => ({
          productId: item.productId,
          variance: item.variance,
          varianceValue: item.varianceValue,
          reason: 'Stock Opname Adjustment',
          reference: `OPNAME-${opnameData.id}`,
          lots: item.lots?.filter(lot => lot.variance !== 0) || [],
        }));

      // Batch process adjustments using StockEngine
      const results = await stockEngine.current.batchProcessAdjustments(adjustments);

      setOpnameData(prev => ({
        ...prev,
        adjustmentPosted: true,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      }));

      console.log('Adjustments posted successfully:', results);
      setActiveStep(4);
    } catch (error) {
      console.error('Failed to post adjustments:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'MATCH':
        return 'success';
      case 'EXCESS':
        return 'info';
      case 'SHORTAGE':
        return 'warning';
      case 'PENDING':
        return 'default';
      default:
        return 'default';
    }
  };

  const getVarianceIcon = variance => {
    if (variance > 0) return <Add color="success" />;
    if (variance < 0) return <Remove color="error" />;
    return <CheckCircle color="success" />;
  };

  const filteredItems = opnameData.items.filter(item => {
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    if (discrepancyFilter === 'DISCREPANCIES_ONLY' && item.variance === 0) return false;
    if (showDiscrepanciesOnly && item.variance === 0) return false;
    return true;
  });

  const renderSetupStep = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Opname Setup
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Opname Title"
              value={opnameData.title}
              onChange={e => setOpnameData(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              value={opnameData.description}
              onChange={e => setOpnameData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Location</InputLabel>
              <Select
                value={opnameData.location}
                onChange={e => setOpnameData(prev => ({ ...prev, location: e.target.value }))}
              >
                <MenuItem value="Warehouse A">Warehouse A</MenuItem>
                <MenuItem value="Warehouse B">Warehouse B</MenuItem>
                <MenuItem value="Store Front">Store Front</MenuItem>
                <MenuItem value="All Locations">All Locations</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={opnameData.startDate}
                onChange={date => setOpnameData(prev => ({ ...prev, startDate: date }))}
                renderInput={params => <TextField {...params} fullWidth margin="normal" />}
              />

              <DatePicker
                label="End Date (Optional)"
                value={opnameData.endDate}
                onChange={date => setOpnameData(prev => ({ ...prev, endDate: date }))}
                renderInput={params => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>

            <FormControlLabel
              control={
                <Switch
                  checked={autoCalculate}
                  onChange={e => setAutoCalculate(e.target.checked)}
                />
              }
              label="Auto-calculate discrepancies"
              sx={{ mt: 2 }}
            />

            <FormControlLabel
              control={
                <Switch checked={batchMode} onChange={e => setBatchMode(e.target.checked)} />
              }
              label="Batch processing mode"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" onClick={() => setActiveStep(1)}>
            Next: Add Products
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderProductSelection = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Add Products to Opname</Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<QrCodeScanner />}
              onClick={startBarcodeScanner}
              disabled={scanning}
            >
              {scanning ? 'Scanning...' : 'Scan Barcode'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => fileInputRef.current?.click()}
            >
              Import
            </Button>
          </Box>
        </Box>

        <Autocomplete
          multiple
          options={products}
          getOptionLabel={option => `${option.name} (${option.barcode})`}
          value={selectedProducts}
          onChange={(event, newValue) => {
            setSelectedProducts(newValue);
            newValue.forEach(product => addProductToOpname(product));
          }}
          renderInput={params => (
            <TextField {...params} label="Select Products" placeholder="Search products..." />
          )}
          sx={{ mb: 2 }}
        />

        {opnameData.items.length > 0 && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {opnameData.items.length} products added to opname
          </Typography>
        )}

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={() => setActiveStep(0)}>Back</Button>
          <Button
            variant="contained"
            onClick={() => setActiveStep(2)}
            disabled={opnameData.items.length === 0}
          >
            Next: Count Stock
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStockCounting = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Stock Counting</Typography>
          <Box display="flex" gap={1}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>View</InputLabel>
              <Select value={viewMode} onChange={e => setViewMode(e.target.value)}>
                <MenuItem value="table">Table</MenuItem>
                <MenuItem value="grid">Grid</MenuItem>
                <MenuItem value="scanner">Scanner</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="MATCH">Match</MenuItem>
                <MenuItem value="EXCESS">Excess</MenuItem>
                <MenuItem value="SHORTAGE">Shortage</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<QrCodeScanner />}
              onClick={startBarcodeScanner}
              disabled={scanning}
            >
              Scan
            </Button>
          </Box>
        </Box>

        {processing && <LinearProgress sx={{ mb: 2 }} />}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">System Stock</TableCell>
                <TableCell align="center">Physical Count</TableCell>
                <TableCell align="center">Variance</TableCell>
                <TableCell align="center">Value Impact</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{item.productName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.barcode} • {item.location}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{item.systemStock}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.physicalCount}
                      onChange={e => updatePhysicalCount(item.id, parseInt(e.target.value) || 0)}
                      size="small"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      {getVarianceIcon(item.variance)}
                      <Typography
                        color={
                          item.variance === 0
                            ? 'success.main'
                            : item.variance > 0
                              ? 'info.main'
                              : 'error.main'
                        }
                      >
                        {item.variance}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      color={
                        item.varianceValue === 0
                          ? 'success.main'
                          : item.varianceValue > 0
                            ? 'info.main'
                            : 'error.main'
                      }
                    >
                      ${Math.abs(item.varianceValue).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedItem(item);
                          setDialogOpen(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={() => setActiveStep(1)}>Back</Button>
          <Button variant="contained" onClick={() => setActiveStep(3)}>
            Next: Review Discrepancies
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderDiscrepancyReview = () => {
    const discrepancyItems = opnameData.items.filter(item => item.variance !== 0);
    const totalValue = discrepancyItems.reduce(
      (sum, item) => sum + Math.abs(item.varianceValue),
      0
    );

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Review Discrepancies
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {discrepancyItems.length}
                </Typography>
                <Typography variant="body2">Items with Discrepancies</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  ${totalValue.toLocaleString()}
                </Typography>
                <Typography variant="body2">Total Value Impact</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {discrepancyItems.filter(item => item.variance > 0).length}
                </Typography>
                <Typography variant="body2">Excess Items</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {discrepancyItems.filter(item => item.variance < 0).length}
                </Typography>
                <Typography variant="body2">Shortage Items</Typography>
              </Paper>
            </Grid>
          </Grid>

          {discrepancyItems.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">System</TableCell>
                    <TableCell align="center">Physical</TableCell>
                    <TableCell align="center">Variance</TableCell>
                    <TableCell align="center">Value Impact</TableCell>
                    <TableCell align="center">ABC Class</TableCell>
                    <TableCell align="center">Approval Required</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discrepancyItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{item.productName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.barcode}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{item.systemStock}</TableCell>
                      <TableCell align="center">{item.physicalCount}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                          {getVarianceIcon(item.variance)}
                          <Typography color={item.variance > 0 ? 'info.main' : 'error.main'}>
                            {item.variance} ({item.variancePercentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color={item.varianceValue > 0 ? 'info.main' : 'error.main'}>
                          ${Math.abs(item.varianceValue).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.abcClass}
                          color={
                            item.abcClass === 'A'
                              ? 'error'
                              : item.abcClass === 'B'
                                ? 'warning'
                                : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item.requiresApproval ? (
                          <Warning color="warning" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="success">
              No discrepancies found! All counts match the system stock.
            </Alert>
          )}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button onClick={() => setActiveStep(2)}>Back</Button>
            <Button variant="contained" onClick={() => setActiveStep(4)} disabled={processing}>
              Next: Post Adjustments
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderAdjustmentPosting = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Post Stock Adjustments
        </Typography>

        {!opnameData.adjustmentPosted ? (
          <>
            <Alert severity="warning" sx={{ mb: 3 }}>
              This action will post all stock adjustments to the system. This cannot be undone.
            </Alert>

            <Typography variant="body1" gutterBottom>
              Ready to post {opnameData.items.filter(item => item.variance !== 0).length}{' '}
              adjustments with a total value impact of $
              {opnameData.totalDiscrepancy.toLocaleString()}.
            </Typography>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button onClick={() => setActiveStep(3)}>Back</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={postAdjustments}
                disabled={processing}
                startIcon={processing ? <Refresh /> : <Save />}
              >
                {processing ? 'Posting...' : 'Post Adjustments'}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>
              Stock adjustments have been posted successfully!
            </Alert>

            <Typography variant="body1">
              Opname completed on {new Date(opnameData.completedAt).toLocaleString()}
            </Typography>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()}>
                Print Report
              </Button>
              <Button variant="outlined" startIcon={<Download />} onClick={exportOpnameData}>
                Export Data
              </Button>
              <Button variant="contained" onClick={() => (window.location.href = '/stock-opname')}>
                New Opname
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Stock Opname {opnameData.title && `- ${opnameData.title}`}
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={saveOpname}
            disabled={processing}
          >
            Save
          </Button>

          <Button variant="outlined" startIcon={<Download />} onClick={exportOpnameData}>
            Export
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={importOpnameData}
            accept=".json"
            style={{ display: 'none' }}
          />

          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
        </Box>
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {opnameSteps.map((label, index) => (
            <Step key={label}>
              <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      {activeStep === 0 && renderSetupStep()}
      {activeStep === 1 && renderProductSelection()}
      {activeStep === 2 && renderStockCounting()}
      {activeStep === 3 && renderDiscrepancyReview()}
      {activeStep === 4 && renderAdjustmentPosting()}

      {/* Item Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle>{selectedItem.productName} - Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Stock Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>
                      Barcode: <strong>{selectedItem.barcode}</strong>
                    </Typography>
                    <Typography>
                      Location: <strong>{selectedItem.location}</strong>
                    </Typography>
                    <Typography>
                      System Stock: <strong>{selectedItem.systemStock}</strong>
                    </Typography>
                    <Typography>
                      Physical Count: <strong>{selectedItem.physicalCount}</strong>
                    </Typography>
                    <Typography>
                      Variance: <strong>{selectedItem.variance}</strong>
                    </Typography>
                    <Typography>
                      Value Impact:{' '}
                      <strong>${Math.abs(selectedItem.varianceValue).toLocaleString()}</strong>
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Counting Details
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>
                      Status:{' '}
                      <Chip
                        label={selectedItem.status}
                        color={getStatusColor(selectedItem.status)}
                        size="small"
                      />
                    </Typography>
                    <Typography>
                      Counted By: <strong>{selectedItem.countedBy || 'Not counted'}</strong>
                    </Typography>
                    <Typography>
                      Counted At:{' '}
                      <strong>
                        {selectedItem.countedAt
                          ? new Date(selectedItem.countedAt).toLocaleString()
                          : 'Not counted'}
                      </strong>
                    </Typography>
                    <Typography>
                      ABC Class: <strong>{selectedItem.abcClass}</strong>
                    </Typography>
                  </Box>
                </Grid>

                {selectedItem.lots && selectedItem.lots.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Lot Details
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Lot Number</TableCell>
                            <TableCell align="center">System Qty</TableCell>
                            <TableCell align="center">Physical Count</TableCell>
                            <TableCell align="center">Variance</TableCell>
                            <TableCell>Expiry Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedItem.lots.map(lot => (
                            <TableRow key={lot.id}>
                              <TableCell>{lot.id}</TableCell>
                              <TableCell align="center">{lot.quantity}</TableCell>
                              <TableCell align="center">
                                <TextField
                                  type="number"
                                  value={lot.physicalCount}
                                  onChange={e =>
                                    updatePhysicalCount(
                                      selectedItem.id,
                                      parseInt(e.target.value) || 0,
                                      lot.id
                                    )
                                  }
                                  size="small"
                                  sx={{ width: 80 }}
                                />
                              </TableCell>
                              <TableCell align="center">{lot.variance}</TableCell>
                              <TableCell>{new Date(lot.expiryDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<Save />}>
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StockOpnameComponent;
