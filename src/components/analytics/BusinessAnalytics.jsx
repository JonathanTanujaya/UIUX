import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  TextField,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  PieChart,
  BarChart,
  ShowChart,
  People,
  ShoppingCart,
  AttachMoney,
  Inventory,
  Speed,
  Visibility,
  Download,
  Refresh,
  Settings,
  DateRange,
  FilterList,
  Compare,
  InsertChart,
  Dashboard,
  Business,
  MonetizationOn,
  LocalShipping,
  Store,
  AccountBox,
  Schedule,
  TrendingFlat,
} from '@mui/icons-material';

// Mock data generators
const generateSalesData = (days = 30) => {
  const data = [];
  const baseAmount = 50000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const seasonality = Math.sin((date.getDay() / 7) * Math.PI * 2) * 0.3 + 1;
    const trend = (days - i) / days * 0.2 + 1;
    const noise = (Math.random() - 0.5) * 0.4 + 1;
    
    const amount = Math.round(baseAmount * seasonality * trend * noise);
    const orders = Math.round(amount / 1000 + Math.random() * 20);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: amount,
      orders: orders,
      customers: Math.round(orders * 0.7 + Math.random() * 10),
      avgOrderValue: Math.round(amount / orders),
    });
  }
  
  return data;
};

const generateProductData = () => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'];
  const products = [];
  
  categories.forEach((category, catIndex) => {
    for (let i = 0; i < 5; i++) {
      products.push({
        id: `${catIndex}-${i}`,
        name: `${category} Product ${i + 1}`,
        category,
        revenue: Math.round(Math.random() * 50000 + 5000),
        units: Math.round(Math.random() * 500 + 50),
        views: Math.round(Math.random() * 10000 + 1000),
        conversionRate: Math.round((Math.random() * 5 + 1) * 100) / 100,
        stock: Math.round(Math.random() * 100 + 10),
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      });
    }
  });
  
  return products.sort((a, b) => b.revenue - a.revenue);
};

const generateCustomerData = () => {
  const segments = ['Premium', 'Regular', 'New', 'Inactive'];
  const data = [];
  
  segments.forEach(segment => {
    const count = Math.round(Math.random() * 1000 + 100);
    const avgSpend = Math.round(Math.random() * 500 + 100);
    
    data.push({
      segment,
      count,
      percentage: 0, // Will be calculated
      avgSpend,
      totalRevenue: count * avgSpend,
      growth: Math.round((Math.random() - 0.5) * 20 * 100) / 100,
    });
  });
  
  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item.count, 0);
  data.forEach(item => {
    item.percentage = Math.round((item.count / total) * 100 * 10) / 10;
  });
  
  return data;
};

// Analytics Dashboard Component
export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  
  // Data states
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [kpis, setKpis] = useState({});

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    
    // Load data immediately
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const sales = generateSalesData(days);
    const products = generateProductData();
    const customers = generateCustomerData();
    
    setSalesData(sales);
    setProductData(products);
    setCustomerData(customers);
    
    // Calculate KPIs
    const totalRevenue = sales.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = sales.reduce((sum, day) => sum + day.orders, 0);
    const totalCustomers = sales.reduce((sum, day) => sum + day.customers, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    
    // Calculate growth rates (mock)
    const revenueGrowth = Math.round((Math.random() - 0.3) * 20 * 100) / 100;
    const orderGrowth = Math.round((Math.random() - 0.3) * 15 * 100) / 100;
    const customerGrowth = Math.round((Math.random() - 0.2) * 10 * 100) / 100;
    
    setKpis({
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue: Math.round(avgOrderValue),
      revenueGrowth,
      orderGrowth,
      customerGrowth,
      conversionRate: Math.round((totalOrders / (totalOrders * 10)) * 100 * 100) / 100,
    });
    
    setLoading(false);
  }, [timeRange]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadData, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadData]);

  // Calculate trend for chart data
  const chartData = useMemo(() => {
    if (salesData.length === 0) return [];
    
    return salesData.map((day, index) => ({
      ...day,
      cumulativeRevenue: salesData.slice(0, index + 1).reduce((sum, d) => sum + d.revenue, 0),
      cumulativeOrders: salesData.slice(0, index + 1).reduce((sum, d) => sum + d.orders, 0),
    }));
  }, [salesData]);

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp color="success" />;
    if (growth < 0) return <TrendingDown color="error" />;
    return <TrendingFlat color="disabled" />;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'success';
    if (growth < 0) return 'error';
    return 'default';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Business Analytics</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7days">Last 7 days</MenuItem>
              <MenuItem value="30days">Last 30 days</MenuItem>
              <MenuItem value="90days">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Auto Refresh"
          />
          
          <Button
            variant="outlined"
            startIcon={<Compare />}
            onClick={() => setCompareMode(!compareMode)}
            color={compareMode ? 'primary' : 'inherit'}
          >
            Compare
          </Button>
          
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5">
                    ${kpis.totalRevenue?.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(kpis.revenueGrowth)}
                    <Typography
                      variant="body2"
                      color={`${getGrowthColor(kpis.revenueGrowth)}.main`}
                      ml={0.5}
                    >
                      {kpis.revenueGrowth > 0 ? '+' : ''}{kpis.revenueGrowth}%
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h5">
                    {kpis.totalOrders?.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(kpis.orderGrowth)}
                    <Typography
                      variant="body2"
                      color={`${getGrowthColor(kpis.orderGrowth)}.main`}
                      ml={0.5}
                    >
                      {kpis.orderGrowth > 0 ? '+' : ''}{kpis.orderGrowth}%
                    </Typography>
                  </Box>
                </Box>
                <ShoppingCart color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Customers
                  </Typography>
                  <Typography variant="h5">
                    {kpis.totalCustomers?.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(kpis.customerGrowth)}
                    <Typography
                      variant="body2"
                      color={`${getGrowthColor(kpis.customerGrowth)}.main`}
                      ml={0.5}
                    >
                      {kpis.customerGrowth > 0 ? '+' : ''}{kpis.customerGrowth}%
                    </Typography>
                  </Box>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Order Value
                  </Typography>
                  <Typography variant="h5">
                    ${kpis.avgOrderValue}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography variant="body2" color="textSecondary">
                      Conversion: {kpis.conversionRate}%
                    </Typography>
                  </Box>
                </Box>
                <Assessment color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Revenue Overview" icon={<ShowChart />} />
          <Tab label="Product Analytics" icon={<Inventory />} />
          <Tab label="Customer Insights" icon={<People />} />
          <Tab label="Performance Metrics" icon={<Speed />} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Revenue Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Trend
                </Typography>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box height={300} display="flex" alignItems="end" gap={1} mt={2}>
                    {chartData.map((day, index) => {
                      const maxRevenue = Math.max(...chartData.map(d => d.revenue));
                      const height = (day.revenue / maxRevenue) * 100;
                      
                      return (
                        <Tooltip
                          key={index}
                          title={`${day.date}: $${day.revenue.toLocaleString()}`}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              height: `${Math.max(2, height)}%`,
                              bgcolor: 'primary.main',
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Top Products */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Products
                </Typography>
                <List>
                  {productData.slice(0, 5).map((product, index) => (
                    <ListItem key={product.id}>
                      <ListItemText
                        primary={product.name}
                        secondary={`$${product.revenue.toLocaleString()}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={`#${index + 1}`}
                          color="primary"
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Daily Breakdown */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daily Revenue Breakdown
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Orders</TableCell>
                        <TableCell align="right">Customers</TableCell>
                        <TableCell align="right">Avg Order Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesData.slice(-7).map((day) => (
                        <TableRow key={day.date}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell align="right">
                            ${day.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">{day.orders}</TableCell>
                          <TableCell align="right">{day.customers}</TableCell>
                          <TableCell align="right">${day.avgOrderValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Product Performance */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Performance
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Units Sold</TableCell>
                        <TableCell align="right">Views</TableCell>
                        <TableCell align="right">Conversion</TableCell>
                        <TableCell align="right">Stock</TableCell>
                        <TableCell align="right">Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productData.slice(0, 10).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Chip label={product.category} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            ${product.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">{product.units}</TableCell>
                          <TableCell align="right">
                            {product.views.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {product.conversionRate}%
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={product.stock}
                              color={product.stock < 20 ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {product.rating}⭐
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Customer Segments */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Segments
                </Typography>
                <List>
                  {customerData.map((segment) => (
                    <ListItem key={segment.segment}>
                      <ListItemIcon>
                        <AccountBox />
                      </ListItemIcon>
                      <ListItemText
                        primary={segment.segment}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {segment.count.toLocaleString()} customers ({segment.percentage}%)
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={segment.percentage}
                              sx={{ mt: 1, mb: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              Avg spend: ${segment.avgSpend}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box display="flex" alignItems="center">
                          {getGrowthIcon(segment.growth)}
                          <Typography
                            variant="body2"
                            color={`${getGrowthColor(segment.growth)}.main`}
                            ml={0.5}
                          >
                            {segment.growth > 0 ? '+' : ''}{segment.growth}%
                          </Typography>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Insights */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Customer Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Customer Lifetime Value
                      </Typography>
                      <Typography variant="h4" color="primary">
                        $1,234
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Average across all segments
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Retention Rate
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        78.5%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        30-day retention rate
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Churn Rate
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        21.5%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Monthly churn rate
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Website Performance
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Page Load Time"
                      secondary="Average time to load pages"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="2.3s" color="success" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Bounce Rate"
                      secondary="Percentage of single-page visits"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="34.2%" color="warning" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Session Duration"
                      secondary="Average time spent on site"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="4m 32s" color="info" />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText
                      primary="Conversion Rate"
                      secondary="Visitors who made a purchase"
                    />
                    <ListItemSecondaryAction>
                      <Chip label="3.7%" color="success" />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Sales Funnel */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Funnel
                </Typography>
                <Box>
                  {[
                    { stage: 'Visitors', count: 10000, color: 'info' },
                    { stage: 'Product Views', count: 7500, color: 'primary' },
                    { stage: 'Add to Cart', count: 3200, color: 'secondary' },
                    { stage: 'Checkout', count: 1800, color: 'warning' },
                    { stage: 'Purchase', count: 1200, color: 'success' },
                  ].map((stage, index) => {
                    const percentage = (stage.count / 10000) * 100;
                    
                    return (
                      <Box key={stage.stage} mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">{stage.stage}</Typography>
                          <Typography variant="body2">
                            {stage.count.toLocaleString()} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          color={stage.color}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default {
  AnalyticsDashboard,
};
