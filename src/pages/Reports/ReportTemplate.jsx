// Enhanced Report Template with advanced features
import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  LinearProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
  Skeleton,
} from '@mui/material';
import {
  Print,
  Download,
  Share,
  Refresh,
  Settings,
  FilterList,
  Sort,
  Fullscreen,
  FullscreenExit,
  MoreVert,
  PictureAsPdf,
  TableView,
  Schedule,
  Save,
  Email,
  Link,
  Close,
} from '@mui/icons-material';
import {
  LineChart,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Line,
  Bar,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import '../../design-system.css';

// Enhanced Report Template Component
const ReportTemplate = forwardRef(
  (
    {
      title,
      description,
      children,
      data,
      loading = false,
      error = null,
      enableExport = true,
      enablePrint = true,
      enableShare = true,
      enableFilters = true,
      enableRefresh = true,
      enableSchedule = false,
      customActions = [],
      onRefresh,
      onExport,
      onPrint,
      onShare,
      onSchedule,
      filters = {},
      onFilterChange,
      refreshInterval = 0,
      lastUpdated = null,
      metadata = {},
    },
    ref
  ) => {
    // State Management
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [exportFormat, setExportFormat] = useState('xlsx');
    const [shareMethod, setShareMethod] = useState('link');
    const [isExporting, setIsExporting] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshTimer, setRefreshTimer] = useState(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      exportReport: handleExport,
      printReport: handlePrint,
      toggleFullscreen: () => setIsFullscreen(!isFullscreen),
      refresh: handleRefresh,
    }));

    // Auto-refresh functionality
    useEffect(() => {
      if (autoRefresh && refreshInterval > 0 && onRefresh) {
        const timer = setInterval(() => {
          onRefresh();
        }, refreshInterval * 1000);
        setRefreshTimer(timer);
        return () => clearInterval(timer);
      } else if (refreshTimer) {
        clearInterval(refreshTimer);
        setRefreshTimer(null);
      }
    }, [autoRefresh, refreshInterval, onRefresh]);

    // Export Functions
    const handleExport = useCallback(async () => {
      if (!data) {
        toast.error('No data to export');
        return;
      }

      setIsExporting(true);
      try {
        switch (exportFormat) {
          case 'pdf':
            await exportToPDF();
            break;
          case 'xlsx':
            await exportToExcel();
            break;
          case 'csv':
            await exportToCSV();
            break;
          default:
            throw new Error('Unsupported export format');
        }

        if (onExport) {
          onExport(exportFormat);
        }

        setExportDialogOpen(false);
        toast.success(`Report exported as ${exportFormat.toUpperCase()}`);
      } catch (error) {
        toast.error(`Export failed: ${error.message}`);
      } finally {
        setIsExporting(false);
      }
    }, [data, exportFormat, onExport]);

    const exportToPDF = async () => {
      const pdf = new jsPDF();

      // Header
      pdf.setFontSize(20);
      pdf.text(title || 'Report', 20, 30);

      if (description) {
        pdf.setFontSize(12);
        pdf.text(description, 20, 45);
      }

      // Metadata
      let yPos = description ? 60 : 50;
      pdf.setFontSize(10);
      pdf.text(`Generated: ${format(new Date(), 'PPpp', { locale: idLocale })}`, 20, yPos);

      if (lastUpdated) {
        yPos += 10;
        pdf.text(
          `Last Updated: ${format(new Date(lastUpdated), 'PPpp', { locale: idLocale })}`,
          20,
          yPos
        );
      }

      if (metadata.totalRecords) {
        yPos += 10;
        pdf.text(`Total Records: ${metadata.totalRecords.toLocaleString()}`, 20, yPos);
      }

      // Data table
      if (Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]);
        const rows = data.map(item => columns.map(col => String(item[col] || '')));

        pdf.autoTable({
          head: [columns],
          body: rows,
          startY: yPos + 20,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
      }

      pdf.save(`${title?.replace(/[^a-z0-9]/gi, '_') || 'report'}.pdf`);
    };

    const exportToExcel = async () => {
      if (!Array.isArray(data)) return;

      const workbook = XLSX.utils.book_new();

      // Main data sheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      // Metadata sheet
      const metadataSheet = XLSX.utils.json_to_sheet([
        {
          'Report Title': title,
          Description: description,
          Generated: format(new Date(), 'PPpp'),
          'Last Updated': lastUpdated ? format(new Date(lastUpdated), 'PPpp') : 'N/A',
          'Total Records': data.length,
          ...metadata,
        },
      ]);
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

      XLSX.writeFile(workbook, `${title?.replace(/[^a-z0-9]/gi, '_') || 'report'}.xlsx`);
    };

    const exportToCSV = async () => {
      if (!Array.isArray(data)) return;

      const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${title?.replace(/[^a-z0-9]/gi, '_') || 'report'}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    };

    // Other Handlers
    const handlePrint = () => {
      if (onPrint) {
        onPrint();
      } else {
        window.print();
      }
    };

    const handleRefresh = () => {
      if (onRefresh) {
        onRefresh();
        toast.info('Report refreshed');
      }
    };

    const handleShare = async () => {
      try {
        switch (shareMethod) {
          case 'link':
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
            break;
          case 'email':
            window.location.href = `mailto:?subject=${encodeURIComponent(title || 'Report')}&body=${encodeURIComponent(window.location.href)}`;
            break;
          default:
            break;
        }

        if (onShare) {
          onShare(shareMethod);
        }

        setShareDialogOpen(false);
      } catch (error) {
        toast.error('Share failed');
      }
    };

    // Render Components
    const renderToolbar = () => (
      <Toolbar sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h1">
            {title || 'Report'}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Status Indicators */}
          {loading && <LinearProgress sx={{ width: 100, mr: 2 }} />}

          {lastUpdated && (
            <Tooltip
              title={`Last updated: ${format(new Date(lastUpdated), 'PPpp', { locale: idLocale })}`}
            >
              <Chip
                icon={<Schedule />}
                label={format(new Date(lastUpdated), 'HH:mm')}
                size="small"
                variant="outlined"
              />
            </Tooltip>
          )}

          {metadata.totalRecords && (
            <Chip
              label={`${metadata.totalRecords.toLocaleString()} records`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}

          {/* Action Buttons */}
          {enableRefresh && (
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}

          {enablePrint && (
            <Tooltip title="Print Report">
              <IconButton onClick={handlePrint}>
                <Print />
              </IconButton>
            </Tooltip>
          )}

          {enableExport && (
            <Tooltip title="Export Report">
              <IconButton onClick={() => setExportDialogOpen(true)}>
                <Download />
              </IconButton>
            </Tooltip>
          )}

          {enableShare && (
            <Tooltip title="Share Report">
              <IconButton onClick={() => setShareDialogOpen(true)}>
                <Share />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Fullscreen">
            <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>

          {/* More Options Menu */}
          <IconButton onClick={e => setMenuAnchor(e.currentTarget)}>
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => setSettingsDialogOpen(true)}>
              <Settings sx={{ mr: 1 }} /> Settings
            </MenuItem>
            {enableSchedule && (
              <MenuItem onClick={() => setScheduleDialogOpen(true)}>
                <Schedule sx={{ mr: 1 }} /> Schedule
              </MenuItem>
            )}
            {customActions.map((action, index) => (
              <MenuItem key={index} onClick={action.onClick}>
                {action.icon && <Box sx={{ mr: 1 }}>{action.icon}</Box>}
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    );

    const renderFilters = () => {
      if (!enableFilters || !filters || Object.keys(filters).length === 0) return null;

      return (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(filters).map(([key, config]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                {config.type === 'select' ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>{config.label}</InputLabel>
                    <Select
                      value={config.value || ''}
                      onChange={e => onFilterChange?.(key, e.target.value)}
                    >
                      {config.options?.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : config.type === 'date' ? (
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
                    <DatePicker
                      label={config.label}
                      value={config.value}
                      onChange={date => onFilterChange?.(key, date)}
                      renderInput={params => <TextField {...params} size="small" fullWidth />}
                    />
                  </LocalizationProvider>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label={config.label}
                    value={config.value || ''}
                    onChange={e => onFilterChange?.(key, e.target.value)}
                    type={config.type || 'text'}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      );
    };

    const renderContent = () => {
      if (error) {
        return (
          <Alert severity="error" sx={{ m: 2 }}>
            <Typography variant="h6">Error Loading Report</Typography>
            <Typography>{error}</Typography>
          </Alert>
        );
      }

      if (loading) {
        return (
          <Box sx={{ p: 2 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
            ))}
          </Box>
        );
      }

      return <Box sx={{ p: 2 }}>{children}</Box>;
    };

    const renderDialogs = () => (
      <>
        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
          <DialogTitle>Export Report</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Export Format</InputLabel>
              <Select value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
                <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">CSV (.csv)</MenuItem>
                <MenuItem value="pdf">PDF (.pdf)</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleExport}
              variant="contained"
              disabled={isExporting}
              startIcon={isExporting ? <LinearProgress /> : <Download />}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
          <DialogTitle>Share Report</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Share Method</InputLabel>
              <Select value={shareMethod} onChange={e => setShareMethod(e.target.value)}>
                <MenuItem value="link">Copy Link</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShare} variant="contained" startIcon={<Share />}>
              Share
            </Button>
          </DialogActions>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)}>
          <DialogTitle>Report Settings</DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Switch checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
              }
              label="Auto Refresh"
            />
            {autoRefresh && (
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                label="Refresh Interval (seconds)"
                type="number"
                value={refreshInterval}
                disabled
                helperText="Refresh interval is configured by the report"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );

    // Main Render
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
        <Box
          sx={{
            height: isFullscreen ? '100vh' : 'auto',
            width: isFullscreen ? '100vw' : 'auto',
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 9999 : 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Paper elevation={isFullscreen ? 24 : 2}>
            {renderToolbar()}
            {renderFilters()}
            {renderContent()}

            {/* Footer */}
            <Divider />
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="caption" color="text.secondary">
                Report generated automatically by Stoir System on{' '}
                {format(new Date(), 'PPpp', { locale: idLocale })}
                {metadata.version && ` • Version ${metadata.version}`}
                {metadata.author && ` • Created by ${metadata.author}`}
              </Typography>
            </Box>
          </Paper>

          {renderDialogs()}
        </Box>
      </LocalizationProvider>
    );
  }
);

ReportTemplate.displayName = 'ReportTemplate';

export default ReportTemplate;
