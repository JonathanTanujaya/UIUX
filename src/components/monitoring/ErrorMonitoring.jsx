import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Badge,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Error,
  Warning,
  Info,
  CheckCircle,
  BugReport,
  Timeline,
  Assessment,
  Refresh,
  FilterList,
  Search,
  Download,
  Settings,
  Notifications,
  Speed,
  Memory,
  NetworkCheck,
  Storage,
  MonitorHeart,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  Visibility,
  Code,
  CloudUpload,
  Delete,
  Analytics,
  Api,
} from '@mui/icons-material';

// Error Monitoring Context
const ErrorMonitoringContext = createContext();

export const useErrorMonitoring = () => {
  const context = useContext(ErrorMonitoringContext);
  if (!context) {
    throw new Error('useErrorMonitoring must be used within ErrorMonitoringProvider');
  }
  return context;
};

// Error levels and categories
const ERROR_LEVELS = {
  error: { label: 'Error', color: 'error', icon: <Error /> },
  warning: { label: 'Warning', color: 'warning', icon: <Warning /> },
  info: { label: 'Info', color: 'info', icon: <Info /> },
  debug: { label: 'Debug', color: 'default', icon: <Code /> },
};

const ERROR_CATEGORIES = {
  frontend: { label: 'Frontend', icon: <Code />, color: 'primary' },
  backend: { label: 'Backend', icon: <Api />, color: 'secondary' },
  database: { label: 'Database', icon: <Storage />, color: 'warning' },
  network: { label: 'Network', icon: <NetworkCheck />, color: 'info' },
  security: { label: 'Security', icon: <BugReport />, color: 'error' },
  performance: { label: 'Performance', icon: <Speed />, color: 'success' },
};

// Generate mock error data
const generateMockErrors = () => {
  const errors = [];
  const categories = Object.keys(ERROR_CATEGORIES);
  const levels = Object.keys(ERROR_LEVELS);
  
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    errors.push({
      id: `error-${i}`,
      level,
      category,
      message: `Sample ${level} in ${category}: ${getRandomErrorMessage(category)}`,
      details: `Detailed error information for ${category} issue. Stack trace and context would be here.`,
      timestamp,
      resolved: Math.random() > 0.7,
      occurrences: Math.floor(Math.random() * 20) + 1,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      url: `/app/${category}`,
      userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 100)}` : null,
      sessionId: `session-${Math.floor(Math.random() * 1000)}`,
    });
  }
  
  return errors.sort((a, b) => b.timestamp - a.timestamp);
};

const getRandomErrorMessage = (category) => {
  const messages = {
    frontend: [
      'Component render failed',
      'State update error',
      'Invalid prop type',
      'Missing dependency',
      'Hook call error',
    ],
    backend: [
      'API endpoint timeout',
      'Authentication failed',
      'Service unavailable',
      'Internal server error',
      'Rate limit exceeded',
    ],
    database: [
      'Connection timeout',
      'Query execution failed',
      'Foreign key constraint',
      'Deadlock detected',
      'Index optimization needed',
    ],
    network: [
      'Connection refused',
      'DNS resolution failed',
      'SSL certificate invalid',
      'Request timeout',
      'Network unreachable',
    ],
    security: [
      'Unauthorized access attempt',
      'CSRF token mismatch',
      'XSS attempt blocked',
      'Suspicious activity detected',
      'Authentication bypass attempt',
    ],
    performance: [
      'Memory leak detected',
      'CPU usage spike',
      'Slow query detected',
      'Bundle size exceeded',
      'Render performance degraded',
    ],
  };
  
  const categoryMessages = messages[category] || ['Unknown error'];
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};

// Error Monitoring Provider
export const ErrorMonitoringProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [metrics, setMetrics] = useState({
    totalErrors: 0,
    errorRate: 0,
    resolvedCount: 0,
    criticalCount: 0,
    last24Hours: 0,
    averageResolutionTime: 0,
  });
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    emailNotifications: true,
    slackIntegration: false,
    errorThreshold: 10,
    performanceMonitoring: true,
  });

  // Initialize errors
  useEffect(() => {
    const mockErrors = generateMockErrors();
    setErrors(mockErrors);
    calculateMetrics(mockErrors);
  }, []);

  // Calculate error metrics
  const calculateMetrics = useCallback((errorData) => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const totalErrors = errorData.length;
    const resolvedCount = errorData.filter(e => e.resolved).length;
    const criticalCount = errorData.filter(e => e.level === 'error').length;
    const last24HoursCount = errorData.filter(e => e.timestamp > last24Hours).length;
    const errorRate = last24HoursCount / 24; // errors per hour
    
    // Calculate average resolution time (mock)
    const resolvedErrors = errorData.filter(e => e.resolved);
    const averageResolutionTime = resolvedErrors.length > 0 
      ? Math.round(Math.random() * 120 + 30) // 30-150 minutes
      : 0;

    setMetrics({
      totalErrors,
      errorRate: Math.round(errorRate * 10) / 10,
      resolvedCount,
      criticalCount,
      last24Hours: last24HoursCount,
      averageResolutionTime,
    });
  }, []);

  // Log new error
  const logError = useCallback((errorData) => {
    const newError = {
      id: `error-${Date.now()}`,
      timestamp: new Date(),
      resolved: false,
      occurrences: 1,
      ...errorData,
    };
    
    setErrors(prev => {
      const updated = [newError, ...prev];
      calculateMetrics(updated);
      return updated;
    });

    // Trigger notifications if enabled
    if (settings.emailNotifications && errorData.level === 'error') {
      console.log('Email notification sent for critical error:', newError);
    }
  }, [settings.emailNotifications, calculateMetrics]);

  // Resolve error
  const resolveError = useCallback((errorId) => {
    setErrors(prev => {
      const updated = prev.map(error => 
        error.id === errorId ? { ...error, resolved: true } : error
      );
      calculateMetrics(updated);
      return updated;
    });
  }, [calculateMetrics]);

  // Clear old errors
  const clearOldErrors = useCallback((days = 7) => {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setErrors(prev => {
      const updated = prev.filter(error => error.timestamp > cutoff);
      calculateMetrics(updated);
      return updated;
    });
  }, [calculateMetrics]);

  const value = {
    errors,
    metrics,
    settings,
    setSettings,
    logError,
    resolveError,
    clearOldErrors,
  };

  return (
    <ErrorMonitoringContext.Provider value={value}>
      {children}
    </ErrorMonitoringContext.Provider>
  );
};

// Error Dashboard Component
export const ErrorDashboard = () => {
  const { errors, metrics, settings, setSettings } = useErrorMonitoring();
  const [tabValue, setTabValue] = useState(0);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Filter errors
  const filteredErrors = errors.filter(error => {
    const matchesLevel = filterLevel === 'all' || error.level === filterLevel;
    const matchesCategory = filterCategory === 'all' || error.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLevel && matchesCategory && matchesSearch;
  });

  // Get error trend data
  const getErrorTrend = () => {
    const now = new Date();
    const hours = [];
    const counts = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourErrors = errors.filter(error => {
        const errorHour = new Date(error.timestamp);
        return errorHour.getHours() === hour.getHours() && 
               errorHour.getDate() === hour.getDate();
      });
      
      hours.push(hour.getHours());
      counts.push(hourErrors.length);
    }
    
    return { hours, counts };
  };

  const errorTrend = getErrorTrend();

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Error Monitoring</Typography>
        <Box display="flex" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoRefresh}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  autoRefresh: e.target.checked
                }))}
              />
            }
            label="Auto Refresh"
          />
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Metrics Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {metrics.totalErrors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Errors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {metrics.errorRate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Errors/Hour
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {metrics.criticalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Critical Errors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {metrics.resolvedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {metrics.last24Hours}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 24h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4">
                {metrics.averageResolutionTime}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Resolution
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Trend Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Error Trend (Last 24 Hours)
          </Typography>
          <Box height={200} display="flex" alignItems="end" gap={1}>
            {errorTrend.counts.map((count, index) => (
              <Box
                key={index}
                sx={{
                  width: '100%',
                  height: `${Math.max(5, (count / Math.max(...errorTrend.counts)) * 100)}%`,
                  bgcolor: count > 5 ? 'error.main' : count > 2 ? 'warning.main' : 'success.main',
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="caption">
              {errorTrend.hours[0]}:00
            </Typography>
            <Typography variant="caption">
              Now
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Error List" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            {/* Filters */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <TextField
                size="small"
                placeholder="Search errors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search />,
                }}
                sx={{ minWidth: 200 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  label="Level"
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  {Object.entries(ERROR_LEVELS).map(([key, level]) => (
                    <MenuItem key={key} value={key}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {Object.entries(ERROR_CATEGORIES).map(([key, category]) => (
                    <MenuItem key={key} value={key}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="outlined" startIcon={<Download />}>
                Export
              </Button>
            </Box>

            {/* Error Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Level</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Occurrences</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredErrors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((error) => (
                      <TableRow key={error.id}>
                        <TableCell>
                          <Chip
                            label={ERROR_LEVELS[error.level].label}
                            color={ERROR_LEVELS[error.level].color}
                            size="small"
                            icon={ERROR_LEVELS[error.level].icon}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ERROR_CATEGORIES[error.category].label}
                            color={ERROR_CATEGORIES[error.category].color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={error.details}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                maxWidth: 300, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {error.message}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={error.occurrences} color="error">
                            <Typography variant="body2">
                              {error.occurrences}
                            </Typography>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {error.timestamp.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {error.resolved ? (
                            <Chip label="Resolved" color="success" size="small" />
                          ) : (
                            <Chip label="Open" color="error" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            {!error.resolved && (
                              <Tooltip title="Mark as Resolved">
                                <IconButton size="small" color="success">
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredErrors.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Error by Category */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Errors by Category
                </Typography>
                <List>
                  {Object.entries(ERROR_CATEGORIES).map(([key, category]) => {
                    const count = errors.filter(e => e.category === key).length;
                    const percentage = errors.length > 0 ? (count / errors.length) * 100 : 0;
                    
                    return (
                      <ListItem key={key}>
                        <ListItemIcon>
                          <Box color={`${category.color}.main`}>
                            {category.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={category.label}
                          secondary={
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={category.color}
                              sx={{ mt: 1 }}
                            />
                          }
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {count} ({Math.round(percentage)}%)
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Error by Level */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Errors by Severity
                </Typography>
                <List>
                  {Object.entries(ERROR_LEVELS).map(([key, level]) => {
                    const count = errors.filter(e => e.level === key).length;
                    const percentage = errors.length > 0 ? (count / errors.length) * 100 : 0;
                    
                    return (
                      <ListItem key={key}>
                        <ListItemIcon>
                          <Box color={`${level.color}.main`}>
                            {level.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={level.label}
                          secondary={
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={level.color}
                              sx={{ mt: 1 }}
                            />
                          }
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="body2">
                            {count} ({Math.round(percentage)}%)
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monitoring Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoRefresh}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        autoRefresh: e.target.checked
                      }))}
                    />
                  }
                  label="Auto Refresh"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.slackIntegration}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        slackIntegration: e.target.checked
                      }))}
                    />
                  }
                  label="Slack Integration"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.performanceMonitoring}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        performanceMonitoring: e.target.checked
                      }))}
                    />
                  }
                  label="Performance Monitoring"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Error Threshold"
                  value={settings.errorThreshold}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    errorThreshold: parseInt(e.target.value)
                  }))}
                  helperText="Errors per hour before alert"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Refresh Interval (seconds)"
                  value={settings.refreshInterval / 1000}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    refreshInterval: parseInt(e.target.value) * 1000
                  }))}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default {
  ErrorMonitoringProvider,
  ErrorDashboard,
  useErrorMonitoring,
};
