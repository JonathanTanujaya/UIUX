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
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { customersAPI, salesAPI, barangAPI } from '../../services/api';
import { PageLoading, LoadingSpinner } from '../../components/LoadingComponents';
import { useResponsive } from '../../components/ResponsiveUtils';
import {
  FormErrors,
  SuccessMessage,
  validateRequired,
  validatePositiveNumber,
} from '../../components/FormValidation';

// Step configuration
const STEPS = [
  {
    label: 'Customer Selection',
    description: 'Select customer and sales person',
    icon: <Person />,
  },
  {
    label: 'Product Selection',
    description: 'Add products to cart',
    icon: <Inventory />,
  },
  {
    label: 'Pricing & Discounts',
    description: 'Apply discounts and calculate totals',
    icon: <Calculate />,
  },
  {
    label: 'Payment Method',
    description: 'Choose payment terms',
    icon: <Payment />,
  },
  {
    label: 'Invoice Preview',
    description: 'Review transaction details',
    icon: <Receipt />,
  },
  {
    label: 'Confirmation',
    description: 'Complete transaction',
    icon: <CheckCircle />,
  },
];

const SalesTransactionForm = () => {
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
      customer: null,
      salesPerson: null,
      transactionType: 'cash',
      paymentTerms: 30,
      items: [],
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 11,
      taxAmount: 0,
      grandTotal: 0,
      notes: '',
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
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Data state
  const [customers, setCustomers] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productNotes, setProductNotes] = useState('');

  // Search state
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Validation state
  const [stepErrors, setStepErrors] = useState({});
  const [stockWarnings, setStockWarnings] = useState([]);

  // Watch form values for calculations
  const watchedValues = watch();
  const currentItems = watch('items');
  const discountPercent = watch('discountPercent');
  const taxPercent = watch('taxPercent');

  // Initialize data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Calculate totals when items or discounts change
  useEffect(() => {
    calculateTotals();
  }, [currentItems, discountPercent, taxPercent]);

  // Fetch initial data
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [customersRes, salesRes, productsRes] = await Promise.allSettled([
        customersAPI.getAll(),
        salesAPI.getSalesPersons(),
        barangAPI.getAll(),
      ]);

      if (customersRes.status === 'fulfilled') {
        setCustomers(customersRes.value.data?.data || []);
      }

      if (salesRes.status === 'fulfilled') {
        setSalesPersons(salesRes.value.data?.data || []);
      }

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const items = getValues('items');
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      const itemDiscount = (itemTotal * (item.discount || 0)) / 100;
      return sum + (itemTotal - itemDiscount);
    }, 0);

    const discountAmount = (subtotal * (discountPercent || 0)) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * (taxPercent || 0)) / 100;
    const grandTotal = afterDiscount + taxAmount;

    setValue('subtotal', subtotal);
    setValue('discountAmount', discountAmount);
    setValue('taxAmount', taxAmount);
    setValue('grandTotal', grandTotal);
  };

  // Validate step
  const validateStep = stepIndex => {
    const values = getValues();
    const errors = {};

    switch (stepIndex) {
      case 0: // Customer Selection
        if (!values.customer) errors.customer = 'Customer is required';
        if (!values.salesPerson) errors.salesPerson = 'Sales person is required';
        break;

      case 1: // Product Selection
        if (!values.items || values.items.length === 0) {
          errors.items = 'At least one product is required';
        }
        break;

      case 2: // Pricing & Discounts
        if (values.discountPercent < 0 || values.discountPercent > 100) {
          errors.discountPercent = 'Discount must be between 0 and 100%';
        }
        break;

      case 3: // Payment Method
        if (
          values.transactionType === 'credit' &&
          (!values.paymentTerms || values.paymentTerms <= 0)
        ) {
          errors.paymentTerms = 'Payment terms are required for credit transactions';
        }
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Add product to cart
  const handleAddProduct = () => {
    if (!selectedProduct || productQuantity <= 0) {
      toast.error('Please select a product and enter valid quantity');
      return;
    }

    // Check stock availability
    if (selectedProduct.stok < productQuantity) {
      toast.error(`Insufficient stock. Available: ${selectedProduct.stok}`);
      return;
    }

    // Check if product already exists in cart
    const existingIndex = currentItems.findIndex(item => item.productId === selectedProduct.id);

    if (existingIndex >= 0) {
      // Update existing item
      const existingItem = currentItems[existingIndex];
      const newQuantity = existingItem.quantity + productQuantity;

      if (newQuantity > selectedProduct.stok) {
        toast.error(`Total quantity would exceed stock. Available: ${selectedProduct.stok}`);
        return;
      }

      updateItem(existingIndex, {
        ...existingItem,
        quantity: newQuantity,
        notes: productNotes ? `${existingItem.notes || ''}; ${productNotes}` : existingItem.notes,
      });
    } else {
      // Add new item
      addItem({
        productId: selectedProduct.id,
        productCode: selectedProduct.kode_barang,
        productName: selectedProduct.nama_barang,
        price: parseFloat(selectedProduct.modal || 0),
        quantity: productQuantity,
        discount: 0,
        notes: productNotes,
        stock: selectedProduct.stok,
      });
    }

    // Reset form
    setSelectedProduct(null);
    setProductQuantity(1);
    setProductNotes('');
    setProductSearch('');

    toast.success('Product added to cart');
  };

  // Remove product from cart
  const handleRemoveProduct = index => {
    removeItem(index);
    toast.info('Product removed from cart');
  };

  // Update item quantity
  const handleUpdateQuantity = (index, newQuantity) => {
    const item = currentItems[index];

    if (newQuantity <= 0) {
      handleRemoveProduct(index);
      return;
    }

    if (newQuantity > item.stock) {
      toast.error(`Quantity cannot exceed stock: ${item.stock}`);
      return;
    }

    updateItem(index, { ...item, quantity: newQuantity });
  };

  // Update item discount
  const handleUpdateDiscount = (index, discount) => {
    const item = currentItems[index];

    if (discount < 0 || discount > 100) {
      toast.error('Discount must be between 0 and 100%');
      return;
    }

    updateItem(index, { ...item, discount });
  };

  // Submit form
  const onSubmit = async data => {
    setSubmitting(true);
    try {
      const payload = {
        customer_id: data.customer.id,
        sales_person_id: data.salesPerson.id,
        transaction_type: data.transactionType,
        payment_terms: data.paymentTerms,
        items: data.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          notes: item.notes,
        })),
        subtotal: data.subtotal,
        discount_percent: data.discountPercent,
        discount_amount: data.discountAmount,
        tax_percent: data.taxPercent,
        tax_amount: data.taxAmount,
        grand_total: data.grandTotal,
        notes: data.notes,
      };

      const response = await salesAPI.create(payload);

      if (response.data.success) {
        toast.success('Sales transaction created successfully!');
        setConfirmDialogOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to create sales transaction');
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

  // Filter products for search
  const filteredProducts = useMemo(() => {
    return products.filter(
      product =>
        product.nama_barang?.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.kode_barang?.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  // Loading state
  if (loading) {
    return <PageLoading />;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🛒 Sales Transaction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete sales workflow in 6 easy steps
        </Typography>
      </Paper>

      {/* Progress Stepper */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                error={!!stepErrors && Object.keys(stepErrors).length > 0 && activeStep === index}
              >
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

      {/* Form Errors */}
      {Object.keys(stepErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Please fix the following errors:</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {Object.entries(stepErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Step Content for desktop */}
      {!isMobile && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, minHeight: 400 }}>
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
          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              startIcon={submitting ? <LoadingSpinner size={20} /> : <CheckCircle />}
              size="large"
            >
              {submitting ? 'Processing...' : 'Complete Transaction'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} endIcon={<Add />} size="large">
              Continue
            </Button>
          )}
        </Box>
      </Box>

      {/* Floating Cart Summary */}
      {currentItems.length > 0 && (
        <Fab
          color="primary"
          aria-label="cart"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setPreviewDialogOpen(true)}
        >
          <Badge badgeContent={currentItems.length} color="secondary">
            <ShoppingCart />
          </Badge>
        </Fab>
      )}

      {/* Dialogs */}
      {renderDialogs()}
    </Box>
  );

  // Render step content
  function renderStepContent(step) {
    switch (step) {
      case 0:
        return renderCustomerSelection();
      case 1:
        return renderProductSelection();
      case 2:
        return renderPricingDiscounts();
      case 3:
        return renderPaymentMethod();
      case 4:
        return renderInvoicePreview();
      case 5:
        return renderConfirmation();
      default:
        return <Typography>Unknown step</Typography>;
    }
  }

  // Step 1: Customer Selection
  function renderCustomerSelection() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            👤 Select Customer & Sales Person
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="customer"
            control={control}
            rules={{ required: 'Customer is required' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={customers}
                getOptionLabel={option => `${option.nama || ''} (${option.kode || ''})`}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Customer"
                    required
                    error={!!errors.customer}
                    helperText={errors.customer?.message}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">{option.nama}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.kode} • {option.alamat}
                      </Typography>
                    </Box>
                  </Box>
                )}
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="salesPerson"
            control={control}
            rules={{ required: 'Sales person is required' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={salesPersons}
                getOptionLabel={option => `${option.nama || ''} (${option.kode || ''})`}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Sales Person"
                    required
                    error={!!errors.salesPerson}
                    helperText={errors.salesPerson?.message}
                  />
                )}
                onChange={(_, value) => field.onChange(value)}
              />
            )}
          />
        </Grid>

        {watchedValues.customer && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {watchedValues.customer.nama}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Code:</strong> {watchedValues.customer.kode}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Address:</strong> {watchedValues.customer.alamat}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  }

  // Step 2: Product Selection
  function renderProductSelection() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            📦 Add Products to Cart
          </Typography>
        </Grid>

        {/* Product Search and Add */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    value={selectedProduct}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    inputValue={productSearch}
                    onInputChange={(_, newInputValue) => setProductSearch(newInputValue)}
                    options={filteredProducts}
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
                          <Typography variant="body1">{option.nama_barang}</Typography>
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
                  <TextField
                    label="Notes (Optional)"
                    value={productNotes}
                    onChange={e => setProductNotes(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    onClick={handleAddProduct}
                    disabled={!selectedProduct}
                    startIcon={<Add />}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              {selectedProduct && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Product Details:</Typography>
                  <Typography variant="body2">
                    Stock: {selectedProduct.stok} | Price: {formatCurrency(selectedProduct.modal)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Cart Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🛒 Shopping Cart ({currentItems.length} items)
              </Typography>

              {currentItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No products added yet. Start by searching and adding products above.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Discount %</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentItems.map((item, index) => {
                        const itemTotal = item.quantity * item.price;
                        const discountAmount = (itemTotal * (item.discount || 0)) / 100;
                        const finalTotal = itemTotal - discountAmount;

                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {item.productName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.productCode}
                                </Typography>
                                {item.notes && (
                                  <Typography variant="caption" display="block">
                                    Notes: {item.notes}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="center">{formatCurrency(item.price)}</TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                >
                                  <Remove />
                                </IconButton>
                                <Typography sx={{ mx: 1, minWidth: 30, textAlign: 'center' }}>
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Stock: {item.stock}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                type="number"
                                size="small"
                                value={item.discount || 0}
                                onChange={e =>
                                  handleUpdateDiscount(index, parseFloat(e.target.value) || 0)
                                }
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {formatCurrency(finalTotal)}
                              </Typography>
                              {item.discount > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  -{formatCurrency(discountAmount)}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Step 3: Pricing & Discounts
  function renderPricingDiscounts() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            💰 Pricing & Discounts
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatCurrency(watchedValues.subtotal)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Discount:</Typography>
                <Typography color="error">
                  -{formatCurrency(watchedValues.discountAmount)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax ({watchedValues.taxPercent}%):</Typography>
                <Typography>{formatCurrency(watchedValues.taxAmount)}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Grand Total:</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(watchedValues.grandTotal)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Adjustments
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="discountPercent"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Overall Discount %"
                        type="number"
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                        fullWidth
                        onChange={e => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="taxPercent"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tax %"
                        type="number"
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                        fullWidth
                        onChange={e => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Step 4: Payment Method
  function renderPaymentMethod() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            💳 Payment Method
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Controller
                name="transactionType"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Transaction Type</FormLabel>
                    <RadioGroup {...field} row>
                      <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                      <FormControlLabel value="credit" control={<Radio />} label="Credit" />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {watchedValues.transactionType === 'credit' && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Controller
                  name="paymentTerms"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Payment Terms (Days)"
                      type="number"
                      inputProps={{ min: 1, max: 365 }}
                      fullWidth
                      helperText="Number of days for payment"
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Additional Notes"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Enter any additional notes or special instructions..."
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Step 5: Invoice Preview
  function renderInvoicePreview() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            📄 Invoice Preview
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              {/* Invoice Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h4">INVOICE</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {format(new Date(), 'dd MMM yyyy')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" color="primary">
                    StockFlow Auto Parts
                  </Typography>
                  <Typography variant="body2">
                    Jl. Raya Motor No. 123
                    <br />
                    Jakarta, Indonesia
                  </Typography>
                </Box>
              </Box>

              {/* Customer & Sales Info */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Bill To:
                  </Typography>
                  <Typography variant="body2">
                    {watchedValues.customer?.nama}
                    <br />
                    {watchedValues.customer?.alamat}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Sales Person:
                  </Typography>
                  <Typography variant="body2">{watchedValues.salesPerson?.nama}</Typography>
                </Grid>
              </Grid>

              {/* Items Table */}
              <TableContainer sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Discount</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((item, index) => {
                      const itemTotal = item.quantity * item.price;
                      const discountAmount = (itemTotal * (item.discount || 0)) / 100;
                      const finalTotal = itemTotal - discountAmount;

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2">{item.productName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.productCode}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                          <TableCell align="right">
                            {item.discount > 0 ? `${item.discount}%` : '-'}
                          </TableCell>
                          <TableCell align="right">{formatCurrency(finalTotal)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ minWidth: 300 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(watchedValues.subtotal)}</Typography>
                  </Box>

                  {watchedValues.discountPercent > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Discount ({watchedValues.discountPercent}%):</Typography>
                      <Typography color="error">
                        -{formatCurrency(watchedValues.discountAmount)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax ({watchedValues.taxPercent}%):</Typography>
                    <Typography>{formatCurrency(watchedValues.taxAmount)}</Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Grand Total:</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(watchedValues.grandTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Payment Terms */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Terms:
                </Typography>
                <Typography variant="body2">
                  {watchedValues.transactionType === 'cash'
                    ? 'Cash Payment - Due Immediately'
                    : `Credit Payment - Due in ${watchedValues.paymentTerms} days`}
                </Typography>

                {watchedValues.notes && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                      Notes:
                    </Typography>
                    <Typography variant="body2">{watchedValues.notes}</Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Step 6: Confirmation
  function renderConfirmation() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            ✅ Transaction Confirmation
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Ready to Process
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please review all details before completing the transaction.
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setPreviewDialogOpen(true)}
                  startIcon={<Receipt />}
                >
                  Preview Invoice
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  disabled={submitting}
                  startIcon={submitting ? <LoadingSpinner size={20} /> : <Save />}
                  size="large"
                >
                  {submitting ? 'Processing...' : 'Complete Transaction'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction Summary */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Transaction Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Customer:</strong> {watchedValues.customer?.nama}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Items:</strong> {currentItems.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Payment:</strong>{' '}
                    {watchedValues.transactionType === 'cash' ? 'Cash' : 'Credit'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Total:</strong> {formatCurrency(watchedValues.grandTotal)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Render dialogs
  function renderDialogs() {
    return (
      <>
        {/* Preview Dialog */}
        <Dialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogContent>{renderInvoicePreview()}</DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
            <Button variant="contained" startIcon={<Print />}>
              Print
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Transaction Completed Successfully!</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Invoice Generated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The sales transaction has been processed successfully.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/sales')}>Back to Sales</Button>
            <Button variant="contained" startIcon={<Print />}>
              Print Invoice
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
};

export default SalesTransactionForm;
