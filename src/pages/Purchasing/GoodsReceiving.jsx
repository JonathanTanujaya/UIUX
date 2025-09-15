// Goods Receiving System - Quality check & three-way matching (PO-Receipt-Invoice)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  InputAdornment,
  Divider,
  LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Avatar,
  Badge,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Slider,
} from '@mui/material';
import {
  LocalShipping,
  Assignment,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Visibility,
  Print,
  Save,
  Add,
  Remove,
  Delete,
  Search,
  QrCode,
  CameraAlt,
  AttachFile,
  CloudUpload,
  Description,
  Assessment,
  Timeline,
  Inventory,
  Scale,
  Speed,
  Security,
  VerifiedUser,
  Report,
  Refresh,
  FilterList,
  ExpandMore,
  PhotoCamera,
  Barcode,
  LocationOn,
  CalendarToday,
  Person,
  Business,
  Receipt,
  CompareArrows,
  Approval,
  MonetizationOn,
  Gavel,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format, differenceInDays, parseISO } from 'date-fns';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { purchasesAPI, receivingAPI, qualityAPI } from '../../services/api';
import { PageLoading, LoadingSpinner } from '../../components/LoadingComponents';
import { useResponsive } from '../../components/ResponsiveUtils';

// Receiving status definitions
const RECEIVING_STATUSES = {
  pending: { label: 'Pending Receipt', color: 'warning', icon: <LocalShipping /> },
  in_progress: { label: 'Receiving in Progress', color: 'info', icon: <Inventory /> },
  quality_check: { label: 'Quality Check', color: 'secondary', icon: <Assessment /> },
  partial_received: { label: 'Partially Received', color: 'warning', icon: <Timeline /> },
  completed: { label: 'Completed', color: 'success', icon: <CheckCircle /> },
  rejected: { label: 'Rejected', color: 'error', icon: <Cancel /> },
  on_hold: { label: 'On Hold', color: 'default', icon: <Warning /> },
};

// Quality check criteria
const QUALITY_CRITERIA = [
  { id: 'packaging', label: 'Packaging Condition', weight: 0.2 },
  { id: 'quantity', label: 'Quantity Accuracy', weight: 0.3 },
  { id: 'quality', label: 'Product Quality', weight: 0.3 },
  { id: 'documentation', label: 'Documentation', weight: 0.1 },
  { id: 'delivery_time', label: 'Delivery Timeliness', weight: 0.1 },
];

// Receiving steps
const RECEIVING_STEPS = [
  {
    label: 'PO Verification',
    description: 'Verify purchase order and delivery',
    icon: <Assignment />,
  },
  {
    label: 'Physical Inspection',
    description: 'Check items and quantities',
    icon: <Inventory />,
  },
  {
    label: 'Quality Control',
    description: 'Quality assessment and testing',
    icon: <Assessment />,
  },
  {
    label: 'Three-Way Matching',
    description: 'Match PO, receipt, and invoice',
    icon: <CompareArrows />,
  },
  {
    label: 'Final Approval',
    description: 'Complete receiving process',
    icon: <Approval />,
  },
];

const GoodsReceiving = () => {
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();

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
      poNumber: '',
      deliveryNote: '',
      receivedDate: format(new Date(), 'yyyy-MM-dd'),
      receivedBy: '',
      items: [],
      qualityScores: {},
      discrepancies: [],
      attachments: [],
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
  const [currentTab, setCurrentTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPO, setSelectedPO] = useState(null);
  const [receivingDialogOpen, setReceivingDialogOpen] = useState(false);
  const [qualityDialogOpen, setQualityDialogOpen] = useState(false);
  const [matchingDialogOpen, setMatchingDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  // Data state
  const [pendingPOs, setPendingPOs] = useState([]);
  const [receivingRecords, setReceivingRecords] = useState([]);
  const [qualityTemplates, setQualityTemplates] = useState([]);
  const [matchingResults, setMatchingResults] = useState(null);

  // UI state
  const [scannerActive, setScannerActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [discrepancyDialogOpen, setDiscrepancyDialogOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    dateRange: 'week',
    supplier: '',
    search: '',
  });

  // Watch form values
  const watchedValues = watch();
  const currentItems = watch('items');

  // Fetch pending POs
  const { data: pendingPOsData = [], isLoading: loadingPOs } = useQuery({
    queryKey: ['pendingPOs'],
    queryFn: () => receivingAPI.getPendingPOs(),
    select: data => data.data || [],
  });

  // Fetch receiving records
  const { data: receivingData = [], isLoading: loadingReceiving } = useQuery({
    queryKey: ['receivingRecords', filters],
    queryFn: () => receivingAPI.getReceivingRecords(filters),
    select: data => data.data || [],
  });

  // Fetch quality templates
  const { data: templatesData = [] } = useQuery({
    queryKey: ['qualityTemplates'],
    queryFn: () => qualityAPI.getTemplates(),
    select: data => data.data || [],
  });

  // Create receiving mutation
  const createReceivingMutation = useMutation({
    mutationFn: data => receivingAPI.createReceiving(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['receivingRecords']);
      queryClient.invalidateQueries(['pendingPOs']);
      toast.success('Goods receiving completed successfully');
      setReceivingDialogOpen(false);
      resetForm();
    },
    onError: error => {
      toast.error(error.message || 'Failed to complete receiving');
    },
  });

  // Quality assessment mutation
  const qualityAssessmentMutation = useMutation({
    mutationFn: data => qualityAPI.submitAssessment(data),
    onSuccess: () => {
      toast.success('Quality assessment submitted');
      setQualityDialogOpen(false);
    },
    onError: error => {
      toast.error(error.message || 'Failed to submit quality assessment');
    },
  });

  // Three-way matching mutation
  const threeWayMatchingMutation = useMutation({
    mutationFn: data => receivingAPI.performThreeWayMatching(data),
    onSuccess: data => {
      setMatchingResults(data.data);
      setMatchingDialogOpen(true);
    },
    onError: error => {
      toast.error(error.message || 'Three-way matching failed');
    },
  });

  // Initialize receiving from PO
  const initializeFromPO = useCallback(
    po => {
      setSelectedPO(po);

      // Pre-populate form with PO data
      setValue('poNumber', po.po_number);
      setValue('receivedDate', format(new Date(), 'yyyy-MM-dd'));

      // Initialize items from PO
      const poItems =
        po.items?.map(item => ({
          poItemId: item.id,
          productId: item.product_id,
          productCode: item.product_code,
          productName: item.product_name,
          orderedQuantity: item.quantity,
          receivedQuantity: 0,
          acceptedQuantity: 0,
          rejectedQuantity: 0,
          unitPrice: item.unit_price,
          location: '',
          batchNumber: '',
          expiryDate: '',
          qualityStatus: 'pending',
          notes: '',
        })) || [];

      setValue('items', poItems);
      setReceivingDialogOpen(true);
    },
    [setValue]
  );

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (index, field, value) => {
      const newItems = [...currentItems];
      newItems[index][field] = parseInt(value) || 0;

      // Auto-calculate accepted quantity
      if (field === 'receivedQuantity') {
        newItems[index].acceptedQuantity =
          newItems[index].receivedQuantity - (newItems[index].rejectedQuantity || 0);
      } else if (field === 'rejectedQuantity') {
        newItems[index].acceptedQuantity =
          newItems[index].receivedQuantity - (newItems[index].rejectedQuantity || 0);
      }

      setValue('items', newItems);
    },
    [currentItems, setValue]
  );

  // Perform quality check
  const performQualityCheck = useCallback(item => {
    setSelectedItem(item);
    setQualityDialogOpen(true);
  }, []);

  // Handle barcode/QR scan
  const handleScan = useCallback(
    scannedData => {
      // Find item by barcode
      const itemIndex = currentItems.findIndex(
        item => item.productCode === scannedData || item.batchNumber === scannedData
      );

      if (itemIndex >= 0) {
        // Auto-fill received quantity
        const newItems = [...currentItems];
        newItems[itemIndex].receivedQuantity = newItems[itemIndex].orderedQuantity;
        newItems[itemIndex].acceptedQuantity = newItems[itemIndex].orderedQuantity;
        setValue('items', newItems);
        toast.success('Item scanned and quantity updated');
      } else {
        toast.warning('Item not found in this PO');
      }

      setScannerActive(false);
    },
    [currentItems, setValue]
  );

  // Calculate discrepancies
  const calculateDiscrepancies = useCallback(() => {
    const discrepancies = [];

    currentItems.forEach((item, index) => {
      // Quantity discrepancy
      if (item.receivedQuantity !== item.orderedQuantity) {
        discrepancies.push({
          type: 'quantity',
          itemIndex: index,
          productName: item.productName,
          expected: item.orderedQuantity,
          actual: item.receivedQuantity,
          variance: item.receivedQuantity - item.orderedQuantity,
          severity:
            Math.abs(item.receivedQuantity - item.orderedQuantity) > item.orderedQuantity * 0.05
              ? 'high'
              : 'low',
        });
      }

      // Quality discrepancy
      if (item.rejectedQuantity > 0) {
        discrepancies.push({
          type: 'quality',
          itemIndex: index,
          productName: item.productName,
          rejectedQuantity: item.rejectedQuantity,
          severity: item.rejectedQuantity > item.orderedQuantity * 0.1 ? 'high' : 'medium',
        });
      }
    });

    setValue('discrepancies', discrepancies);
    return discrepancies;
  }, [currentItems, setValue]);

  // Submit receiving
  const onSubmit = async data => {
    try {
      // Calculate discrepancies
      const discrepancies = calculateDiscrepancies();

      // Prepare payload
      const payload = {
        po_id: selectedPO.id,
        po_number: data.poNumber,
        delivery_note: data.deliveryNote,
        received_date: data.receivedDate,
        received_by: data.receivedBy,
        items: data.items.map(item => ({
          po_item_id: item.poItemId,
          product_id: item.productId,
          ordered_quantity: item.orderedQuantity,
          received_quantity: item.receivedQuantity,
          accepted_quantity: item.acceptedQuantity,
          rejected_quantity: item.rejectedQuantity,
          unit_price: item.unitPrice,
          location: item.location,
          batch_number: item.batchNumber,
          expiry_date: item.expiryDate,
          quality_status: item.qualityStatus,
          notes: item.notes,
        })),
        quality_scores: data.qualityScores,
        discrepancies,
        attachments: data.attachments,
        notes: data.notes,
        status: discrepancies.some(d => d.severity === 'high') ? 'on_hold' : 'completed',
      };

      await createReceivingMutation.mutateAsync(payload);
    } catch (error) {
      console.error('Error submitting receiving:', error);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setValue('poNumber', '');
    setValue('deliveryNote', '');
    setValue('receivedDate', format(new Date(), 'yyyy-MM-dd'));
    setValue('receivedBy', '');
    setValue('items', []);
    setValue('qualityScores', {});
    setValue('discrepancies', []);
    setValue('attachments', []);
    setValue('notes', '');
    setSelectedPO(null);
    setActiveStep(0);
  }, [setValue]);

  // Format currency
  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Get status chip props
  const getStatusChip = status => {
    const statusConfig = RECEIVING_STATUSES[status] || RECEIVING_STATUSES.pending;
    return {
      label: statusConfig.label,
      color: statusConfig.color,
      icon: statusConfig.icon,
    };
  };

  // Loading state
  if (loadingPOs || loadingReceiving) {
    return <PageLoading />;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📦 Goods Receiving System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quality control and three-way matching for incoming goods
        </Typography>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="warning.main">
                  {pendingPOsData.length}
                </Typography>
                <Typography variant="caption">Pending Receipts</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="info.main">
                  {receivingData.filter(r => r.status === 'in_progress').length}
                </Typography>
                <Typography variant="caption">In Progress</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="success.main">
                  {receivingData.filter(r => r.status === 'completed').length}
                </Typography>
                <Typography variant="caption">Completed Today</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="error.main">
                  {receivingData.filter(r => r.status === 'on_hold').length}
                </Typography>
                <Typography variant="caption">On Hold</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newTab) => setCurrentTab(newTab)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`Pending POs (${pendingPOsData.length})`} />
          <Tab label={`Receiving Records (${receivingData.length})`} />
          <Tab label="Quality Reports" />
          <Tab label="Three-Way Matching" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && renderPendingPOs()}
      {currentTab === 1 && renderReceivingRecords()}
      {currentTab === 2 && renderQualityReports()}
      {currentTab === 3 && renderThreeWayMatching()}

      {/* Dialogs */}
      {renderDialogs()}
    </Box>
  );

  // Render pending POs
  function renderPendingPOs() {
    return (
      <Grid container spacing={3}>
        {/* Search and Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search PO, supplier..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<QrCode />}
                  onClick={() => setScannerActive(true)}
                >
                  Scan PO
                </Button>
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Refresh />}
                  onClick={() => queryClient.invalidateQueries(['pendingPOs'])}
                >
                  Refresh
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Pending POs List */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>PO Number</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Expected Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingPOsData.map(po => (
                  <TableRow key={po.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {po.po_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {format(new Date(po.created_at), 'dd MMM yyyy')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {po.supplier?.name?.[0] || 'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{po.supplier?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {po.supplier?.code}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{po.items_count} items</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {po.total_quantity} units
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(po.total_amount)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(po.expected_delivery), 'dd MMM yyyy')}
                      </Typography>
                      {differenceInDays(new Date(), new Date(po.expected_delivery)) > 0 && (
                        <Chip size="small" label="Overdue" color="error" />
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip size="small" label={po.delivery_status || 'Awaiting'} color="warning" />
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<LocalShipping />}
                        onClick={() => initializeFromPO(po)}
                      >
                        Receive
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {pendingPOsData.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No pending purchase orders for receiving
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    );
  }

  // Render receiving records
  function renderReceivingRecords() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Receipt ID</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Received Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Quality Score</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receivingData.map(record => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {record.receipt_id}
                  </Typography>
                </TableCell>

                <TableCell>{record.po_number}</TableCell>

                <TableCell>{record.supplier?.name}</TableCell>

                <TableCell>{format(new Date(record.received_date), 'dd MMM yyyy HH:mm')}</TableCell>

                <TableCell>
                  <Chip size="small" {...getStatusChip(record.status)} />
                </TableCell>

                <TableCell>
                  {record.quality_score && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={record.quality_score / 20} readOnly size="small" />
                      <Typography variant="caption">{record.quality_score.toFixed(1)}%</Typography>
                    </Box>
                  )}
                </TableCell>

                <TableCell align="center">
                  <IconButton size="small" onClick={() => viewReceivingDetails(record)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => printReceivingReport(record.id)}>
                    <Print />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Render quality reports
  function renderQualityReports() {
    return <Typography variant="h6">Quality Reports - To be implemented</Typography>;
  }

  // Render three-way matching
  function renderThreeWayMatching() {
    return <Typography variant="h6">Three-Way Matching - To be implemented</Typography>;
  }

  // Render dialogs
  function renderDialogs() {
    return (
      <>
        {/* Receiving Dialog */}
        <Dialog
          open={receivingDialogOpen}
          onClose={() => setReceivingDialogOpen(false)}
          maxWidth="xl"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Goods Receiving - {selectedPO?.po_number}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<QrCode />}
                  onClick={() => setScannerActive(true)}
                >
                  Scan Items
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCamera />}
                  onClick={() => setPhotoDialogOpen(true)}
                >
                  Add Photos
                </Button>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Stepper activeStep={activeStep} orientation={isMobile ? 'vertical' : 'horizontal'}>
                {RECEIVING_STEPS.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel icon={step.icon}>
                      <Typography variant="subtitle2">{step.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {renderReceivingStepContent()}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setReceivingDialogOpen(false)}>Cancel</Button>
            {activeStep > 0 && (
              <Button onClick={() => setActiveStep(prev => prev - 1)}>Back</Button>
            )}
            {activeStep < RECEIVING_STEPS.length - 1 ? (
              <Button variant="contained" onClick={() => setActiveStep(prev => prev + 1)}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={createReceivingMutation.isPending}
                startIcon={
                  createReceivingMutation.isPending ? <LoadingSpinner size={20} /> : <Save />
                }
              >
                {createReceivingMutation.isPending ? 'Processing...' : 'Complete Receiving'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Other dialogs would be implemented here */}
      </>
    );
  }

  // Render receiving step content
  function renderReceivingStepContent() {
    switch (activeStep) {
      case 0:
        return renderPOVerification();
      case 1:
        return renderPhysicalInspection();
      case 2:
        return renderQualityControl();
      case 3:
        return renderThreeWayMatchingStep();
      case 4:
        return renderFinalApproval();
      default:
        return null;
    }
  }

  // Step 1: PO Verification
  function renderPOVerification() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Purchase Order Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    PO Number
                  </Typography>
                  <Typography variant="h6">{selectedPO?.po_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1">{selectedPO?.supplier?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Expected Date
                  </Typography>
                  <Typography variant="body1">
                    {selectedPO?.expected_delivery &&
                      format(new Date(selectedPO.expected_delivery), 'dd MMM yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(selectedPO?.total_amount)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="deliveryNote"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Delivery Note Number"
                        placeholder="Enter delivery note number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="receivedBy"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Received By"
                        placeholder="Name of person receiving goods"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="receivedDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="datetime-local"
                        label="Received Date & Time"
                        InputLabelProps={{ shrink: true }}
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

  // Step 2: Physical Inspection
  function renderPhysicalInspection() {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Physical Item Inspection
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Ordered</TableCell>
                  <TableCell align="center">Received</TableCell>
                  <TableCell align="center">Accepted</TableCell>
                  <TableCell align="center">Rejected</TableCell>
                  <TableCell>Location</TableCell>
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
                      <Typography variant="h6">{item.orderedQuantity}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={item.receivedQuantity}
                        onChange={e =>
                          handleQuantityChange(index, 'receivedQuantity', e.target.value)
                        }
                        sx={{ width: 80 }}
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={item.acceptedQuantity}
                        onChange={e =>
                          handleQuantityChange(index, 'acceptedQuantity', e.target.value)
                        }
                        sx={{ width: 80 }}
                        inputProps={{ min: 0, max: item.receivedQuantity }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={item.rejectedQuantity}
                        onChange={e =>
                          handleQuantityChange(index, 'rejectedQuantity', e.target.value)
                        }
                        sx={{ width: 80 }}
                        inputProps={{ min: 0, max: item.receivedQuantity }}
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        size="small"
                        value={item.location}
                        onChange={e => {
                          const newItems = [...currentItems];
                          newItems[index].location = e.target.value;
                          setValue('items', newItems);
                        }}
                        placeholder="Storage location"
                        sx={{ width: 120 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => performQualityCheck(item)}
                      >
                        <Assessment />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
  }

  // Continue with other step implementations...
  function renderQualityControl() {
    return <Typography variant="h6">Quality Control - To be implemented</Typography>;
  }

  function renderThreeWayMatchingStep() {
    return <Typography variant="h6">Three-Way Matching - To be implemented</Typography>;
  }

  function renderFinalApproval() {
    return <Typography variant="h6">Final Approval - To be implemented</Typography>;
  }

  // Helper functions
  function viewReceivingDetails(record) {
    // Implementation for viewing receiving details
  }

  function printReceivingReport(recordId) {
    // Implementation for printing receiving report
  }
};

export default GoodsReceiving;
