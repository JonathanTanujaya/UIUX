// Advanced Reporting Engine - Dynamic Report Builder
import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Toolbar,
  AppBar,
  IconButton,
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  LineChart,
  PieChart,
  Assessment,
  TableChart,
  Timeline,
  ShowChart,
  TrendingUp,
  FilterList,
  CalendarToday,
  Download,
  Print,
  Share,
  Save,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  DragIndicator,
  ExpandMore,
  Close,
  Refresh,
  Fullscreen,
  FullscreenExit,
  Dashboard,
  GridView,
  ViewList,
  Analytics,
  PictureAsPdf,
  TableView,
  InsertChart,
  DataUsage,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FixedSizeList as List } from 'react-window';
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
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Import APIs
import { reportsAPI, dashboardAPI } from '../../services/api';

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
  ArcElement,
  RadialLinearScale
);

// Report Types Configuration
const REPORT_TYPES = [
  {
    id: 'stock_reports',
    name: 'Stock Reports',
    icon: <Inventory />,
    color: 'primary',
    reports: [
      { id: 'stock_summary', name: 'Stock Summary', endpoint: 'stokBarang' },
      { id: 'stock_movement', name: 'Stock Movement', endpoint: 'kartuStok' },
      { id: 'stock_valuation', name: 'Stock Valuation', endpoint: 'stokBarang' },
      { id: 'reorder_points', name: 'Reorder Points', endpoint: 'stokBarang' },
      { id: 'stock_aging', name: 'Stock Aging', endpoint: 'stokBarang' },
    ],
  },
  {
    id: 'sales_analytics',
    name: 'Sales Analytics',
    icon: <TrendingUp />,
    color: 'success',
    reports: [
      { id: 'sales_summary', name: 'Sales Summary', endpoint: 'penjualan' },
      { id: 'sales_by_customer', name: 'Sales by Customer', endpoint: 'penjualan' },
      { id: 'sales_by_product', name: 'Sales by Product', endpoint: 'penjualan' },
      { id: 'sales_trend', name: 'Sales Trend', endpoint: 'penjualan' },
      { id: 'commission_report', name: 'Commission Report', endpoint: 'komisiSales' },
    ],
  },
  {
    id: 'purchase_analysis',
    name: 'Purchase Analysis',
    icon: <ShoppingCart />,
    color: 'info',
    reports: [
      { id: 'purchase_summary', name: 'Purchase Summary', endpoint: 'pembelian' },
      { id: 'purchase_by_supplier', name: 'Purchase by Supplier', endpoint: 'pembelian' },
      { id: 'purchase_items', name: 'Purchase Items', endpoint: 'pembelianItem' },
      { id: 'supplier_performance', name: 'Supplier Performance', endpoint: 'pembelian' },
      { id: 'purchase_returns', name: 'Purchase Returns', endpoint: 'returnSales' },
    ],
  },
  {
    id: 'financial_summaries',
    name: 'Financial Summaries',
    icon: <AttachMoney />,
    color: 'warning',
    reports: [
      { id: 'cogs_analysis', name: 'COGS Analysis', endpoint: 'cogs' },
    ],
  },
  {
    id: 'customer_insights',
    name: 'Customer Insights',
    icon: <People />,
    color: 'secondary',
    reports: [
      { id: 'customer_payments', name: 'Customer Payments', endpoint: 'pembayaranCustomer' },
      { id: 'outstanding_invoices', name: 'Outstanding Invoices', endpoint: 'tagihan' },
      { id: 'aging_report', name: 'Aging Report', endpoint: 'tagihan' },
      { id: 'customer_analysis', name: 'Customer Analysis', endpoint: 'penjualan' },
      { id: 'credit_limits', name: 'Credit Limits', endpoint: 'tagihan' },
    ],
  },
];

// Visualization Types
const CHART_TYPES = [
  { id: 'table', name: 'Table', icon: <TableView />, component: 'DataTable' },
  { id: 'bar', name: 'Bar Chart', icon: <BarChart />, component: 'BarChart' },
  { id: 'line', name: 'Line Chart', icon: <ShowChart />, component: 'LineChart' },
  { id: 'pie', name: 'Pie Chart', icon: <PieChart />, component: 'PieChart' },
  { id: 'doughnut', name: 'Doughnut', icon: <DataUsage />, component: 'DoughnutChart' },
  { id: 'area', name: 'Area Chart', icon: <Timeline />, component: 'AreaChart' },
  { id: 'radar', name: 'Radar Chart', icon: <Analytics />, component: 'RadarChart' },
  { id: 'polar', name: 'Polar Area', icon: <InsertChart />, component: 'PolarChart' },
];

// Date Range Presets
const DATE_PRESETS = [
  { id: 'today', name: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
  {
    id: 'yesterday',
    name: 'Yesterday',
    getValue: () => ({ start: subDays(new Date(), 1), end: subDays(new Date(), 1) }),
  },
  {
    id: 'last7days',
    name: 'Last 7 Days',
    getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }),
  },
  {
    id: 'last30days',
    name: 'Last 30 Days',
    getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }),
  },
  {
    id: 'thismonth',
    name: 'This Month',
    getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }),
  },
  {
    id: 'lastmonth',
    name: 'Last Month',
    getValue: () => ({
      start: startOfMonth(subMonths(new Date(), 1)),
      end: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    id: 'thisyear',
    name: 'This Year',
    getValue: () => ({ start: startOfYear(new Date()), end: endOfYear(new Date()) }),
  },
  {
    id: 'lastyear',
    name: 'Last Year',
    getValue: () => ({
      start: startOfYear(subYears(new Date(), 1)),
      end: endOfYear(subYears(new Date(), 1)),
    }),
  },
  { id: 'custom', name: 'Custom Range', getValue: null },
];

// Main Reporting Engine Component
const ReportingEngine = () => {
  const queryClient = useQueryClient();

  // State Management
  const [currentView, setCurrentView] = useState('builder'); // builder, dashboard, preview
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportConfig, setReportConfig] = useState({
    title: '',
    description: '',
    dateRange: 'last30days',
    customDateStart: null,
    customDateEnd: null,
    filters: {},
    groupBy: [],
    sortBy: [],
    visualizations: [],
    layout: 'grid',
    refreshInterval: 0,
    isRealTime: false,
  });
  const [dashboardWidgets, setDashboardWidgets] = useState([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [fullscreenWidget, setFullscreenWidget] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Report Data Query
  const {
    data: reportData,
    isLoading: isLoadingData,
    error: dataError,
    refetch,
  } = useQuery({
    queryKey: ['reportData', selectedReport, reportConfig],
    queryFn: async () => {
      if (!selectedReport) return null;
      const endpoint = REPORT_TYPES.flatMap(type => type.reports).find(
        report => report.id === selectedReport
      )?.endpoint;

      if (!endpoint) throw new Error('Report endpoint not found');

      return await reportsAPI[endpoint]();
    },
    enabled: !!selectedReport,
    refetchInterval: reportConfig.isRealTime ? reportConfig.refreshInterval * 1000 : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Dashboard Stats Query
  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardAPI.getStats(),
    refetchInterval: 30000, // 30 seconds
  });

  // Generate Report Mutation
  const generateReportMutation = useMutation({
    mutationFn: async config => {
      setIsGenerating(true);
      // Simulate API call for report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, reportId: Date.now().toString() };
    },
    onSuccess: result => {
      toast.success('Report generated successfully!');
      setIsGenerating(false);
    },
    onError: error => {
      toast.error(`Failed to generate report: ${error.message}`);
      setIsGenerating(false);
    },
  });

  // Processed Report Data
  const processedData = useMemo(() => {
    if (!reportData?.data) return null;

    let data = Array.isArray(reportData.data) ? reportData.data : [];

    // Apply date filtering
    if (reportConfig.dateRange !== 'all' && data.length > 0) {
      let dateRange;
      if (reportConfig.dateRange === 'custom') {
        if (reportConfig.customDateStart && reportConfig.customDateEnd) {
          dateRange = { start: reportConfig.customDateStart, end: reportConfig.customDateEnd };
        }
      } else {
        const preset = DATE_PRESETS.find(p => p.id === reportConfig.dateRange);
        if (preset?.getValue) {
          dateRange = preset.getValue();
        }
      }

      if (dateRange) {
        data = data.filter(item => {
          const itemDate = new Date(
            item.tanggal || item.tglfaktur || item.tglpenerimaan || item.created_at
          );
          return isWithinInterval(itemDate, dateRange);
        });
      }
    }

    // Apply additional filters
    Object.entries(reportConfig.filters).forEach(([key, value]) => {
      if (value && value !== '') {
        data = data.filter(item => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply grouping
    if (reportConfig.groupBy.length > 0) {
      const grouped = {};
      data.forEach(item => {
        const groupKey = reportConfig.groupBy.map(field => item[field] || 'Unknown').join(' - ');
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(item);
      });
      data = grouped;
    }

    // Apply sorting
    if (reportConfig.sortBy.length > 0) {
      data.sort((a, b) => {
        for (const sortField of reportConfig.sortBy) {
          const { field, direction } = sortField;
          const aVal = a[field] || '';
          const bVal = b[field] || '';

          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [reportData, reportConfig]);

  // Chart Data Transformation
  const transformDataForChart = useCallback((data, chartType, xField, yField) => {
    if (!data || !Array.isArray(data)) return null;

    switch (chartType) {
      case 'bar':
      case 'line':
        return {
          labels: data.map(item => item[xField] || 'Unknown'),
          datasets: [
            {
              label: yField,
              data: data.map(item => parseFloat(item[yField]) || 0),
              backgroundColor:
                chartType === 'bar' ? 'rgba(54, 162, 235, 0.8)' : 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              fill: chartType === 'line',
            },
          ],
        };

      case 'pie':
      case 'doughnut':
        const aggregated = {};
        data.forEach(item => {
          const key = item[xField] || 'Unknown';
          aggregated[key] = (aggregated[key] || 0) + (parseFloat(item[yField]) || 0);
        });

        return {
          labels: Object.keys(aggregated),
          datasets: [
            {
              data: Object.values(aggregated),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#C9CBCF',
                '#4BC0C0',
                '#FF6384',
              ],
            },
          ],
        };

      default:
        return null;
    }
  }, []);

  // Export Functions
  const exportToPDF = useCallback(async () => {
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(20);
    pdf.text(reportConfig.title || 'Report', 20, 30);

    // Add date
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${format(new Date(), 'PPP', { locale: idLocale })}`, 20, 45);

    // Add table if data exists
    if (processedData && Array.isArray(processedData)) {
      const columns = Object.keys(processedData[0] || {});
      const rows = processedData.map(item => columns.map(col => item[col] || ''));

      pdf.autoTable({
        head: [columns],
        body: rows,
        startY: 60,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [54, 162, 235] },
      });
    }

    pdf.save(`${reportConfig.title || 'report'}.pdf`);
    toast.success('PDF exported successfully!');
  }, [processedData, reportConfig]);

  const exportToExcel = useCallback(async () => {
    if (!processedData || !Array.isArray(processedData)) {
      toast.error('No data to export');
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(processedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
    XLSX.writeFile(workbook, `${reportConfig.title || 'report'}.xlsx`);
    toast.success('Excel exported successfully!');
  }, [processedData, reportConfig]);

  // Drag and Drop Handler
  const handleDragEnd = result => {
    if (!result.destination) return;

    const items = Array.from(dashboardWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDashboardWidgets(items);
  };

  // Widget Management
  const addWidget = config => {
    const newWidget = {
      id: Date.now().toString(),
      ...config,
      position: { x: 0, y: 0, w: 6, h: 4 },
    };
    setDashboardWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = widgetId => {
    setDashboardWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const updateWidget = (widgetId, updates) => {
    setDashboardWidgets(prev => prev.map(w => (w.id === widgetId ? { ...w, ...updates } : w)));
  };

  // Render Methods
  const renderReportBuilder = () => (
    <Grid container spacing={3}>
      {/* Report Type Selection */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: 'fit-content' }}>
          <Typography variant="h6" gutterBottom>
            📊 Report Types
          </Typography>
          <List>
            {REPORT_TYPES.map(type => (
              <ListItem
                key={type.id}
                button
                selected={selectedReportType === type.id}
                onClick={() => setSelectedReportType(type.id)}
              >
                <ListItemIcon>{type.icon}</ListItemIcon>
                <ListItemText primary={type.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Report Selection */}
      {selectedReportType && (
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              📋 Reports
            </Typography>
            <List>
              {REPORT_TYPES.find(type => type.id === selectedReportType)?.reports.map(report => (
                <ListItem
                  key={report.id}
                  button
                  selected={selectedReport === report.id}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <ListItemText primary={report.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      )}

      {/* Configuration Panel */}
      {selectedReport && (
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⚙️ Report Configuration
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Title"
                  value={reportConfig.title}
                  onChange={e => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={reportConfig.description}
                  onChange={e =>
                    setReportConfig(prev => ({ ...prev, description: e.target.value }))
                  }
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={reportConfig.dateRange}
                    onChange={e =>
                      setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))
                    }
                  >
                    {DATE_PRESETS.map(preset => (
                      <MenuItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {reportConfig.dateRange === 'custom' && (
                <>
                  <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
                      <DatePicker
                        label="Start Date"
                        value={reportConfig.customDateStart}
                        onChange={date =>
                          setReportConfig(prev => ({ ...prev, customDateStart: date }))
                        }
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
                      <DatePicker
                        label="End Date"
                        value={reportConfig.customDateEnd}
                        onChange={date =>
                          setReportConfig(prev => ({ ...prev, customDateEnd: date }))
                        }
                        renderInput={params => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  📈 Visualizations
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {CHART_TYPES.map(chart => (
                    <Chip
                      key={chart.id}
                      icon={chart.icon}
                      label={chart.name}
                      clickable
                      color={reportConfig.visualizations.includes(chart.id) ? 'primary' : 'default'}
                      onClick={() => {
                        setReportConfig(prev => ({
                          ...prev,
                          visualizations: prev.visualizations.includes(chart.id)
                            ? prev.visualizations.filter(v => v !== chart.id)
                            : [...prev.visualizations, chart.id],
                        }));
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={reportConfig.isRealTime}
                      onChange={e =>
                        setReportConfig(prev => ({ ...prev, isRealTime: e.target.checked }))
                      }
                    />
                  }
                  label="Real-time Updates"
                />
              </Grid>

              {reportConfig.isRealTime && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Refresh Interval (seconds)"
                    value={reportConfig.refreshInterval}
                    onChange={e =>
                      setReportConfig(prev => ({
                        ...prev,
                        refreshInterval: parseInt(e.target.value) || 30,
                      }))
                    }
                    inputProps={{ min: 10, max: 300 }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => generateReportMutation.mutate(reportConfig)}
                    disabled={isGenerating}
                    startIcon={isGenerating ? <CircularProgress size={20} /> : <Assessment />}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setCurrentView('preview')}
                    startIcon={<Visibility />}
                    disabled={!processedData}
                  >
                    Preview
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  const renderReportPreview = () => (
    <Box>
      {/* Preview Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5">{reportConfig.title || 'Report Preview'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {reportConfig.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Generated on: {format(new Date(), 'PPpp', { locale: idLocale })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Print />} onClick={() => window.print()}>
              Print
            </Button>
            <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={exportToPDF}>
              PDF
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={exportToExcel}>
              Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={() => setShareDialogOpen(true)}
            >
              Share
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Data Loading State */}
      {isLoadingData && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {dataError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load data: {dataError.message}
        </Alert>
      )}

      {/* Report Content */}
      {processedData && (
        <Grid container spacing={3}>
          {reportConfig.visualizations.map((vizType, index) => (
            <Grid item xs={12} md={vizType === 'table' ? 12 : 6} key={index}>
              <Paper sx={{ p: 2 }}>{renderVisualization(vizType, processedData)}</Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderVisualization = (type, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    const firstItem = data[0];
    const numericFields = Object.keys(firstItem).filter(
      key => !isNaN(parseFloat(firstItem[key])) && isFinite(firstItem[key])
    );
    const textFields = Object.keys(firstItem).filter(
      key => isNaN(parseFloat(firstItem[key])) || !isFinite(firstItem[key])
    );

    switch (type) {
      case 'table':
        return renderDataTable(data);

      case 'bar':
      case 'line':
        if (numericFields.length > 0 && textFields.length > 0) {
          const chartData = transformDataForChart(data, type, textFields[0], numericFields[0]);
          const ChartComponent = type === 'bar' ? Bar : Line;
          return (
            <Box sx={{ height: 400 }}>
              <ChartComponent
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
                    },
                  },
                }}
              />
            </Box>
          );
        }
        break;

      case 'pie':
      case 'doughnut':
        if (numericFields.length > 0 && textFields.length > 0) {
          const chartData = transformDataForChart(data, type, textFields[0], numericFields[0]);
          const ChartComponent = type === 'pie' ? Pie : Doughnut;
          return (
            <Box sx={{ height: 400 }}>
              <ChartComponent
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
                    },
                  },
                }}
              />
            </Box>
          );
        }
        break;

      default:
        return <Typography>Visualization type not supported</Typography>;
    }

    return <Typography>Unable to render visualization</Typography>;
  };

  const renderDataTable = data => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const maxRows = 1000; // Limit for performance

    const TableRow = ({ index, style }) => {
      const item = data[index];
      return (
        <div style={style}>
          <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
            {columns.map(col => (
              <Box key={col} sx={{ flex: 1, p: 1, fontSize: 12 }}>
                {item[col]}
              </Box>
            ))}
          </Box>
        </div>
      );
    };

    return (
      <Box>
        <Box sx={{ display: 'flex', bgcolor: 'primary.main', color: 'white' }}>
          {columns.map(col => (
            <Box key={col} sx={{ flex: 1, p: 1, fontWeight: 'bold', fontSize: 12 }}>
              {col}
            </Box>
          ))}
        </Box>

        {data.length > maxRows ? (
          <List height={400} itemCount={Math.min(data.length, maxRows)} itemSize={40}>
            {TableRow}
          </List>
        ) : (
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {data.slice(0, maxRows).map((item, index) => (
              <Box key={index} sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
                {columns.map(col => (
                  <Box key={col} sx={{ flex: 1, p: 1, fontSize: 12 }}>
                    {item[col]}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {data.length > maxRows && (
          <Typography variant="caption" sx={{ p: 1, display: 'block' }}>
            Showing {maxRows} of {data.length} records
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Toolbar>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              📊 Advanced Reporting Engine
            </Typography>

            <Tabs value={currentView} onChange={(_, newValue) => setCurrentView(newValue)}>
              <Tab value="builder" label="Report Builder" icon={<Assessment />} />
              <Tab value="dashboard" label="Dashboard" icon={<Dashboard />} />
              <Tab value="preview" label="Preview" icon={<Visibility />} />
            </Tabs>
          </Toolbar>
        </Paper>

        {/* Main Content */}
        <Suspense fallback={<CircularProgress />}>
          {currentView === 'builder' && renderReportBuilder()}
          {currentView === 'preview' && renderReportPreview()}
          {currentView === 'dashboard' && (
            <Typography variant="h6" sx={{ textAlign: 'center', p: 4 }}>
              Dashboard view will be implemented with widget management
            </Typography>
          )}
        </Suspense>

        {/* Dialogs */}
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
          <DialogTitle>Share Report</DialogTitle>
          <DialogContent>
            <Typography>Share functionality will be implemented</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportingEngine;
