import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Fullscreen,
  Settings,
  Refresh,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const ChartContainer = ({
  data = [],
  title = 'Chart',
  type = 'bar', // bar, line, area, pie, scatter, radar
  loading = false,
  error = null,
  height = 400,
  xAxisKey = 'name',
  yAxisKeys = ['value'],
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'],
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  enableZoom = false,
  enableExport = true,
  onDataPointClick,
  customTooltip,
  formatters = {},
}) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    showLegend,
    showGrid,
    showTooltip,
    enableZoom,
    colors: [...colors],
    visibleSeries: yAxisKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}),
  });
  const chartRef = useRef();

  // Chart data processing
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => {
      const processed = { ...item };
      
      // Apply formatters
      Object.entries(formatters).forEach(([key, formatter]) => {
        if (processed[key] !== undefined) {
          processed[key] = formatter(processed[key]);
        }
      });
      
      return processed;
    });
  }, [data, formatters]);

  // Visible series data
  const visibleYAxisKeys = useMemo(() => {
    return yAxisKeys.filter(key => chartConfig.visibleSeries[key]);
  }, [yAxisKeys, chartConfig.visibleSeries]);

  // Export chart as image
  const handleExport = useCallback(() => {
    if (!chartRef.current) return;
    
    const svg = chartRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}_chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }, [title]);

  // Custom tooltip component
  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    if (customTooltip) {
      return customTooltip({ active, payload, label });
    }
    
    return (
      <Paper sx={{ p: 1, border: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2">{label}</Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }, [customTooltip]);

  // Chart configuration handlers
  const handleConfigChange = useCallback((key, value) => {
    setChartConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSeriesVisibility = useCallback((seriesKey) => {
    setChartConfig(prev => ({
      ...prev,
      visibleSeries: {
        ...prev.visibleSeries,
        [seriesKey]: !prev.visibleSeries[seriesKey]
      }
    }));
  }, []);

  // Render different chart types
  const renderChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const commonAxisProps = {
      tick: { fontSize: 12 },
      axisLine: { stroke: '#ccc' },
      tickLine: { stroke: '#ccc' },
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            {chartConfig.showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
            {chartConfig.showLegend && <Legend />}
            {visibleYAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartConfig.colors[index % chartConfig.colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                onClick={onDataPointClick}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            {chartConfig.showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
            {chartConfig.showLegend && <Legend />}
            {visibleYAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={chartConfig.colors[index % chartConfig.colors.length]}
                fill={chartConfig.colors[index % chartConfig.colors.length]}
                fillOpacity={0.7}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        const pieData = processedData.map((item, index) => ({
          ...item,
          fill: chartConfig.colors[index % chartConfig.colors.length]
        }));
        
        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey={visibleYAxisKeys[0] || 'value'}
              nameKey={xAxisKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            {chartConfig.showTooltip && <RechartsTooltip />}
            {chartConfig.showLegend && <Legend />}
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} {...commonAxisProps} />
            <YAxis dataKey={visibleYAxisKeys[0]} {...commonAxisProps} />
            {chartConfig.showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
            {chartConfig.showLegend && <Legend />}
            <Scatter
              data={processedData}
              fill={chartConfig.colors[0]}
            />
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart {...commonProps}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xAxisKey} />
            <PolarRadiusAxis />
            {chartConfig.showTooltip && <RechartsTooltip />}
            {chartConfig.showLegend && <Legend />}
            {visibleYAxisKeys.map((key, index) => (
              <Radar
                key={key}
                name={key}
                dataKey={key}
                stroke={chartConfig.colors[index % chartConfig.colors.length]}
                fill={chartConfig.colors[index % chartConfig.colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </RadarChart>
        );

      default: // bar
        return (
          <BarChart {...commonProps}>
            {chartConfig.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            {chartConfig.showTooltip && <RechartsTooltip content={<CustomTooltip />} />}
            {chartConfig.showLegend && <Legend />}
            {visibleYAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartConfig.colors[index % chartConfig.colors.length]}
                onClick={onDataPointClick}
              />
            ))}
          </BarChart>
        );
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!processedData.length || !visibleYAxisKeys.length) return null;
    
    const stats = {};
    visibleYAxisKeys.forEach(key => {
      const values = processedData.map(item => item[key]).filter(v => typeof v === 'number');
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        stats[key] = { sum, avg, min, max, count: values.length };
      }
    });
    
    return stats;
  }, [processedData, visibleYAxisKeys]);

  const containerHeight = fullscreen ? '80vh' : height;

  return (
    <>
      <Paper elevation={1} sx={{ height: fullscreen ? '90vh' : 'auto' }}>
        {/* Header */}
        <Box p={2} borderBottom={1} borderColor="divider">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{title}</Typography>
            <Box display="flex" gap={1}>
              <IconButton size="small" onClick={() => window.location.reload()}>
                <Refresh />
              </IconButton>
              {enableExport && (
                <IconButton size="small" onClick={handleExport}>
                  <Download />
                </IconButton>
              )}
              <IconButton size="small" onClick={() => setConfigOpen(true)}>
                <Settings />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setFullscreen(!fullscreen)}
              >
                <Fullscreen />
              </IconButton>
            </Box>
          </Box>
          
          {/* Series Toggle */}
          {yAxisKeys.length > 1 && (
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              {yAxisKeys.map(key => (
                <Chip
                  key={key}
                  label={key}
                  size="small"
                  color={chartConfig.visibleSeries[key] ? 'primary' : 'default'}
                  onClick={() => toggleSeriesVisibility(key)}
                  icon={chartConfig.visibleSeries[key] ? <Visibility /> : <VisibilityOff />}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Chart Content */}
        <Box sx={{ height: containerHeight, p: 1 }} ref={chartRef}>
          {loading ? (
            <Box p={2}>
              <Skeleton variant="rectangular" height={containerHeight - 32} />
            </Box>
          ) : error ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={containerHeight}
            >
              <Typography color="error">{error}</Typography>
            </Box>
          ) : processedData.length === 0 ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={containerHeight}
            >
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          )}
        </Box>

        {/* Statistics */}
        {stats && (
          <Box p={2} borderTop={1} borderColor="divider">
            <Grid container spacing={2}>
              {Object.entries(stats).map(([key, stat]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {key}
                    </Typography>
                    <Typography variant="body2">
                      Min: {stat.min} | Max: {stat.max}
                    </Typography>
                    <Typography variant="body2">
                      Avg: {stat.avg.toFixed(2)} | Sum: {stat.sum}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Configuration Dialog */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chart Configuration</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showLegend}
                    onChange={(e) => handleConfigChange('showLegend', e.target.checked)}
                  />
                }
                label="Show Legend"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showGrid}
                    onChange={(e) => handleConfigChange('showGrid', e.target.checked)}
                  />
                }
                label="Show Grid"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showTooltip}
                    onChange={(e) => handleConfigChange('showTooltip', e.target.checked)}
                  />
                }
                label="Show Tooltip"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Fullscreen Overlay */}
      {fullscreen && (
        <Dialog
          open={fullscreen}
          onClose={() => setFullscreen(false)}
          maxWidth={false}
          fullWidth
          PaperProps={{
            sx: { width: '95vw', height: '95vh', maxWidth: 'none', m: 1 }
          }}
        >
          <ChartContainer
            {...arguments[0]}
            height="calc(95vh - 100px)"
          />
        </Dialog>
      )}
    </>
  );
};

export default ChartContainer;
