// Supplier Dashboard - Performance tracking & analytics
import React, { useState, useEffect, useMemo } from 'react';
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
  Avatar,
  Rating,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  TrendingDown,
  Assessment,
  Star,
  LocalShipping,
  Schedule,
  AttachMoney,
  Warning,
  CheckCircle,
  Cancel,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  Visibility,
  Edit,
  Add,
  Refresh,
  Download,
  FilterList,
  Sort,
  Search,
  ExpandMore,
  Phone,
  Email,
  LocationOn,
  Event,
  MonetizationOn,
  Inventory,
  Speed,
  Quality,
  Support,
  History,
  Compare,
  Flag,
  NotificationsActive,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { suppliersAPI, performanceAPI, analyticsAPI } from '../../services/api';
import { PageLoading, LoadingSpinner } from '../../components/LoadingComponents';
import { useResponsive } from '../../components/ResponsiveUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Performance metrics configuration
const PERFORMANCE_METRICS = [
  {
    key: 'onTimeDelivery',
    label: 'On-Time Delivery',
    icon: <Schedule />,
    color: 'primary',
    format: 'percentage',
    weight: 0.3,
  },
  {
    key: 'qualityScore',
    label: 'Quality Score',
    icon: <Star />,
    color: 'warning',
    format: 'percentage',
    weight: 0.25,
  },
  {
    key: 'priceCompetitiveness',
    label: 'Price Competitiveness',
    icon: <AttachMoney />,
    color: 'success',
    format: 'percentage',
    weight: 0.2,
  },
  {
    key: 'communicationRating',
    label: 'Communication',
    icon: <Support />,
    color: 'info',
    format: 'rating',
    weight: 0.15,
  },
  {
    key: 'flexibilityScore',
    label: 'Flexibility',
    icon: <Speed />,
    color: 'secondary',
    format: 'percentage',
    weight: 0.1,
  },
];

// Supplier categories
const SUPPLIER_CATEGORIES = [
  { value: 'strategic', label: 'Strategic Partners', color: 'success' },
  { value: 'preferred', label: 'Preferred Suppliers', color: 'primary' },
  { value: 'approved', label: 'Approved Vendors', color: 'info' },
  { value: 'conditional', label: 'Conditional', color: 'warning' },
  { value: 'restricted', label: 'Restricted', color: 'error' },
];

// Risk levels
const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', color: 'success' },
  { value: 'medium', label: 'Medium Risk', color: 'warning' },
  { value: 'high', label: 'High Risk', color: 'error' },
  { value: 'critical', label: 'Critical Risk', color: 'error' },
];

const SupplierDashboard = () => {
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();

  // Component state
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    riskLevel: '',
    performance: '',
    location: '',
    search: '',
    dateRange: '6months',
  });

  // Analysis state
  const [analysisType, setAnalysisType] = useState('performance');
  const [timeframe, setTimeframe] = useState('6months');

  // Fetch suppliers data
  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => suppliersAPI.getAll(filters),
    select: data => data.data?.data || [],
  });

  // Fetch performance analytics
  const { data: performanceData = {}, isLoading: loadingPerformance } = useQuery({
    queryKey: ['supplierPerformance', timeframe],
    queryFn: () => performanceAPI.getSupplierPerformance(timeframe),
    select: data => data.data || {},
  });

  // Fetch dashboard statistics
  const { data: dashboardStats = {} } = useQuery({
    queryKey: ['supplierDashboardStats'],
    queryFn: () => analyticsAPI.getSupplierDashboardStats(),
    select: data => data.data || {},
  });

  // Fetch supplier trends
  const { data: trends = {} } = useQuery({
    queryKey: ['supplierTrends', timeframe],
    queryFn: () => analyticsAPI.getSupplierTrends(timeframe),
    select: data => data.data || {},
  });

  // Update supplier evaluation mutation
  const updateEvaluationMutation = useMutation({
    mutationFn: ({ supplierId, evaluation }) =>
      performanceAPI.updateSupplierEvaluation(supplierId, evaluation),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers']);
      queryClient.invalidateQueries(['supplierPerformance']);
      toast.success('Supplier evaluation updated successfully');
      setEvaluationDialogOpen(false);
    },
    onError: error => {
      toast.error(error.message || 'Failed to update evaluation');
    },
  });

  // Calculate enriched supplier data with performance metrics
  const enrichedSuppliers = useMemo(() => {
    return suppliers.map(supplier => {
      const performance = performanceData[supplier.id] || {};

      // Calculate overall score
      const overallScore = PERFORMANCE_METRICS.reduce((score, metric) => {
        const value = performance[metric.key] || 0;
        const normalizedValue = metric.format === 'rating' ? (value / 5) * 100 : value;
        return score + normalizedValue * metric.weight;
      }, 0);

      // Determine category and risk level
      const category =
        overallScore >= 90
          ? 'strategic'
          : overallScore >= 80
            ? 'preferred'
            : overallScore >= 70
              ? 'approved'
              : overallScore >= 60
                ? 'conditional'
                : 'restricted';

      const riskLevel =
        overallScore >= 80
          ? 'low'
          : overallScore >= 70
            ? 'medium'
            : overallScore >= 60
              ? 'high'
              : 'critical';

      return {
        ...supplier,
        performance,
        overallScore,
        category,
        riskLevel,
        totalOrders: performance.totalOrders || 0,
        totalValue: performance.totalValue || 0,
        lastOrderDate: performance.lastOrderDate,
        avgDeliveryTime: performance.avgDeliveryTime || 0,
        defectRate: performance.defectRate || 0,
        trend: performance.trend || 'stable',
      };
    });
  }, [suppliers, performanceData]);

  // Filter suppliers based on current filters
  const filteredSuppliers = useMemo(() => {
    let filtered = enrichedSuppliers;

    if (filters.category) {
      filtered = filtered.filter(s => s.category === filters.category);
    }

    if (filters.riskLevel) {
      filtered = filtered.filter(s => s.riskLevel === filters.riskLevel);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.nama?.toLowerCase().includes(search) ||
          s.kode_supplier?.toLowerCase().includes(search) ||
          s.alamat?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [enrichedSuppliers, filters]);

  // Group suppliers by category for analysis
  const suppliersByCategory = useMemo(() => {
    const groups = {};
    SUPPLIER_CATEGORIES.forEach(cat => {
      groups[cat.value] = filteredSuppliers.filter(s => s.category === cat.value);
    });
    return groups;
  }, [filteredSuppliers]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSuppliers = filteredSuppliers.length;
    const activeSuppliers = filteredSuppliers.filter(s => s.status === true).length;
    const averageScore =
      filteredSuppliers.reduce((sum, s) => sum + s.overallScore, 0) / totalSuppliers || 0;
    const highRiskCount = filteredSuppliers.filter(
      s => s.riskLevel === 'high' || s.riskLevel === 'critical'
    ).length;
    const totalValue = filteredSuppliers.reduce((sum, s) => sum + (s.totalValue || 0), 0);

    return {
      totalSuppliers,
      activeSuppliers,
      averageScore,
      highRiskCount,
      totalValue,
      onTimeDeliveryAvg:
        filteredSuppliers.reduce((sum, s) => sum + (s.performance.onTimeDelivery || 0), 0) /
          totalSuppliers || 0,
      qualityScoreAvg:
        filteredSuppliers.reduce((sum, s) => sum + (s.performance.qualityScore || 0), 0) /
          totalSuppliers || 0,
    };
  }, [filteredSuppliers]);

  // Chart data preparation
  const performanceChartData = useMemo(() => {
    const categories = SUPPLIER_CATEGORIES.map(cat => cat.label);
    const counts = SUPPLIER_CATEGORIES.map(
      cat => filteredSuppliers.filter(s => s.category === cat.value).length
    );

    return {
      labels: categories,
      datasets: [
        {
          label: 'Number of Suppliers',
          data: counts,
          backgroundColor: SUPPLIER_CATEGORIES.map(cat => {
            const colors = {
              success: '#4caf50',
              primary: '#2196f3',
              info: '#00bcd4',
              warning: '#ff9800',
              error: '#f44336',
            };
            return colors[cat.color];
          }),
        },
      ],
    };
  }, [filteredSuppliers]);

  const trendChartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return format(date, 'MMM yyyy');
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Average Performance Score',
          data: months.map(() => Math.random() * 20 + 75), // Mock data
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
        },
        {
          label: 'On-Time Delivery %',
          data: months.map(() => Math.random() * 15 + 80), // Mock data
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, []);

  // Handle supplier selection for comparison
  const handleSupplierSelect = (supplier, selected) => {
    if (selected) {
      setSelectedSuppliers(prev => [...prev, supplier]);
    } else {
      setSelectedSuppliers(prev => prev.filter(s => s.id !== supplier.id));
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

  // Get category chip props
  const getCategoryChip = category => {
    const config = SUPPLIER_CATEGORIES.find(c => c.value === category);
    return config
      ? { label: config.label, color: config.color }
      : { label: 'Unknown', color: 'default' };
  };

  // Get risk level chip props
  const getRiskChip = riskLevel => {
    const config = RISK_LEVELS.find(r => r.value === riskLevel);
    return config
      ? { label: config.label, color: config.color }
      : { label: 'Unknown', color: 'default' };
  };

  // Loading state
  if (loadingSuppliers || loadingPerformance) {
    return <PageLoading />;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            🏢 Supplier Performance Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Compare />}
              disabled={selectedSuppliers.length < 2}
              onClick={() => setCompareDialogOpen(true)}
            >
              Compare ({selectedSuppliers.length})
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => analyticsAPI.exportSupplierReport(filters)}
            >
              Export Report
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={2}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="primary">
                  {kpis.totalSuppliers}
                </Typography>
                <Typography variant="caption">Total Suppliers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="success.main">
                  {kpis.activeSuppliers}
                </Typography>
                <Typography variant="caption">Active Suppliers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="warning.main">
                  {kpis.averageScore.toFixed(1)}%
                </Typography>
                <Typography variant="caption">Avg Performance</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="error.main">
                  {kpis.highRiskCount}
                </Typography>
                <Typography variant="caption">High Risk</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="info.main">
                  {kpis.onTimeDeliveryAvg.toFixed(1)}%
                </Typography>
                <Typography variant="caption">On-Time Delivery</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} md={2}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="h6" color="secondary.main">
                  {formatCurrency(kpis.totalValue)}
                </Typography>
                <Typography variant="caption">Total Value</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters and Search */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search suppliers..."
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
              options={SUPPLIER_CATEGORIES}
              value={SUPPLIER_CATEGORIES.find(c => c.value === filters.category) || null}
              onChange={(_, value) =>
                setFilters(prev => ({ ...prev, category: value?.value || '' }))
              }
              getOptionLabel={option => option.label}
              renderInput={params => <TextField {...params} label="Category" />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Autocomplete
              size="small"
              options={RISK_LEVELS}
              value={RISK_LEVELS.find(r => r.value === filters.riskLevel) || null}
              onChange={(_, value) =>
                setFilters(prev => ({ ...prev, riskLevel: value?.value || '' }))
              }
              getOptionLabel={option => option.label}
              renderInput={params => <TextField {...params} label="Risk Level" />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Autocomplete
              size="small"
              options={['3months', '6months', '1year', '2years']}
              value={timeframe}
              onChange={(_, value) => setTimeframe(value || '6months')}
              getOptionLabel={option => {
                const labels = {
                  '3months': '3 Months',
                  '6months': '6 Months',
                  '1year': '1 Year',
                  '2years': '2 Years',
                };
                return labels[option] || option;
              }}
              renderInput={params => <TextField {...params} label="Timeframe" />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Refresh />}
              onClick={() => {
                queryClient.invalidateQueries(['suppliers']);
                queryClient.invalidateQueries(['supplierPerformance']);
              }}
            >
              Refresh
            </Button>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<FilterList />}
              onClick={() =>
                setFilters({
                  category: '',
                  riskLevel: '',
                  performance: '',
                  location: '',
                  search: '',
                  dateRange: '6months',
                })
              }
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Charts Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Analytics
            </Typography>

            <Tabs
              value={analysisType}
              onChange={(_, value) => setAnalysisType(value)}
              sx={{ mb: 3 }}
            >
              <Tab value="performance" label="Performance Overview" />
              <Tab value="trends" label="Performance Trends" />
              <Tab value="categories" label="Category Distribution" />
            </Tabs>

            <Box sx={{ height: 400 }}>
              {analysisType === 'performance' && (
                <Bar
                  data={performanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Supplier Distribution by Category',
                      },
                    },
                  }}
                />
              )}

              {analysisType === 'trends' && (
                <Line
                  data={trendChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Performance Trends Over Time',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                      },
                    },
                  }}
                />
              )}

              {analysisType === 'categories' && (
                <Doughnut
                  data={performanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Supplier Category Distribution',
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Insights */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚨 Alerts & Insights
            </Typography>

            <List>
              {kpis.highRiskCount > 0 && (
                <ListItem>
                  <ListItemIcon>
                    <Warning color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="High Risk Suppliers"
                    secondary={`${kpis.highRiskCount} suppliers need immediate attention`}
                  />
                </ListItem>
              )}

              {kpis.onTimeDeliveryAvg < 85 && (
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Delivery Performance"
                    secondary="Overall on-time delivery below target (85%)"
                  />
                </ListItem>
              )}

              {kpis.qualityScoreAvg < 80 && (
                <ListItem>
                  <ListItemIcon>
                    <Star color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Quality Concerns"
                    secondary="Average quality score below benchmark"
                  />
                </ListItem>
              )}

              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Top Performers"
                  secondary={`${suppliersByCategory.strategic?.length || 0} strategic partners identified`}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Top Performers */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🏆 Top Performers
            </Typography>

            <List>
              {filteredSuppliers
                .sort((a, b) => b.overallScore - a.overallScore)
                .slice(0, 5)
                .map((supplier, index) => (
                  <ListItem key={supplier.id}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={supplier.nama}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={supplier.overallScore / 20} readOnly size="small" />
                          <Typography variant="caption">
                            {supplier.overallScore.toFixed(1)}%
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Suppliers Table */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedSuppliers.length > 0 &&
                          selectedSuppliers.length < filteredSuppliers.length
                        }
                        checked={selectedSuppliers.length === filteredSuppliers.length}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedSuppliers(filteredSuppliers);
                          } else {
                            setSelectedSuppliers([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Overall Score</TableCell>
                    <TableCell>On-Time Delivery</TableCell>
                    <TableCell>Quality Score</TableCell>
                    <TableCell>Risk Level</TableCell>
                    <TableCell align="right">Total Value</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSuppliers.map(supplier => (
                    <TableRow key={supplier.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSuppliers.some(s => s.id === supplier.id)}
                          onChange={e => handleSupplierSelect(supplier, e.target.checked)}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {supplier.nama?.[0] || 'S'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {supplier.nama}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {supplier.kode_supplier}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <LocationOn sx={{ fontSize: 12 }} />
                              <Typography variant="caption">{supplier.alamat}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip size="small" {...getCategoryChip(supplier.category)} />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress
                            variant="determinate"
                            value={supplier.overallScore}
                            size={32}
                            color={
                              supplier.overallScore >= 80
                                ? 'success'
                                : supplier.overallScore >= 70
                                  ? 'warning'
                                  : 'error'
                            }
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {supplier.overallScore.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={supplier.performance.onTimeDelivery || 0}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                            color={
                              supplier.performance.onTimeDelivery >= 90
                                ? 'success'
                                : supplier.performance.onTimeDelivery >= 80
                                  ? 'warning'
                                  : 'error'
                            }
                          />
                          <Typography variant="caption">
                            {(supplier.performance.onTimeDelivery || 0).toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Rating
                          value={(supplier.performance.qualityScore || 0) / 20}
                          readOnly
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip size="small" {...getRiskChip(supplier.riskLevel)} />
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(supplier.totalValue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {supplier.totalOrders} orders
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setEvaluationDialogOpen(true);
                          }}
                        >
                          <Assessment />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredSuppliers.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No suppliers found for the current filters
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      {renderDialogs()}
    </Box>
  );

  // Render dialogs
  function renderDialogs() {
    return (
      <>
        {/* Supplier Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Supplier Details - {selectedSupplier?.nama}</Typography>
              <Chip {...getCategoryChip(selectedSupplier?.category)} />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedSupplier && renderSupplierDetails(selectedSupplier)}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            <Button variant="contained">Edit Supplier</Button>
          </DialogActions>
        </Dialog>

        {/* Other dialogs would be implemented here */}
      </>
    );
  }

  // Render supplier details
  function renderSupplierDetails(supplier) {
    return (
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Supplier Code
                  </Typography>
                  <Typography variant="body1">{supplier.kode_supplier}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Contact Person
                  </Typography>
                  <Typography variant="body1">{supplier.kontak_person || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{supplier.alamat}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{supplier.telepon || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{supplier.email || 'N/A'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <List>
                {PERFORMANCE_METRICS.map(metric => {
                  const value = supplier.performance[metric.key] || 0;
                  const displayValue = metric.format === 'rating' ? value : `${value.toFixed(1)}%`;

                  return (
                    <ListItem key={metric.key}>
                      <ListItemIcon>{metric.icon}</ListItemIcon>
                      <ListItemText
                        primary={metric.label}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {metric.format === 'rating' ? (
                              <Rating value={value} readOnly size="small" />
                            ) : (
                              <LinearProgress
                                variant="determinate"
                                value={value}
                                sx={{ width: 100, height: 6, borderRadius: 3 }}
                                color={value >= 80 ? 'success' : value >= 60 ? 'warning' : 'error'}
                              />
                            )}
                            <Typography variant="caption">{displayValue}</Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
};

export default SupplierDashboard;
