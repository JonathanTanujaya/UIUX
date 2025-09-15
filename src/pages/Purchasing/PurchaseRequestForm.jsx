// Purchase Request Form - Smart supplier selection & automated PO creation
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Collapse,
  Tooltip,
  Fab,
  Badge,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Inventory,
  Payment,
  Receipt,
  CheckCircle,
  Add,
  Remove,
  Delete,
  Search,
  Warning,
  Info,
  Print,
  Save,
  Cancel,
  Edit,
  Calculate,
  Refresh,
  Business,
  TrendingUp,
  Timeline,
  Assessment,
  Compare,
  Star,
  LocalShipping,
  Schedule,
  AttachMoney,
  ExpandMore,
  FilterList,
  Sort,
  Send,
  Approval,
  VerifiedUser,
  History,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, addDays } from 'date-fns';
import { purchasesAPI, suppliersAPI, barangAPI } from '../../services/api';
import { PageLoading, LoadingSpinner } from '../../components/LoadingComponents';
import { useResponsive } from '../../components/ResponsiveUtils';
import {
  FormErrors,
  validateRequired,
  validatePositiveNumber,
} from '../../components/FormValidation';

// Purchase Request Steps
const PURCHASE_STEPS = [
  {
    label: 'Request Details',
    description: 'Define purchase requirements',
    icon: <Edit />,
  },
  {
    label: 'Smart Supplier Selection',
    description: 'AI-powered supplier comparison',
    icon: <Business />,
  },
  {
    label: 'Price Analysis',
    description: 'Historical price comparison',
    icon: <TrendingUp />,
  },
  {
    label: 'Approval Workflow',
    description: 'Multi-level authorization',
    icon: <Approval />,
  },
  {
    label: 'Purchase Order',
    description: 'Generate automated PO',
    icon: <Receipt />,
  },
  {
    label: 'Confirmation',
    description: 'Complete & submit request',
    icon: <CheckCircle />,
  },
];

// Priority levels for purchase requests
const PRIORITY_LEVELS = [
  { value: 'urgent', label: 'Urgent', color: 'error', days: 1 },
  { value: 'high', label: 'High Priority', color: 'warning', days: 3 },
  { value: 'normal', label: 'Normal', color: 'info', days: 7 },
  { value: 'low', label: 'Low Priority', color: 'success', days: 14 },
];

// Budget categories
const BUDGET_CATEGORIES = [
  { value: 'operational', label: 'Operational', limit: 50000000 },
  { value: 'maintenance', label: 'Maintenance', limit: 25000000 },
  { value: 'inventory', label: 'Inventory', limit: 100000000 },
  { value: 'capex', label: 'Capital Expenditure', limit: 500000000 },
];

const PurchaseRequestForm = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  // Form state
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requestType: 'standard',
      priority: 'normal',
      budgetCategory: 'operational',
      deliveryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      items: [],
      selectedSuppliers: [],
      approvers: [],
      notes: '',
      attachment: null,
    },
  });

  const {
    fields: items,
    append: addItem,
    remove: removeItem,
    update: updateItem,
  } = useFieldArray({
    control,
    name: 'items',
  });

  // Component state
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceHistory, setPriceHistory] = useState({});
  const [supplierPerformance, setSupplierPerformance] = useState({});
  const [approvalMatrix, setApprovalMatrix] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState({});
  const [reorderPoints, setReorderPoints] = useState([]);

  // Analysis state
  const [supplierAnalysis, setSupplierAnalysis] = useState([]);
  const [priceComparison, setPriceComparison] = useState({});
  const [riskAssessment, setRiskAssessment] = useState({});

  // UI state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [showSupplierAnalysis, setShowSupplierAnalysis] = useState(false);
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  // Watch form values
  const watchedValues = watch();
  const currentItems = watch('items');
  const budgetCategory = watch('budgetCategory');
  const priority = watch('priority');

  // Initialize data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Calculate budget impact when items change
  useEffect(() => {
    calculateBudgetImpact();
  }, [currentItems, budgetCategory]);

  // Fetch initial data
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [suppliersRes, productsRes, reorderRes] = await Promise.allSettled([
        suppliersAPI.getAll(),
        barangAPI.getAll(),
        fetchReorderPoints(),
      ]);

      if (suppliersRes.status === 'fulfilled') {
        const suppliersData = suppliersRes.value.data?.data || [];
        setSuppliers(suppliersData);
        await fetchSupplierPerformance(suppliersData);
      }

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data?.data || []);
      }

      if (reorderRes.status === 'fulfilled') {
        setReorderPoints(reorderRes.value);
      }

      await fetchApprovalMatrix();
      await fetchBudgetStatus();
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch supplier performance data
  const fetchSupplierPerformance = async suppliersData => {
    try {
      const performanceData = {};
      for (const supplier of suppliersData) {
        // Simulate API call for supplier performance
        performanceData[supplier.id] = {
          onTimeDelivery: Math.random() * 100,
          qualityScore: Math.random() * 100,
          priceCompetitiveness: Math.random() * 100,
          communicationRating: Math.random() * 5,
          totalOrders: Math.floor(Math.random() * 100),
          avgDeliveryDays: Math.floor(Math.random() * 14) + 1,
          lastOrderDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        };
      }
      setSupplierPerformance(performanceData);
    } catch (error) {
      console.error('Error fetching supplier performance:', error);
    }
  };

  // Fetch approval matrix based on budget and priority
  const fetchApprovalMatrix = async () => {
    try {
      // Simulate approval matrix based on amount and priority
      const matrix = [
        { level: 1, role: 'Department Manager', limit: 10000000, required: true },
        { level: 2, role: 'Finance Manager', limit: 50000000, required: true },
        { level: 3, role: 'General Manager', limit: 100000000, required: false },
        { level: 4, role: 'CEO', limit: Infinity, required: false },
      ];
      setApprovalMatrix(matrix);
    } catch (error) {
      console.error('Error fetching approval matrix:', error);
    }
  };

  // Fetch current budget status
  const fetchBudgetStatus = async () => {
    try {
      const status = {};
      for (const category of BUDGET_CATEGORIES) {
        status[category.value] = {
          allocated: category.limit,
          used: Math.random() * category.limit * 0.7,
          pending: Math.random() * category.limit * 0.1,
          available: category.limit - Math.random() * category.limit * 0.8,
        };
      }
      setBudgetStatus(status);
    } catch (error) {
      console.error('Error fetching budget status:', error);
    }
  };

  // Fetch reorder points for automatic suggestions
  const fetchReorderPoints = async () => {
    try {
      // Simulate reorder point data
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push({
          productId: `P${String(i + 1).padStart(3, '0')}`,
          productName: `Auto Part ${i + 1}`,
          currentStock: Math.floor(Math.random() * 50),
          reorderPoint: Math.floor(Math.random() * 20) + 10,
          reorderQuantity: Math.floor(Math.random() * 100) + 50,
          urgency: Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'medium' : 'low',
        });
      }
      return points.filter(p => p.currentStock <= p.reorderPoint);
    } catch (error) {
      console.error('Error fetching reorder points:', error);
      return [];
    }
  };

  // Smart supplier analysis
  const performSupplierAnalysis = async productId => {
    try {
      setLoading(true);

      // Get price history for the product from all suppliers
      const history = {};
      const analysis = [];

      for (const supplier of suppliers) {
        // Simulate price history
        const prices = [];
        for (let i = 0; i < 12; i++) {
          prices.push({
            month: format(new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000), 'MMM yyyy'),
            price: Math.random() * 100000 + 50000,
          });
        }
        history[supplier.id] = prices;

        // Calculate supplier score
        const performance = supplierPerformance[supplier.id] || {};
        const score =
          (performance.onTimeDelivery || 0) * 0.3 +
          (performance.qualityScore || 0) * 0.3 +
          (performance.priceCompetitiveness || 0) * 0.2 +
          (performance.communicationRating || 0) * 20 * 0.2;

        analysis.push({
          supplier,
          score,
          currentPrice: prices[0]?.price || 0,
          avgPrice: prices.reduce((sum, p) => sum + p.price, 0) / prices.length,
          priceStability: Math.random() * 100,
          deliveryTime: performance.avgDeliveryDays || 7,
          riskLevel: score > 80 ? 'low' : score > 60 ? 'medium' : 'high',
          recommendation: score > 80 ? 'preferred' : score > 60 ? 'acceptable' : 'caution',
        });
      }

      // Sort by score
      analysis.sort((a, b) => b.score - a.score);

      setPriceHistory(history);
      setSupplierAnalysis(analysis);
      setShowSupplierAnalysis(true);
    } catch (error) {
      console.error('Error performing supplier analysis:', error);
      toast.error('Failed to analyze suppliers');
    } finally {
      setLoading(false);
    }
  };

  // Calculate budget impact
  const calculateBudgetImpact = () => {
    const total = currentItems.reduce((sum, item) => {
      return sum + item.quantity * item.estimatedPrice;
    }, 0);

    const budget = budgetStatus[budgetCategory];
    if (budget) {
      const impact = {
        requestAmount: total,
        availableBudget: budget.available,
        utilizationPercent: (total / budget.allocated) * 100,
        exceedsBudget: total > budget.available,
        requiresApproval: total > budget.allocated * 0.1, // 10% threshold
      };

      setValue('budgetImpact', impact);
    }
  };

  // Determine required approvers based on amount and priority
  const determineRequiredApprovers = (amount, priority) => {
    const requiredApprovers = [];

    for (const level of approvalMatrix) {
      if (amount > level.limit || priority === 'urgent') {
        requiredApprovers.push(level);
      }
    }

    return requiredApprovers;
  };

  // Add item to purchase request
  const handleAddItem = () => {
    if (!selectedProduct || productQuantity <= 0) {
      toast.error('Please select a product and enter valid quantity');
      return;
    }

    // Check if item already exists
    const existingIndex = currentItems.findIndex(item => item.productId === selectedProduct.id);

    if (existingIndex >= 0) {
      const existingItem = currentItems[existingIndex];
      updateItem(existingIndex, {
        ...existingItem,
        quantity: existingItem.quantity + productQuantity,
      });
    } else {
      addItem({
        productId: selectedProduct.id,
        productCode: selectedProduct.kode_barang,
        productName: selectedProduct.nama_barang,
        quantity: productQuantity,
        estimatedPrice: parseFloat(selectedProduct.modal || 0),
        urgency: 'normal',
        specifications: '',
        preferredSupplier: null,
      });
    }

    // Reset form
    setSelectedProduct(null);
    setProductQuantity(1);
    toast.success('Item added to request');
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Validate current step
  const validateStep = stepIndex => {
    const values = getValues();

    switch (stepIndex) {
      case 0: // Request Details
        if (!values.priority) return false;
        if (!values.budgetCategory) return false;
        if (!values.deliveryDate) return false;
        if (!currentItems || currentItems.length === 0) {
          toast.error('Please add at least one item');
          return false;
        }
        break;

      case 1: // Supplier Selection
        const selectedSuppliers = values.selectedSuppliers || [];
        if (selectedSuppliers.length === 0) {
          toast.error('Please select at least one supplier');
          return false;
        }
        break;

      case 3: // Approval Workflow
        const requiredApprovers = determineRequiredApprovers(
          currentItems.reduce((sum, item) => sum + item.quantity * item.estimatedPrice, 0),
          values.priority
        );
        if (requiredApprovers.length > 0 && (!values.approvers || values.approvers.length === 0)) {
          toast.error('Please assign required approvers');
          return false;
        }
        break;
    }

    return true;
  };

  // Submit purchase request
  const onSubmit = async data => {
    setSubmitting(true);
    try {
      const requestAmount = currentItems.reduce(
        (sum, item) => sum + item.quantity * item.estimatedPrice,
        0
      );

      const payload = {
        type: data.requestType,
        priority: data.priority,
        budget_category: data.budgetCategory,
        delivery_date: data.deliveryDate,
        total_amount: requestAmount,
        items: currentItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          estimated_price: item.estimatedPrice,
          specifications: item.specifications,
          urgency: item.urgency,
        })),
        suppliers: data.selectedSuppliers,
        approvers: data.approvers,
        notes: data.notes,
        workflow_status: 'pending_approval',
      };

      const response = await purchasesAPI.createRequest(payload);

      if (response.data.success) {
        toast.success('Purchase request submitted successfully!');
        navigate('/purchasing/requests');
      } else {
        throw new Error(response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(error.message || 'Failed to submit purchase request');
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Get priority color
  const getPriorityColor = priority => {
    const p = PRIORITY_LEVELS.find(p => p.value === priority);
    return p ? p.color : 'default';
  };

  // Loading state
  if (loading) {
    return <PageLoading />;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🛒 Smart Purchase Request
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered procurement with automated supplier selection and approval workflow
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="primary">
                  {reorderPoints.length}
                </Typography>
                <Typography variant="caption">Items Below Reorder Point</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="warning.main">
                  {suppliers.length}
                </Typography>
                <Typography variant="caption">Active Suppliers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(budgetStatus[budgetCategory]?.available || 0)}
                </Typography>
                <Typography variant="caption">Available Budget</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="info.main">
                  {currentItems.length}
                </Typography>
                <Typography variant="caption">Items in Request</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Reorder Notifications */}
      {reorderPoints.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            📦 Automatic Reorder Suggestions
          </Typography>
          <Typography variant="body2">
            {reorderPoints.length} items are below reorder point.
            <Button
              size="small"
              sx={{ ml: 1 }}
              onClick={() => {
                reorderPoints.forEach(item => {
                  addItem({
                    productId: item.productId,
                    productCode: item.productId,
                    productName: item.productName,
                    quantity: item.reorderQuantity,
                    estimatedPrice: Math.random() * 100000 + 50000,
                    urgency: item.urgency,
                    specifications: 'Auto-suggested for reorder',
                    preferredSupplier: null,
                  });
                });
                toast.success('Reorder items added to request');
              }}
            >
              Add All to Request
            </Button>
          </Typography>
        </Alert>
      )}

      {/* Progress Stepper */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {PURCHASE_STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel icon={step.icon}>
                <Typography variant="subtitle2">{step.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              {isMobile && <StepContent>{renderStepContent(index)}</StepContent>}
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content for desktop */}
      {!isMobile && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, minHeight: 500 }}>
          {renderStepContent(activeStep)}
        </Paper>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          startIcon={<Cancel />}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep === PURCHASE_STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              startIcon={submitting ? <LoadingSpinner size={20} /> : <Send />}
              size="large"
            >
              {submitting ? 'Submitting...' : 'Submit Purchase Request'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} endIcon={<Add />} size="large">
              Continue
            </Button>
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      {renderDialogs()}
    </Box>
  );

  // Render step content
  function renderStepContent(step) {
    switch (step) {
      case 0:
        return renderRequestDetails();
      case 1:
        return renderSupplierSelection();
      case 2:
        return renderPriceAnalysis();
      case 3:
        return renderApprovalWorkflow();
      case 4:
        return renderPurchaseOrder();
      case 5:
        return renderConfirmation();
      default:
        return <Typography>Unknown step</Typography>;
    }
  }

  // Step 1: Request Details
  function renderRequestDetails() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            📋 Purchase Request Details
          </Typography>
        </Grid>

        {/* Request Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Request Configuration
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Priority Level</FormLabel>
                        <RadioGroup {...field} row>
                          {PRIORITY_LEVELS.map(level => (
                            <FormControlLabel
                              key={level.value}
                              value={level.value}
                              control={<Radio color={level.color} />}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip size="small" label={level.label} color={level.color} />
                                  <Typography variant="caption">({level.days} days)</Typography>
                                </Box>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="budgetCategory"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={BUDGET_CATEGORIES}
                        getOptionLabel={option => option.label}
                        renderInput={params => (
                          <TextField {...params} label="Budget Category" required />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2">{option.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Limit: {formatCurrency(option.limit)}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        onChange={(_, value) => field.onChange(value?.value)}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="deliveryDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Required Delivery Date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Budget Overview
              </Typography>

              {budgetStatus[budgetCategory] && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Allocated:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(budgetStatus[budgetCategory].allocated)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Used:</Typography>
                    <Typography variant="body2" color="error">
                      {formatCurrency(budgetStatus[budgetCategory].used)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Available:</Typography>
                    <Typography variant="body2" color="success.main">
                      {formatCurrency(budgetStatus[budgetCategory].available)}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={
                      (budgetStatus[budgetCategory].used / budgetStatus[budgetCategory].allocated) *
                      100
                    }
                    sx={{ mt: 2, mb: 1 }}
                  />

                  <Typography variant="caption" color="text.secondary">
                    {(
                      (budgetStatus[budgetCategory].used / budgetStatus[budgetCategory].allocated) *
                      100
                    ).toFixed(1)}
                    % utilized
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Product Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                📦 Product Selection
              </Typography>

              {/* Add Product Form */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    value={selectedProduct}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    options={products}
                    getOptionLabel={option => `${option.nama_barang} (${option.kode_barang})`}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Search Product"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2">{option.nama_barang}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.kode_barang} • Stock: {option.stok} • Price:{' '}
                            {formatCurrency(option.modal)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={productQuantity}
                    onChange={e => setProductQuantity(parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  {selectedProduct && (
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="caption">
                        Current Stock: {selectedProduct.stok} | Est. Price:{' '}
                        {formatCurrency(selectedProduct.modal)} | Total:{' '}
                        {formatCurrency(selectedProduct.modal * productQuantity)}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    onClick={handleAddItem}
                    disabled={!selectedProduct}
                    startIcon={<Add />}
                    fullWidth
                  >
                    Add Item
                  </Button>
                </Grid>
              </Grid>

              {/* Items List */}
              {currentItems.length > 0 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Est. Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Urgency</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.productName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.productCode}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={e => {
                                const newItems = [...currentItems];
                                newItems[index].quantity = parseInt(e.target.value) || 1;
                                setValue('items', newItems);
                              }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell align="right">{formatCurrency(item.estimatedPrice)}</TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(item.quantity * item.estimatedPrice)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={item.urgency}
                              color={
                                item.urgency === 'critical'
                                  ? 'error'
                                  : item.urgency === 'medium'
                                    ? 'warning'
                                    : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="primary"
                              onClick={() => performSupplierAnalysis(item.productId)}
                            >
                              <Assessment />
                            </IconButton>
                            <IconButton color="error" onClick={() => removeItem(index)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Request Summary */}
              {currentItems.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                  <Typography variant="h6">
                    Total Request Value:{' '}
                    {formatCurrency(
                      currentItems.reduce(
                        (sum, item) => sum + item.quantity * item.estimatedPrice,
                        0
                      )
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {currentItems.length} items • Delivery by {watchedValues.deliveryDate}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Step 2: Smart Supplier Selection
  function renderSupplierSelection() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            🤖 Smart Supplier Selection
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            AI-powered supplier analysis based on performance, pricing, and delivery history
          </Typography>
        </Grid>

        {/* Supplier Analysis Results */}
        {supplierAnalysis.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  📊 Supplier Performance Analysis
                </Typography>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Supplier</TableCell>
                        <TableCell align="center">Overall Score</TableCell>
                        <TableCell align="center">Current Price</TableCell>
                        <TableCell align="center">Delivery Time</TableCell>
                        <TableCell align="center">Risk Level</TableCell>
                        <TableCell align="center">Recommendation</TableCell>
                        <TableCell align="center">Select</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supplierAnalysis.map((analysis, index) => (
                        <TableRow key={analysis.supplier.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {analysis.supplier.nama?.[0] || 'S'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {analysis.supplier.nama}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {analysis.supplier.kode_supplier}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box>
                              <Typography variant="h6" color="primary">
                                {analysis.score.toFixed(1)}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={analysis.score}
                                sx={{ width: 60 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {formatCurrency(analysis.currentPrice)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={`${analysis.deliveryTime} days`}
                              color={
                                analysis.deliveryTime <= 3
                                  ? 'success'
                                  : analysis.deliveryTime <= 7
                                    ? 'warning'
                                    : 'error'
                              }
                              icon={<LocalShipping />}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={analysis.riskLevel}
                              color={
                                analysis.riskLevel === 'low'
                                  ? 'success'
                                  : analysis.riskLevel === 'medium'
                                    ? 'warning'
                                    : 'error'
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={analysis.recommendation}
                              color={
                                analysis.recommendation === 'preferred'
                                  ? 'success'
                                  : analysis.recommendation === 'acceptable'
                                    ? 'info'
                                    : 'warning'
                              }
                              icon={analysis.recommendation === 'preferred' ? <Star /> : undefined}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant={
                                watchedValues.selectedSuppliers?.includes(analysis.supplier.id)
                                  ? 'contained'
                                  : 'outlined'
                              }
                              size="small"
                              onClick={() => {
                                const current = watchedValues.selectedSuppliers || [];
                                const isSelected = current.includes(analysis.supplier.id);

                                if (isSelected) {
                                  setValue(
                                    'selectedSuppliers',
                                    current.filter(id => id !== analysis.supplier.id)
                                  );
                                } else {
                                  setValue('selectedSuppliers', [...current, analysis.supplier.id]);
                                }
                              }}
                            >
                              {watchedValues.selectedSuppliers?.includes(analysis.supplier.id)
                                ? 'Selected'
                                : 'Select'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Supplier Selection Grid */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                🏢 Available Suppliers
              </Typography>

              <Grid container spacing={2}>
                {suppliers.map(supplier => {
                  const performance = supplierPerformance[supplier.id] || {};
                  const isSelected = watchedValues.selectedSuppliers?.includes(supplier.id);

                  return (
                    <Grid item xs={12} md={6} lg={4} key={supplier.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          border: isSelected ? 2 : 1,
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => {
                          const current = watchedValues.selectedSuppliers || [];
                          const newSelection = isSelected
                            ? current.filter(id => id !== supplier.id)
                            : [...current, supplier.id];
                          setValue('selectedSuppliers', newSelection);
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Avatar>{supplier.nama?.[0] || 'S'}</Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2">{supplier.nama}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {supplier.kode_supplier}
                              </Typography>
                            </Box>
                            {isSelected && <CheckCircle color="primary" />}
                          </Box>

                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" display="block">
                                On-time Delivery
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {performance.onTimeDelivery?.toFixed(1) || 'N/A'}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" display="block">
                                Quality Score
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {performance.qualityScore?.toFixed(1) || 'N/A'}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" display="block">
                                Avg Delivery
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {performance.avgDeliveryDays || 'N/A'} days
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" display="block">
                                Total Orders
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {performance.totalOrders || 0}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Continue with other steps...
  function renderPriceAnalysis() {
    return <Typography variant="h6">Price Analysis Content - To be implemented</Typography>;
  }

  function renderApprovalWorkflow() {
    return <Typography variant="h6">Approval Workflow Content - To be implemented</Typography>;
  }

  function renderPurchaseOrder() {
    return <Typography variant="h6">Purchase Order Content - To be implemented</Typography>;
  }

  function renderConfirmation() {
    return <Typography variant="h6">Confirmation Content - To be implemented</Typography>;
  }

  function renderDialogs() {
    return null; // To be implemented
  }
};

export default PurchaseRequestForm;
