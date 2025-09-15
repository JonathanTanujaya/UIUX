// Comprehensive error handling and error boundary components
import React, { Component, useState, useEffect, useCallback } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography,
  Collapse,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  ExpandMore,
  ExpandLess,
  Refresh,
  BugReport,
  Close,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Error types and severity levels
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  SERVER: 'server',
  CLIENT: 'client',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown',
};

export const ERROR_SEVERITY = {
  LOW: 'info',
  MEDIUM: 'warning',
  HIGH: 'error',
  CRITICAL: 'error',
};

// Error categorization and mapping
export const ERROR_MAPPINGS = {
  // HTTP Status Code mappings
  400: { type: ERROR_TYPES.VALIDATION, severity: ERROR_SEVERITY.MEDIUM },
  401: { type: ERROR_TYPES.AUTHENTICATION, severity: ERROR_SEVERITY.HIGH },
  403: { type: ERROR_TYPES.AUTHORIZATION, severity: ERROR_SEVERITY.HIGH },
  404: { type: ERROR_TYPES.NOT_FOUND, severity: ERROR_SEVERITY.MEDIUM },
  408: { type: ERROR_TYPES.TIMEOUT, severity: ERROR_SEVERITY.MEDIUM },
  422: { type: ERROR_TYPES.VALIDATION, severity: ERROR_SEVERITY.MEDIUM },
  500: { type: ERROR_TYPES.SERVER, severity: ERROR_SEVERITY.CRITICAL },
  502: { type: ERROR_TYPES.NETWORK, severity: ERROR_SEVERITY.HIGH },
  503: { type: ERROR_TYPES.SERVER, severity: ERROR_SEVERITY.HIGH },
  504: { type: ERROR_TYPES.TIMEOUT, severity: ERROR_SEVERITY.HIGH },
};

// Default error messages
export const DEFAULT_ERROR_MESSAGES = {
  [ERROR_TYPES.VALIDATION]: {
    title: 'Kesalahan Validasi',
    message: 'Mohon periksa kembali data yang dimasukkan',
    action: 'Perbaiki dan coba lagi',
  },
  [ERROR_TYPES.NETWORK]: {
    title: 'Kesalahan Jaringan',
    message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    action: 'Coba lagi',
  },
  [ERROR_TYPES.SERVER]: {
    title: 'Kesalahan Server',
    message: 'Terjadi kesalahan pada server. Tim teknis telah diberitahu.',
    action: 'Coba lagi nanti',
  },
  [ERROR_TYPES.CLIENT]: {
    title: 'Kesalahan Aplikasi',
    message: 'Terjadi kesalahan pada aplikasi',
    action: 'Refresh halaman',
  },
  [ERROR_TYPES.AUTHENTICATION]: {
    title: 'Kesalahan Autentikasi',
    message: 'Sesi Anda telah berakhir. Silakan login kembali.',
    action: 'Login',
  },
  [ERROR_TYPES.AUTHORIZATION]: {
    title: 'Akses Ditolak',
    message: 'Anda tidak memiliki izin untuk mengakses fitur ini.',
    action: 'Hubungi administrator',
  },
  [ERROR_TYPES.NOT_FOUND]: {
    title: 'Data Tidak Ditemukan',
    message: 'Data yang Anda cari tidak ditemukan.',
    action: 'Periksa kembali',
  },
  [ERROR_TYPES.TIMEOUT]: {
    title: 'Timeout',
    message: 'Permintaan memakan waktu terlalu lama.',
    action: 'Coba lagi',
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Kesalahan Tidak Dikenal',
    message: 'Terjadi kesalahan yang tidak dikenal.',
    action: 'Coba lagi',
  },
};

// Error parsing and processing functions
export const parseError = error => {
  let parsedError = {
    type: ERROR_TYPES.UNKNOWN,
    severity: ERROR_SEVERITY.MEDIUM,
    title: '',
    message: '',
    details: [],
    code: null,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  // Handle different error types
  if (error.response) {
    // HTTP Error Response
    const status = error.response.status;
    const data = error.response.data;

    const mapping = ERROR_MAPPINGS[status] || {
      type: ERROR_TYPES.SERVER,
      severity: ERROR_SEVERITY.HIGH,
    };

    parsedError = {
      ...parsedError,
      type: mapping.type,
      severity: mapping.severity,
      code: status,
      message: data?.message || DEFAULT_ERROR_MESSAGES[mapping.type].message,
      title: data?.title || DEFAULT_ERROR_MESSAGES[mapping.type].title,
    };

    // Handle validation errors
    if (status === 422 && data?.errors) {
      parsedError.details = Object.entries(data.errors).map(([field, messages]) => ({
        field,
        messages: Array.isArray(messages) ? messages : [messages],
      }));
    }
  } else if (error.request) {
    // Network Error
    parsedError = {
      ...parsedError,
      type: ERROR_TYPES.NETWORK,
      severity: ERROR_SEVERITY.HIGH,
      title: DEFAULT_ERROR_MESSAGES[ERROR_TYPES.NETWORK].title,
      message: DEFAULT_ERROR_MESSAGES[ERROR_TYPES.NETWORK].message,
    };
  } else if (error.name === 'ValidationError') {
    // Client-side validation error
    parsedError = {
      ...parsedError,
      type: ERROR_TYPES.VALIDATION,
      severity: ERROR_SEVERITY.MEDIUM,
      title: DEFAULT_ERROR_MESSAGES[ERROR_TYPES.VALIDATION].title,
      message: error.message || DEFAULT_ERROR_MESSAGES[ERROR_TYPES.VALIDATION].message,
      details: error.errors
        ? Object.entries(error.errors).map(([field, message]) => ({
            field,
            messages: [message],
          }))
        : [],
    };
  } else {
    // Generic error
    parsedError = {
      ...parsedError,
      type: ERROR_TYPES.CLIENT,
      severity: ERROR_SEVERITY.MEDIUM,
      title: DEFAULT_ERROR_MESSAGES[ERROR_TYPES.CLIENT].title,
      message: error.message || DEFAULT_ERROR_MESSAGES[ERROR_TYPES.CLIENT].message,
    };
  }

  return parsedError;
};

// Error Context Provider
export const ErrorContext = React.createContext({
  errors: [],
  addError: () => {},
  removeError: () => {},
  clearErrors: () => {},
});

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = useCallback(error => {
    const parsedError = parseError(error);
    const errorId = Date.now().toString();

    setErrors(prev => [...prev, { ...parsedError, id: errorId }]);

    // Auto-remove error after timeout (except critical errors)
    if (parsedError.severity !== ERROR_SEVERITY.CRITICAL) {
      setTimeout(() => {
        removeError(errorId);
      }, 8000);
    }

    return errorId;
  }, []);

  const removeError = useCallback(errorId => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

// Error Boundary Component
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const parsedError = parseError(error);
    const errorId = Date.now().toString();

    this.setState({
      error: parsedError,
      errorInfo,
      errorId,
    });

    // Log error to monitoring service
    if (this.props.onError) {
      this.props.onError(parsedError, errorInfo);
    }

    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

// Error Boundary Fallback Component
export const ErrorBoundaryFallback = ({ error, onRetry, showDetails = false }) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const getErrorIcon = severity => {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return <ErrorIcon color="error" sx={{ fontSize: 48 }} />;
      case ERROR_SEVERITY.HIGH:
        return <ErrorIcon color="error" sx={{ fontSize: 40 }} />;
      case ERROR_SEVERITY.MEDIUM:
        return <WarningIcon color="warning" sx={{ fontSize: 40 }} />;
      default:
        return <InfoIcon color="info" sx={{ fontSize: 40 }} />;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      p={4}
      textAlign="center"
    >
      {getErrorIcon(error?.severity)}

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
        {error?.title || 'Terjadi Kesalahan'}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        {error?.message || 'Aplikasi mengalami masalah yang tidak terduga.'}
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetry} color="primary">
          Coba Lagi
        </Button>

        <Button variant="outlined" onClick={() => window.location.reload()}>
          Refresh Halaman
        </Button>

        {showDetails && (
          <Button
            variant="text"
            startIcon={<BugReport />}
            onClick={() => setShowErrorDetails(true)}
            size="small"
          >
            Detail Error
          </Button>
        )}
      </Box>

      {/* Error Details Dialog */}
      <Dialog
        open={showErrorDetails}
        onClose={() => setShowErrorDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detail Error
          <IconButton
            onClick={() => setShowErrorDetails(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Error ID:</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {error?.timestamp}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Type:</Typography>
            <Chip label={error?.type} size="small" />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Severity:</Typography>
            <Chip
              label={error?.severity}
              size="small"
              color={error?.severity === ERROR_SEVERITY.CRITICAL ? 'error' : 'warning'}
            />
          </Box>

          {error?.stack && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Stack Trace:</Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  maxHeight: 200,
                }}
              >
                {error.stack}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDetails(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Inline Error Component for forms
export const InlineError = ({
  error,
  severity = ERROR_SEVERITY.MEDIUM,
  showIcon = true,
  onDismiss,
  className,
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.HIGH:
        return <ErrorIcon />;
      case ERROR_SEVERITY.MEDIUM:
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Alert
      severity={severity}
      className={className}
      onClose={onDismiss}
      icon={showIcon ? getIcon() : false}
      sx={{ mt: 1 }}
    >
      {typeof error === 'string' ? error : error.message}
    </Alert>
  );
};

// Field Error Component
export const FieldError = ({ error, fieldName, showFieldName = false }) => {
  if (!error) return null;

  return (
    <Typography
      variant="caption"
      color="error"
      sx={{
        display: 'block',
        mt: 0.5,
        fontSize: '0.75rem',
      }}
    >
      {showFieldName && fieldName && `${fieldName}: `}
      {error}
    </Typography>
  );
};

// Error List Component
export const ErrorList = ({ errors, onDismiss, maxItems = 5, showTimestamp = false }) => {
  const [expandedErrors, setExpandedErrors] = useState(new Set());

  const toggleErrorExpansion = errorId => {
    setExpandedErrors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(errorId)) {
        newSet.delete(errorId);
      } else {
        newSet.add(errorId);
      }
      return newSet;
    });
  };

  if (!errors || errors.length === 0) return null;

  const displayErrors = errors.slice(0, maxItems);

  return (
    <Box sx={{ mb: 2 }}>
      {displayErrors.map(error => (
        <Alert
          key={error.id}
          severity={error.severity}
          onClose={() => onDismiss && onDismiss(error.id)}
          sx={{ mb: 1 }}
          action={
            error.details &&
            error.details.length > 0 && (
              <IconButton onClick={() => toggleErrorExpansion(error.id)} size="small">
                {expandedErrors.has(error.id) ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )
          }
        >
          <AlertTitle>{error.title}</AlertTitle>
          {error.message}

          {showTimestamp && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {new Date(error.timestamp).toLocaleString()}
            </Typography>
          )}

          <Collapse in={expandedErrors.has(error.id)}>
            {error.details && error.details.length > 0 && (
              <List dense sx={{ mt: 1 }}>
                {error.details.map((detail, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <ErrorIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={detail.field} secondary={detail.messages.join(', ')} />
                  </ListItem>
                ))}
              </List>
            )}
          </Collapse>
        </Alert>
      ))}

      {errors.length > maxItems && (
        <Typography variant="caption" color="text.secondary">
          Dan {errors.length - maxItems} error lainnya...
        </Typography>
      )}
    </Box>
  );
};

// Success Feedback Component
export const SuccessFeedback = ({
  message,
  title = 'Berhasil',
  onDismiss,
  autoHide = true,
  hideDelay = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide && hideDelay > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, onDismiss]);

  if (!visible || !message) return null;

  return (
    <Alert severity="success" onClose={onDismiss} icon={<SuccessIcon />} sx={{ mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

// Global Error Handler Hook
export const useGlobalErrorHandler = () => {
  const handleError = useCallback((error, options = {}) => {
    const parsedError = parseError(error);

    // Show toast notification
    const toastMessage = options.customMessage || parsedError.message;

    switch (parsedError.severity) {
      case ERROR_SEVERITY.CRITICAL:
        toast.error(toastMessage, { autoClose: false });
        break;
      case ERROR_SEVERITY.HIGH:
        toast.error(toastMessage, { autoClose: 8000 });
        break;
      case ERROR_SEVERITY.MEDIUM:
        toast.warning(toastMessage);
        break;
      default:
        toast.info(toastMessage);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error Handler:', parsedError);
    }

    // Call custom error handler if provided
    if (options.onError) {
      options.onError(parsedError);
    }

    return parsedError;
  }, []);

  return { handleError };
};

export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  parseError,
  ErrorBoundary,
  ErrorBoundaryFallback,
  InlineError,
  FieldError,
  ErrorList,
  SuccessFeedback,
  useGlobalErrorHandler,
  ErrorProvider,
  ErrorContext,
};
