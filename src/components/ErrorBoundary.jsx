import React from 'react';
import { Box, Paper, Typography, Button, Alert, AlertTitle, Container, Stack } from '@mui/material';
import { ErrorOutline, Refresh, Home } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 80,
                color: 'error.main',
                mb: 2,
              }}
            />

            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry for the inconvenience. An unexpected error has occurred.
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <AlertTitle>Error Details</AlertTitle>
              {this.state.error && this.state.error.toString()}
            </Alert>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                size="large"
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                size="large"
              >
                Go to Dashboard
              </Button>
            </Stack>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Development Error Info:
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    overflow: 'auto',
                    maxHeight: 300,
                  }}
                >
                  <pre style={{ fontSize: '12px', margin: 0 }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Simple Error Display Component
export const ErrorMessage = ({
  title = 'Error',
  message = 'Something went wrong',
  onRetry = null,
  severity = 'error',
}) => (
  <Alert
    severity={severity}
    sx={{ mb: 2 }}
    action={
      onRetry && (
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      )
    }
  >
    <AlertTitle>{title}</AlertTitle>
    {message}
  </Alert>
);

// 404 Not Found Component
export const NotFound = () => (
  <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
      404
    </Typography>
    <Typography variant="h4" gutterBottom>
      Page Not Found
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      The page you're looking for doesn't exist or has been moved.
    </Typography>
    <Button
      variant="contained"
      startIcon={<Home />}
      onClick={() => (window.location.href = '/dashboard')}
      size="large"
    >
      Go to Dashboard
    </Button>
  </Container>
);

export default ErrorBoundary;
