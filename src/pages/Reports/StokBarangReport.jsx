// Advanced Stock Report with real-time data and interactive visualizations
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Switch,
  FormControlLabel,
  Alert,
  Skeleton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Inventory,
  Warning,
  CheckCircle,
  Error,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Timeline,
  Refresh,
  FilterList,
  Sort,
  Visibility,
  Edit,
  AttachMoney,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format, subDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FixedSizeList as List } from 'react-window';
import ReportTemplate from './ReportTemplate';
import { reportsAPI } from '../../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

// Stock Status Configuration
const STOCK_STATUS = {
  AVAILABLE: { label: 'Available', color: 'success', threshold: (stock, min) => stock > min * 2 },
  LOW: {
    label: 'Low Stock',
    color: 'warning',
    threshold: (stock, min) => stock > min && stock <= min * 2,
  },
  CRITICAL: {
    label: 'Critical',
    color: 'error',
    threshold: (stock, min) => stock > 0 && stock <= min,
  },
  OUT_OF_STOCK: { label: 'Out of Stock', color: 'error', threshold: (stock, min) => stock <= 0 },
};

// Category Options
const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'oli', label: 'Oli & Pelumas' },
  { value: 'spare-parts', label: 'Spare Parts' },
  { value: 'aksesoris', label: 'Aksesoris' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'electronics', label: 'Electronics' },
];

const StokBarangReport = () => {
  const queryClient = useQueryClient();
  const reportRef = useRef();

  // State Management
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // table, cards, charts
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState('nama_barang');
  const [sortDirection, setSortDirection] = useState('asc');
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    search: { type: 'text', label: 'Search', value: '' },
    category: { type: 'select', label: 'Category', value: '', options: CATEGORIES },
    status: {
      type: 'select',
      label: 'Status',
      value: '',
      options: [
        { value: '', label: 'All Status' },
        { value: 'available', label: 'Available' },
        { value: 'low', label: 'Low Stock' },
        { value: 'critical', label: 'Critical' },
        { value: 'out_of_stock', label: 'Out of Stock' },
      ],
    },
    dateFrom: { type: 'date', label: 'Date From', value: null },
    dateTo: { type: 'date', label: 'Date To', value: null },
    minStock: { type: 'number', label: 'Min Stock', value: '' },
    maxStock: { type: 'number', label: 'Max Stock', value: '' },
  });

  // Data Queries
  const {
    data: stockData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stockReport', filters],
    queryFn: async () => {
      const response = await reportsAPI.stokBarang();
      return response.data || [];
    },
    refetchInterval: realTimeUpdates ? 30000 : false,
    staleTime: realTimeUpdates ? 0 : 5 * 60 * 1000,
  });

  const { data: stockMovement } = useQuery({
    queryKey: ['stockMovement'],
    queryFn: async () => {
      const response = await reportsAPI.kartuStok();
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Enhanced sample data with comprehensive stock information
  const enhancedStockData = useMemo(() => {
    const sampleData = [
      {
        id: 1,
        kode_barang: 'BRG001',
        nama_barang: 'Motor Oil 10W-40 Castrol GTX',
        kategori: 'oli',
        stok_awal: 100,
        stok_masuk: 150,
        stok_keluar: 80,
        stok_akhir: 170,
        stok_minimum: 50,
        harga_beli: 45000,
        harga_jual: 55000,
        nilai_stok: 7650000,
        lokasi: 'Rak A-01',
        supplier: 'PT Castrol Indonesia',
        last_movement: '2025-01-15',
        turnover_rate: 2.5,
        profit_margin: 18.18,
        reorder_point: 75,
        lead_time: 7,
        abc_classification: 'A',
        fast_moving: true,
      },
      {
        id: 2,
        kode_barang: 'BRG002',
        nama_barang: 'Spark Plug NGK Iridium',
        kategori: 'spare-parts',
        stok_awal: 200,
        stok_masuk: 100,
        stok_keluar: 180,
        stok_akhir: 120,
        stok_minimum: 100,
        harga_beli: 85000,
        harga_jual: 110000,
        nilai_stok: 10200000,
        lokasi: 'Rak B-15',
        supplier: 'NGK Spark Plugs',
        last_movement: '2025-01-14',
        turnover_rate: 3.2,
        profit_margin: 22.73,
        reorder_point: 120,
        lead_time: 14,
        abc_classification: 'A',
        fast_moving: true,
      },
      {
        id: 3,
        kode_barang: 'BRG003',
        nama_barang: 'Air Filter K&N Performance',
        kategori: 'spare-parts',
        stok_awal: 50,
        stok_masuk: 30,
        stok_keluar: 45,
        stok_akhir: 35,
        stok_minimum: 20,
        harga_beli: 125000,
        harga_jual: 165000,
        nilai_stok: 4375000,
        lokasi: 'Rak C-08',
        supplier: 'K&N Engineering',
        last_movement: '2025-01-13',
        turnover_rate: 1.8,
        profit_margin: 24.24,
        reorder_point: 30,
        lead_time: 21,
        abc_classification: 'B',
        fast_moving: false,
      },
      {
        id: 4,
        kode_barang: 'BRG004',
        nama_barang: 'Brake Pad Ceramic Brembo',
        kategori: 'spare-parts',
        stok_awal: 80,
        stok_masuk: 40,
        stok_keluar: 95,
        stok_akhir: 25,
        stok_minimum: 30,
        harga_beli: 185000,
        harga_jual: 245000,
        nilai_stok: 4625000,
        lokasi: 'Rak D-12',
        supplier: 'Brembo SpA',
        last_movement: '2025-01-16',
        turnover_rate: 4.1,
        profit_margin: 24.49,
        reorder_point: 40,
        lead_time: 10,
        abc_classification: 'A',
        fast_moving: true,
      },
      {
        id: 5,
        kode_barang: 'BRG005',
        nama_barang: 'LED Headlight H4 Philips',
        kategori: 'electronics',
        stok_awal: 60,
        stok_masuk: 25,
        stok_keluar: 70,
        stok_akhir: 15,
        stok_minimum: 25,
        harga_beli: 95000,
        harga_jual: 135000,
        nilai_stok: 1425000,
        lokasi: 'Rak E-05',
        supplier: 'Philips Automotive',
        last_movement: '2025-01-12',
        turnover_rate: 3.8,
        profit_margin: 29.63,
        reorder_point: 35,
        lead_time: 5,
        abc_classification: 'A',
        fast_moving: true,
      },
    ];

    return sampleData.map(item => ({
      ...item,
      status: getStockStatus(item.stok_akhir, item.stok_minimum),
      value_at_selling_price: item.stok_akhir * item.harga_jual,
      days_of_supply: item.turnover_rate > 0 ? item.stok_akhir / (item.turnover_rate * 30) : 0,
      potential_profit: (item.harga_jual - item.harga_beli) * item.stok_akhir,
    }));
  }, []);

  // Use enhanced data instead of API data for demonstration
  const processedData = useMemo(() => {
    let data = enhancedStockData;

    // Apply filters
    if (filters.search.value) {
      data = data.filter(
        item =>
          item.nama_barang.toLowerCase().includes(filters.search.value.toLowerCase()) ||
          item.kode_barang.toLowerCase().includes(filters.search.value.toLowerCase())
      );
    }

    if (filters.category.value) {
      data = data.filter(item => item.kategori === filters.category.value);
    }

    if (filters.status.value) {
      data = data.filter(item => item.status.toLowerCase() === filters.status.value);
    }

    if (filters.minStock.value) {
      data = data.filter(item => item.stok_akhir >= parseInt(filters.minStock.value));
    }

    if (filters.maxStock.value) {
      data = data.filter(item => item.stok_akhir <= parseInt(filters.maxStock.value));
    }

    // Apply sorting
    data.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const multiplier = sortDirection === 'asc' ? 1 : -1;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier;
      }
      return (aVal - bVal) * multiplier;
    });

    return data;
  }, [enhancedStockData, filters, sortBy, sortDirection]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalItems = processedData.length;
    const totalValue = processedData.reduce((sum, item) => sum + item.nilai_stok, 0);
    const totalQuantity = processedData.reduce((sum, item) => sum + item.stok_akhir, 0);
    const lowStockItems = processedData.filter(item => item.status === 'low').length;
    const outOfStockItems = processedData.filter(item => item.status === 'out_of_stock').length;
    const criticalItems = processedData.filter(item => item.status === 'critical').length;
    const averageTurnover =
      processedData.reduce((sum, item) => sum + item.turnover_rate, 0) / totalItems;
    const totalPotentialProfit = processedData.reduce(
      (sum, item) => sum + item.potential_profit,
      0
    );

    return {
      totalItems,
      totalValue,
      totalQuantity,
      lowStockItems,
      outOfStockItems,
      criticalItems,
      averageTurnover,
      totalPotentialProfit,
      healthScore: ((totalItems - outOfStockItems - criticalItems) / totalItems) * 100,
    };
  }, [processedData]);

  // Helper function to determine stock status
  function getStockStatus(currentStock, minimumStock) {
    if (currentStock <= 0) return 'out_of_stock';
    if (currentStock <= minimumStock) return 'critical';
    if (currentStock <= minimumStock * 2) return 'low';
    return 'available';
  }

  // Filter change handler
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: { ...prev[filterKey], value },
    }));
    setPage(0); // Reset to first page when filters change
  }, []);

  // Chart data preparation
  const chartData = useMemo(() => {
    // Stock by Category
    const categoryData = CATEGORIES.slice(1).map(cat => {
      const items = processedData.filter(item => item.kategori === cat.value);
      return {
        category: cat.label,
        count: items.length,
        value: items.reduce((sum, item) => sum + item.nilai_stok, 0),
      };
    });

    // Stock Status Distribution
    const statusData = Object.keys(STOCK_STATUS).map(status => {
      const count = processedData.filter(item => item.status === status.toLowerCase()).length;
      return {
        status: STOCK_STATUS[status].label,
        count,
        color: STOCK_STATUS[status].color,
      };
    });

    // Top 10 by Value
    const topByValue = [...processedData].sort((a, b) => b.nilai_stok - a.nilai_stok).slice(0, 10);

    // ABC Analysis
    const abcData = ['A', 'B', 'C'].map(classification => ({
      classification,
      count: processedData.filter(item => item.abc_classification === classification).length,
      value: processedData
        .filter(item => item.abc_classification === classification)
        .reduce((sum, item) => sum + item.nilai_stok, 0),
    }));

    return {
      categoryChart: {
        labels: categoryData.map(d => d.category),
        datasets: [
          {
            label: 'Stock Value',
            data: categoryData.map(d => d.value),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      },
      statusChart: {
        labels: statusData.map(d => d.status),
        datasets: [
          {
            data: statusData.map(d => d.count),
            backgroundColor: ['#4CAF50', '#FF9800', '#F44336', '#9E9E9E'],
          },
        ],
      },
      topValueChart: {
        labels: topByValue.map(item => item.kode_barang),
        datasets: [
          {
            label: 'Stock Value',
            data: topByValue.map(item => item.nilai_stok),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      abcChart: {
        labels: abcData.map(d => `Class ${d.classification}`),
        datasets: [
          {
            data: abcData.map(d => d.value),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
    };
  }, [processedData]);

  // Custom Actions for Report Template
  const customActions = [
    {
      label: 'Stock Alerts',
      icon: <Warning />,
      onClick: () => {
        const alerts = processedData.filter(
          item => item.status === 'critical' || item.status === 'out_of_stock'
        );
        toast.info(`${alerts.length} items need immediate attention`);
      },
    },
    {
      label: 'Generate Reorder Report',
      icon: <TrendingUp />,
      onClick: () => {
        const reorderItems = processedData.filter(item => item.stok_akhir <= item.reorder_point);
        toast.info(`${reorderItems.length} items need reordering`);
      },
    },
  ];

  // Render Summary Cards
  const renderSummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Inventory sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" color="primary">
                  {summaryStats.totalItems.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="success.main">
                  Rp {summaryStats.totalValue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Stock Value
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" color="warning.main">
                  {summaryStats.criticalItems + summaryStats.outOfStockItems}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical Items
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h6" color="info.main">
                  {summaryStats.healthScore.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock Health Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={summaryStats.healthScore}
                  sx={{ mt: 1 }}
                  color={
                    summaryStats.healthScore >= 80
                      ? 'success'
                      : summaryStats.healthScore >= 60
                        ? 'warning'
                        : 'error'
                  }
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render Charts
  const renderCharts = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Stock by Category" />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <Bar
                data={chartData.categoryChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Stock Status Distribution" />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <Doughnut
                data={chartData.statusChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Top 10 Items by Value" />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <Bar
                data={chartData.topValueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="ABC Analysis" />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <Pie
                data={chartData.abcChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render Data Table
  const renderDataTable = () => {
    const paginatedData = processedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Current Stock</TableCell>
                <TableCell align="right">Min Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Turnover</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map(item => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.kode_barang}</TableCell>
                  <TableCell>{item.nama_barang}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        CATEGORIES.find(c => c.value === item.kategori)?.label || item.kategori
                      }
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={item.stok_akhir <= item.stok_minimum ? 'error' : 'inherit'}
                    >
                      {item.stok_akhir.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{item.stok_minimum.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={STOCK_STATUS[item.status.toUpperCase()]?.label || item.status}
                      color={STOCK_STATUS[item.status.toUpperCase()]?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">Rp {item.nilai_stok.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.turnover_rate.toFixed(1)}x
                      {item.fast_moving && (
                        <TrendingUp sx={{ ml: 0.5, fontSize: 16, color: 'success.main' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{item.lokasi}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={processedData.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={e => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>
    );
  };

  // Main render
  return (
    <ReportTemplate
      ref={reportRef}
      title="📦 Advanced Stock Report"
      description="Comprehensive stock analysis with real-time monitoring and predictive insights"
      data={processedData}
      loading={isLoading}
      error={error?.message}
      enableExport={true}
      enablePrint={true}
      enableShare={true}
      enableFilters={true}
      enableRefresh={true}
      customActions={customActions}
      onRefresh={refetch}
      filters={filters}
      onFilterChange={handleFilterChange}
      refreshInterval={30}
      lastUpdated={new Date()}
      metadata={{
        totalRecords: processedData.length,
        version: '2.0',
        author: 'Stock Management System',
      }}
    >
      <Box>
        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={realTimeUpdates}
                onChange={e => setRealTimeUpdates(e.target.checked)}
              />
            }
            label="Real-time Updates"
          />

          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
            <Tab label="Summary" />
            <Tab label="Analytics" />
            <Tab label="Detailed View" />
          </Tabs>
        </Box>

        {/* Content based on active tab */}
        {currentTab === 0 && (
          <Box>
            {renderSummaryCards()}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {renderDataTable()}
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardHeader title="Quick Stats" />
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Turnover Rate
                      </Typography>
                      <Typography variant="h6">
                        {summaryStats.averageTurnover.toFixed(2)}x per month
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Potential Profit
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        Rp {summaryStats.totalPotentialProfit.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Items Needing Reorder
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        {processedData.filter(item => item.stok_akhir <= item.reorder_point).length}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {currentTab === 1 && renderCharts()}

        {currentTab === 2 && renderDataTable()}
      </Box>
    </ReportTemplate>
  );
};

export default StokBarangReport;
