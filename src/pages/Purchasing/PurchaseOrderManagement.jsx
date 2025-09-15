// Purchase Order Management - Multi-level authorization & workflow management
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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
} from '@mui/material';
import {
  Assignment,
  Approval,
  CheckCircle,
  Cancel,
  Schedule,
  Warning,
  Info,
  Edit,
  Visibility,
  Print,
  Send,
  AttachMoney,
  Business,
  Person,
  Timeline as TimelineIcon,
  Assessment,
  Download,
  Upload,
  Refresh,
  FilterList,
  Sort,
  MoreVert,
  Comment,
  History,
  Flag,
  Star,
  LocalShipping,
  Receipt,
  ExpandMore,
  PlayArrow,
  Pause,
  Stop,
  Forward,
  Reply,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { purchasesAPI, workflowAPI } from '../../services/api';
import { PageLoading, LoadingSpinner } from '../../components/LoadingComponents';
import { useResponsive } from '../../components/ResponsiveUtils';

// PO Status definitions
const PO_STATUSES = {
  draft: { label: 'Draft', color: 'default', icon: <Edit /> },
  pending_approval: { label: 'Pending Approval', color: 'warning', icon: <Schedule /> },
  approved: { label: 'Approved', color: 'success', icon: <CheckCircle /> },
  rejected: { label: 'Rejected', color: 'error', icon: <Cancel /> },
  sent_to_supplier: { label: 'Sent to Supplier', color: 'info', icon: <Send /> },
  acknowledged: { label: 'Acknowledged', color: 'primary', icon: <Approval /> },
  in_production: { label: 'In Production', color: 'secondary', icon: <PlayArrow /> },
  shipped: { label: 'Shipped', color: 'info', icon: <LocalShipping /> },
  delivered: { label: 'Delivered', color: 'success', icon: <Receipt /> },
  completed: { label: 'Completed', color: 'success', icon: <CheckCircle /> },
  cancelled: { label: 'Cancelled', color: 'error', icon: <Stop /> },
};

// Approval levels
const APPROVAL_LEVELS = [
  { level: 1, role: 'Requestor', title: 'Department Manager', threshold: 0 },
  { level: 2, role: 'Finance', title: 'Finance Manager', threshold: 10000000 },
  { level: 3, role: 'Operations', title: 'Operations Manager', threshold: 50000000 },
  { level: 4, role: 'Executive', title: 'General Manager', threshold: 100000000 },
  { level: 5, role: 'CEO', title: 'Chief Executive Officer', threshold: 500000000 },
];

// Filter options
const FILTER_OPTIONS = {
  status: Object.keys(PO_STATUSES),
  priority: ['urgent', 'high', 'normal', 'low'],
  dateRange: ['today', 'week', 'month', 'quarter', 'year'],
  approval: ['pending', 'approved', 'rejected'],
};

const PurchaseOrderManagement = () => {
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();

  // Component state
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPO, setSelectedPO] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [bulkActionMenuAnchor, setBulkActionMenuAnchor] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dateRange: 'month',
    approval: '',
    search: '',
    supplierId: '',
    departmentId: '',
  });

  // Selection state
  const [selectedPOs, setSelectedPOs] = useState([]);

  // Approval state
  const [approvalComment, setApprovalComment] = useState('');
  const [approvalAction, setApprovalAction] = useState('approve');

  // Fetch PO data with React Query
  const {
    data: purchaseOrders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['purchaseOrders', filters],
    queryFn: () => purchasesAPI.getAll(filters),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    select: data => data.data?.data || [],
  });

  // Fetch dashboard statistics
  const { data: dashboardStats } = useQuery({
    queryKey: ['purchaseOrderStats'],
    queryFn: () => purchasesAPI.getDashboardStats(),
    refetchInterval: 60000,
    select: data => data.data || {},
  });

  // Fetch workflow templates
  const { data: workflowTemplates = [] } = useQuery({
    queryKey: ['workflowTemplates'],
    queryFn: () => workflowAPI.getTemplates(),
    select: data => data.data || [],
  });

  // Approval mutation
  const approvalMutation = useMutation({
    mutationFn: ({ poId, action, comment, level }) =>
      purchasesAPI.processApproval(poId, { action, comment, level }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['purchaseOrders']);
      queryClient.invalidateQueries(['purchaseOrderStats']);
      toast.success(`Purchase order ${variables.action}d successfully`);
      setApprovalDialogOpen(false);
      setApprovalComment('');
    },
    onError: error => {
      toast.error(error.message || 'Failed to process approval');
    },
  });

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: ({ action, poIds, data }) => purchasesAPI.bulkAction(action, poIds, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['purchaseOrders']);
      toast.success(`Bulk ${variables.action} completed successfully`);
      setSelectedPOs([]);
      setBulkActionMenuAnchor(null);
    },
    onError: error => {
      toast.error(error.message || 'Bulk action failed');
    },
  });

  // Status update mutation
  const statusUpdateMutation = useMutation({
    mutationFn: ({ poId, status, data }) => purchasesAPI.updateStatus(poId, status, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['purchaseOrders']);
      toast.success('Status updated successfully');
    },
    onError: error => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  // Filter and search logic
  const filteredPOs = useMemo(() => {
    let filtered = purchaseOrders;

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(po => po.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(po => po.priority === filters.priority);
    }

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        po =>
          po.po_number?.toLowerCase().includes(search) ||
          po.supplier?.name?.toLowerCase().includes(search) ||
          po.description?.toLowerCase().includes(search)
      );
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        today: 1,
        week: 7,
        month: 30,
        quarter: 90,
        year: 365,
      };

      const daysBack = ranges[filters.dateRange];
      if (daysBack) {
        filtered = filtered.filter(po => {
          const poDate = new Date(po.created_at);
          return differenceInDays(now, poDate) <= daysBack;
        });
      }
    }

    return filtered;
  }, [purchaseOrders, filters]);

  // Group POs by status for tabs
  const groupedPOs = useMemo(() => {
    const groups = {
      all: filteredPOs,
      pending: filteredPOs.filter(po => po.status === 'pending_approval'),
      approved: filteredPOs.filter(po => po.status === 'approved'),
      in_progress: filteredPOs.filter(po =>
        ['sent_to_supplier', 'acknowledged', 'in_production', 'shipped'].includes(po.status)
      ),
      completed: filteredPOs.filter(po => po.status === 'completed'),
      cancelled: filteredPOs.filter(po => po.status === 'cancelled'),
    };

    return groups;
  }, [filteredPOs]);

  // Handle PO selection
  const handlePOSelection = useCallback((poId, checked) => {
    setSelectedPOs(prev => {
      if (checked) {
        return [...prev, poId];
      } else {
        return prev.filter(id => id !== poId);
      }
    });
  }, []);

  // Handle select all
  const handleSelectAll = useCallback(
    checked => {
      if (checked) {
        const currentTabPOs = Object.values(groupedPOs)[currentTab] || [];
        setSelectedPOs(currentTabPOs.map(po => po.id));
      } else {
        setSelectedPOs([]);
      }
    },
    [groupedPOs, currentTab]
  );

  // Handle approval action
  const handleApprovalAction = useCallback(
    async action => {
      if (!selectedPO) return;

      const level = determineApprovalLevel(selectedPO.total_amount);

      approvalMutation.mutate({
        poId: selectedPO.id,
        action,
        comment: approvalComment,
        level,
      });
    },
    [selectedPO, approvalComment, approvalMutation]
  );

  // Determine required approval level based on amount
  const determineApprovalLevel = useCallback(amount => {
    for (let i = APPROVAL_LEVELS.length - 1; i >= 0; i--) {
      if (amount >= APPROVAL_LEVELS[i].threshold) {
        return APPROVAL_LEVELS[i].level;
      }
    }
    return 1;
  }, []);

  // Handle bulk actions
  const handleBulkAction = useCallback(
    action => {
      if (selectedPOs.length === 0) {
        toast.warning('Please select purchase orders first');
        return;
      }

      const actionData = {};

      switch (action) {
        case 'approve':
          actionData.comment = 'Bulk approval';
          break;
        case 'reject':
          actionData.comment = 'Bulk rejection';
          break;
        case 'send_to_supplier':
          actionData.notification = true;
          break;
      }

      bulkActionMutation.mutate({
        action,
        poIds: selectedPOs,
        data: actionData,
      });
    },
    [selectedPOs, bulkActionMutation]
  );

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
    const statusConfig = PO_STATUSES[status] || PO_STATUSES.draft;
    return {
      label: statusConfig.label,
      color: statusConfig.color,
      icon: statusConfig.icon,
    };
  };

  // Get priority color
  const getPriorityColor = priority => {
    const colors = {
      urgent: 'error',
      high: 'warning',
      normal: 'info',
      low: 'success',
    };
    return colors[priority] || 'default';
  };

  // Loading state
  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            📋 Purchase Order Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/purchasing/request')}
            >
              New Purchase Request
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => purchasesAPI.exportPOs(filters)}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Dashboard Statistics */}
        {dashboardStats && (
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" color="primary">
                    {dashboardStats.total_pos || 0}
                  </Typography>
                  <Typography variant="caption">Total POs</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" color="warning.main">
                    {dashboardStats.pending_approval || 0}
                  </Typography>
                  <Typography variant="caption">Pending Approval</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(dashboardStats.total_value || 0)}
                  </Typography>
                  <Typography variant="caption">Total Value</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" color="info.main">
                    {dashboardStats.avg_approval_time || 0}h
                  </Typography>
                  <Typography variant="caption">Avg Approval Time</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Filters and Search */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search POs, suppliers..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Autocomplete
              size="small"
              options={FILTER_OPTIONS.status}
              value={filters.status}
              onChange={(_, value) => setFilters(prev => ({ ...prev, status: value }))}
              renderInput={params => <TextField {...params} label="Status" />}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Chip size="small" {...getStatusChip(option)} />
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Autocomplete
              size="small"
              options={FILTER_OPTIONS.priority}
              value={filters.priority}
              onChange={(_, value) => setFilters(prev => ({ ...prev, priority: value }))}
              renderInput={params => <TextField {...params} label="Priority" />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Autocomplete
              size="small"
              options={FILTER_OPTIONS.dateRange}
              value={filters.dateRange}
              onChange={(_, value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              renderInput={params => <TextField {...params} label="Date Range" />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Button variant="outlined" fullWidth startIcon={<Refresh />} onClick={() => refetch()}>
              Refresh
            </Button>
          </Grid>

          <Grid item xs={12} md={1}>
            <IconButton
              onClick={e => setBulkActionMenuAnchor(e.currentTarget)}
              disabled={selectedPOs.length === 0}
            >
              <Badge badgeContent={selectedPOs.length} color="primary">
                <MoreVert />
              </Badge>
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newTab) => setCurrentTab(newTab)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All (${groupedPOs.all?.length || 0})`} />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Pending
                <Chip size="small" color="warning" label={groupedPOs.pending?.length || 0} />
              </Box>
            }
          />
          <Tab label={`Approved (${groupedPOs.approved?.length || 0})`} />
          <Tab label={`In Progress (${groupedPOs.in_progress?.length || 0})`} />
          <Tab label={`Completed (${groupedPOs.completed?.length || 0})`} />
          <Tab label={`Cancelled (${groupedPOs.cancelled?.length || 0})`} />
        </Tabs>
      </Paper>

      {/* PO Table */}
      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedPOs.length > 0 &&
                      selectedPOs.length === (Object.values(groupedPOs)[currentTab]?.length || 0)
                    }
                    indeterminate={
                      selectedPOs.length > 0 &&
                      selectedPOs.length < (Object.values(groupedPOs)[currentTab]?.length || 0)
                    }
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell>PO Number</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell align="center">Approval</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Object.values(groupedPOs)[currentTab] || []).map(po => (
                <TableRow key={po.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPOs.includes(po.id)}
                      onChange={e => handlePOSelection(po.id, e.target.checked)}
                    />
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {po.po_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{po.id}
                      </Typography>
                    </Box>
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
                    <Chip size="small" {...getStatusChip(po.status)} />
                  </TableCell>

                  <TableCell>
                    <Chip size="small" label={po.priority} color={getPriorityColor(po.priority)} />
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(po.total_amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {po.items_count} items
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(po.created_at), 'dd MMM yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(po.created_at), 'HH:mm')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(po.delivery_date), 'dd MMM yyyy')}
                    </Typography>
                    {isAfter(new Date(), new Date(po.delivery_date)) && (
                      <Chip size="small" label="Overdue" color="error" />
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {po.status === 'pending_approval' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            setSelectedPO(po);
                            setApprovalAction('approve');
                            setApprovalDialogOpen(true);
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedPO(po);
                            setApprovalAction('reject');
                            setApprovalDialogOpen(true);
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      </Box>
                    )}

                    {po.approval_progress && (
                      <Tooltip
                        title={`${po.approval_progress.completed}/${po.approval_progress.total} approvals`}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={
                            (po.approval_progress.completed / po.approval_progress.total) * 100
                          }
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedPO(po);
                        setDetailDialogOpen(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedPO(po);
                        setWorkflowDialogOpen(true);
                      }}
                    >
                      <TimelineIcon />
                    </IconButton>

                    <IconButton size="small" onClick={() => purchasesAPI.printPO(po.id)}>
                      <Print />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(Object.values(groupedPOs)[currentTab]?.length || 0) === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No purchase orders found for this filter
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Bulk Action Menu */}
      <Menu
        anchorEl={bulkActionMenuAnchor}
        open={Boolean(bulkActionMenuAnchor)}
        onClose={() => setBulkActionMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction('approve')}>
          <ListItemIcon>
            <CheckCircle color="success" />
          </ListItemIcon>
          <ListItemText>Bulk Approve</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('reject')}>
          <ListItemIcon>
            <Cancel color="error" />
          </ListItemIcon>
          <ListItemText>Bulk Reject</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('send_to_supplier')}>
          <ListItemIcon>
            <Send color="primary" />
          </ListItemIcon>
          <ListItemText>Send to Suppliers</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleBulkAction('export')}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Export Selected</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {renderDialogs()}
    </Box>
  );

  // Render dialogs
  function renderDialogs() {
    return (
      <>
        {/* PO Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Purchase Order Details - {selectedPO?.po_number}</Typography>
              <Chip {...getStatusChip(selectedPO?.status)} />
            </Box>
          </DialogTitle>
          <DialogContent>{selectedPO && renderPODetails(selectedPO)}</DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            <Button variant="contained" startIcon={<Print />}>
              Print PO
            </Button>
          </DialogActions>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog
          open={approvalDialogOpen}
          onClose={() => setApprovalDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {approvalAction === 'approve' ? 'Approve' : 'Reject'} Purchase Order
          </DialogTitle>
          <DialogContent>
            <Alert severity={approvalAction === 'approve' ? 'success' : 'warning'} sx={{ mb: 2 }}>
              You are about to {approvalAction} PO #{selectedPO?.po_number}
              with amount {formatCurrency(selectedPO?.total_amount)}
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comment"
              value={approvalComment}
              onChange={e => setApprovalComment(e.target.value)}
              placeholder={`Enter reason for ${approvalAction}ing this purchase order...`}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color={approvalAction === 'approve' ? 'success' : 'error'}
              onClick={() => handleApprovalAction(approvalAction)}
              disabled={!approvalComment.trim() || approvalMutation.isPending}
              startIcon={
                approvalMutation.isPending ? (
                  <LoadingSpinner size={20} />
                ) : approvalAction === 'approve' ? (
                  <CheckCircle />
                ) : (
                  <Cancel />
                )
              }
            >
              {approvalMutation.isPending
                ? 'Processing...'
                : approvalAction === 'approve'
                  ? 'Approve'
                  : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Workflow Timeline Dialog */}
        <Dialog
          open={workflowDialogOpen}
          onClose={() => setWorkflowDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Workflow Timeline - {selectedPO?.po_number}</DialogTitle>
          <DialogContent>{selectedPO && renderWorkflowTimeline(selectedPO)}</DialogContent>
          <DialogActions>
            <Button onClick={() => setWorkflowDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Render PO details
  function renderPODetails(po) {
    return (
      <Grid container spacing={3}>
        {/* Header Information */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    PO Number
                  </Typography>
                  <Typography variant="h6">{po.po_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(po.total_amount)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1">{po.supplier?.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Delivery Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(po.delivery_date), 'dd MMMM yyyy')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {po.items?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2">{item.product_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.product_code}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }

  // Render workflow timeline
  function renderWorkflowTimeline(po) {
    const workflowSteps = [
      { label: 'Request Created', status: 'completed', date: po.created_at },
      {
        label: 'Pending Approval',
        status: po.status === 'pending_approval' ? 'active' : 'completed',
        date: po.created_at,
      },
      {
        label: 'Approved',
        status:
          po.status === 'approved'
            ? 'active'
            : po.status === 'pending_approval'
              ? 'pending'
              : 'completed',
        date: po.approved_at,
      },
      {
        label: 'Sent to Supplier',
        status: po.status === 'sent_to_supplier' ? 'active' : 'pending',
        date: po.sent_at,
      },
      {
        label: 'Acknowledged',
        status: po.status === 'acknowledged' ? 'active' : 'pending',
        date: po.acknowledged_at,
      },
      {
        label: 'In Production',
        status: po.status === 'in_production' ? 'active' : 'pending',
        date: po.production_start,
      },
      {
        label: 'Shipped',
        status: po.status === 'shipped' ? 'active' : 'pending',
        date: po.shipped_at,
      },
      {
        label: 'Delivered',
        status: po.status === 'delivered' ? 'active' : 'pending',
        date: po.delivered_at,
      },
      {
        label: 'Completed',
        status: po.status === 'completed' ? 'active' : 'pending',
        date: po.completed_at,
      },
    ];

    return (
      <Timeline>
        {workflowSteps.map((step, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot
                color={
                  step.status === 'completed'
                    ? 'success'
                    : step.status === 'active'
                      ? 'primary'
                      : 'grey'
                }
              >
                {step.status === 'completed' ? (
                  <CheckCircle />
                ) : step.status === 'active' ? (
                  <Schedule />
                ) : (
                  <Circle />
                )}
              </TimelineDot>
              {index < workflowSteps.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2">{step.label}</Typography>
              {step.date && (
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(step.date), 'dd MMM yyyy HH:mm')}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    );
  }
};

export default PurchaseOrderManagement;
