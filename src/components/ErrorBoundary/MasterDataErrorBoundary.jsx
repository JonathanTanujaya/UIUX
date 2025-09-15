import React from 'react';

/**
 * Error Boundary untuk MasterData components
 * Menangkap dan menampilkan error dengan graceful fallback UI
 */
class MasterDataErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state untuk menampilkan fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error untuk debugging
    console.error('🚨 MasterData Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI yang professional
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">
              Aplikasi mengalami masalah teknis. Tim kami sedang menanganinya.
            </p>

            {/* Error details untuk development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-red-700 mb-2">
                  Detail Error (Development Mode)
                </summary>
                <div className="text-sm text-red-600 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🔄 Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🏠 Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component untuk membungkus komponen dengan Error Boundary
 */
export const withErrorBoundary = WrappedComponent => {
  return class extends React.Component {
    render() {
      return (
        <MasterDataErrorBoundary>
          <WrappedComponent {...this.props} />
        </MasterDataErrorBoundary>
      );
    }
  };
};

/**
 * Hook untuk error reporting dari functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const reportError = React.useCallback((error, errorInfo = {}) => {
    console.error('🚨 Error reported from component:', error, errorInfo);

    // Kirim error ke service monitoring (jika ada)
    if (window.errorReporting) {
      window.errorReporting.report(error, errorInfo);
    }

    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, reportError, clearError };
};

export default MasterDataErrorBoundary;
