import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  Refresh,
  Timeline,
  Assessment,
} from '@mui/icons-material';

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0,
    bundleSize: 0,
    loadTime: 0,
    fps: 0,
    networkRequests: 0,
    cacheHitRate: 0,
  });

  const startTime = useRef(performance.now());
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now() - performance.timeOrigin;
    
    // Get memory usage (if available)
    const memoryInfo = window.performance?.memory;
    const memoryUsage = memoryInfo ? 
      Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100) : 0;

    // Count React components (approximation)
    const componentCount = document.querySelectorAll('[data-reactroot] *').length;

    // Measure FPS
    const measureFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastFrameTime.current;
      
      if (delta >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / delta);
        frameCount.current = 0;
        lastFrameTime.current = now;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    setMetrics(prev => ({
      ...prev,
      loadTime: Math.round(loadTime),
      memoryUsage,
      componentCount,
    }));

    // Monitor network requests
    const originalFetch = window.fetch;
    let requestCount = 0;
    
    window.fetch = async (...args) => {
      requestCount++;
      setMetrics(prev => ({ ...prev, networkRequests: requestCount }));
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const updateRenderTime = useCallback((time) => {
    setMetrics(prev => ({ ...prev, renderTime: Math.round(time) }));
  }, []);

  return { metrics, updateRenderTime };
};

// Performance monitor component
export const PerformanceMonitor = ({ 
  showDetails = false,
  thresholds = {
    renderTime: 16, // 60fps
    memoryUsage: 80,
    loadTime: 3000,
    fps: 30,
  }
}) => {
  const { metrics } = usePerformanceMetrics();
  const [expanded, setExpanded] = useState(showDetails);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const newAlerts = [];
    
    if (metrics.renderTime > thresholds.renderTime) {
      newAlerts.push({
        severity: 'warning',
        message: `Render time (${metrics.renderTime}ms) exceeds threshold`,
        metric: 'renderTime',
      });
    }
    
    if (metrics.memoryUsage > thresholds.memoryUsage) {
      newAlerts.push({
        severity: 'error',
        message: `Memory usage (${metrics.memoryUsage}%) is high`,
        metric: 'memoryUsage',
      });
    }
    
    if (metrics.loadTime > thresholds.loadTime) {
      newAlerts.push({
        severity: 'warning',
        message: `Load time (${metrics.loadTime}ms) is slow`,
        metric: 'loadTime',
      });
    }
    
    if (metrics.fps < thresholds.fps) {
      newAlerts.push({
        severity: 'warning',
        message: `FPS (${metrics.fps}) is below optimal`,
        metric: 'fps',
      });
    }

    setAlerts(newAlerts);
  }, [metrics, thresholds]);

  const getMetricColor = (value, threshold, inverse = false) => {
    if (inverse) {
      return value < threshold ? 'error' : 'success';
    }
    return value > threshold ? 'error' : 'success';
  };

  const getMetricIcon = (severity) => {
    switch (severity) {
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      default: return <CheckCircle color="success" />;
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" display="flex" alignItems="center" gap={1}>
          <Speed />
          Performance Monitor
        </Typography>
        <Box>
          <IconButton onClick={() => window.location.reload()} size="small">
            <Refresh />
          </IconButton>
          <IconButton 
            onClick={() => setExpanded(!expanded)} 
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Quick Overview */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6" color={getMetricColor(metrics.fps, thresholds.fps, true)}>
                {metrics.fps}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                FPS
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6" color={getMetricColor(metrics.renderTime, thresholds.renderTime)}>
                {metrics.renderTime}ms
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Render Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6" color={getMetricColor(metrics.memoryUsage, thresholds.memoryUsage)}>
                {metrics.memoryUsage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Memory
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6">
                {metrics.networkRequests}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Box mb={2}>
          {alerts.map((alert, index) => (
            <Alert 
              key={index} 
              severity={alert.severity} 
              sx={{ mb: 1 }}
              icon={getMetricIcon(alert.severity)}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Detailed Metrics */}
      <Collapse in={expanded}>
        <Typography variant="subtitle2" gutterBottom>
          Detailed Metrics
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Threshold</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Timeline fontSize="small" />
                    Render Time
                  </Box>
                </TableCell>
                <TableCell>{metrics.renderTime}ms</TableCell>
                <TableCell>
                  <Chip 
                    size="small"
                    label={metrics.renderTime <= thresholds.renderTime ? 'Good' : 'Poor'}
                    color={getMetricColor(metrics.renderTime, thresholds.renderTime)}
                  />
                </TableCell>
                <TableCell>≤ {thresholds.renderTime}ms</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Memory fontSize="small" />
                    Memory Usage
                  </Box>
                </TableCell>
                <TableCell>{metrics.memoryUsage}%</TableCell>
                <TableCell>
                  <Chip 
                    size="small"
                    label={metrics.memoryUsage <= thresholds.memoryUsage ? 'Good' : 'High'}
                    color={getMetricColor(metrics.memoryUsage, thresholds.memoryUsage)}
                  />
                </TableCell>
                <TableCell>≤ {thresholds.memoryUsage}%</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Speed fontSize="small" />
                    Load Time
                  </Box>
                </TableCell>
                <TableCell>{metrics.loadTime}ms</TableCell>
                <TableCell>
                  <Chip 
                    size="small"
                    label={metrics.loadTime <= thresholds.loadTime ? 'Fast' : 'Slow'}
                    color={getMetricColor(metrics.loadTime, thresholds.loadTime)}
                  />
                </TableCell>
                <TableCell>≤ {thresholds.loadTime}ms</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Assessment fontSize="small" />
                    Components
                  </Box>
                </TableCell>
                <TableCell>{metrics.componentCount}</TableCell>
                <TableCell>
                  <Chip size="small" label="Info" color="info" />
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <NetworkCheck fontSize="small" />
                    Network Requests
                  </Box>
                </TableCell>
                <TableCell>{metrics.networkRequests}</TableCell>
                <TableCell>
                  <Chip size="small" label="Info" color="info" />
                </TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

// Bundle analyzer component
export const BundleAnalyzer = ({ bundleData = null }) => {
  const [open, setOpen] = useState(false);
  
  const mockBundleData = bundleData || {
    totalSize: 920.16,
    gzippedSize: 301.99,
    chunks: [
      { name: 'vendor', size: 399.27, gzipped: 122.01 },
      { name: 'main', size: 273.79, gzipped: 82.47 },
      { name: 'mui', size: 144.95, gzipped: 43.92 },
      { name: 'utils', size: 81.73, gzipped: 25.35 },
    ],
  };

  const getSizeColor = (size) => {
    if (size > 500) return 'error';
    if (size > 200) return 'warning';
    return 'success';
  };

  return (
    <>
      <Button
        startIcon={<Storage />}
        onClick={() => setOpen(true)}
        variant="outlined"
        size="small"
      >
        Bundle Analysis
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bundle Size Analysis</DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Total Bundle Size
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color={getSizeColor(mockBundleData.totalSize)}>
                      {mockBundleData.totalSize} KB
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uncompressed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success">
                      {mockBundleData.gzippedSize} KB
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Gzipped
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" gutterBottom>
            Chunk Breakdown
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chunk Name</TableCell>
                  <TableCell align="right">Size (KB)</TableCell>
                  <TableCell align="right">Gzipped (KB)</TableCell>
                  <TableCell align="right">Compression</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockBundleData.chunks.map((chunk) => (
                  <TableRow key={chunk.name}>
                    <TableCell>{chunk.name}</TableCell>
                    <TableCell align="right">{chunk.size}</TableCell>
                    <TableCell align="right">{chunk.gzipped}</TableCell>
                    <TableCell align="right">
                      {Math.round((1 - chunk.gzipped / chunk.size) * 100)}%
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={chunk.size > 500 ? 'Large' : chunk.size > 200 ? 'Medium' : 'Small'}
                        color={getSizeColor(chunk.size)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3}>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Optimization Recommendations:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Consider code splitting for chunks > 500KB"
                    secondary="Use dynamic imports for route-based splitting"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tree shake unused dependencies"
                    secondary="Remove unused imports and dependencies"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Enable compression"
                    secondary="Configure gzip/brotli compression on server"
                  />
                </ListItem>
              </List>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Web vitals monitor
export const WebVitalsMonitor = () => {
  const [vitals, setVitals] = useState({
    CLS: 0,
    FID: 0,
    FCP: 0,
    LCP: 0,
    TTFB: 0,
  });

  useEffect(() => {
    // Mock web vitals (in real app, use web-vitals library)
    const mockVitals = {
      CLS: 0.1,
      FID: 45,
      FCP: 1200,
      LCP: 2100,
      TTFB: 150,
    };
    
    setVitals(mockVitals);
  }, []);

  const getVitalScore = (metric, value) => {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 'good': return 'success';
      case 'needs-improvement': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
        <Assessment />
        Core Web Vitals
      </Typography>
      
      <Grid container spacing={2}>
        {Object.entries(vitals).map(([metric, value]) => {
          const score = getVitalScore(metric, value);
          const color = getScoreColor(score);
          
          return (
            <Grid item xs={12} sm={6} md={2.4} key={metric}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="h6" color={color}>
                    {metric === 'CLS' ? value.toFixed(3) : Math.round(value)}
                    {metric !== 'CLS' && 'ms'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric}
                  </Typography>
                  <Chip
                    size="small"
                    label={score.replace('-', ' ')}
                    color={color}
                    sx={{ mt: 0.5, fontSize: '0.7rem' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          CLS: Cumulative Layout Shift | FID: First Input Delay | FCP: First Contentful Paint | 
          LCP: Largest Contentful Paint | TTFB: Time to First Byte
        </Typography>
      </Box>
    </Paper>
  );
};

export default {
  usePerformanceMetrics,
  PerformanceMonitor,
  BundleAnalyzer,
  WebVitalsMonitor,
};
