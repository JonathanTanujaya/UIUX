import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach(message => toast.error(message));
          } else {
            toast.error(data.message || 'Validation error occurred.');
          }
          break;
        case 500:
          toast.error('Internal server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred while processing your request.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// API utility functions
export const apiUtils = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file
  upload: async (url, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }

      const response = await apiClient.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file
  download: async (url, filename = null) => {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
  },

  // Master Data
  master: {
    categories: '/master/categories',
    customers: '/master/customers',
    suppliers: '/master/suppliers',
    products: '/master/products',
    sales: '/master/sales',
    areas: '/master/areas',
  },

  // Transactions
  transactions: {
    sales: '/transactions/sales',
    purchases: '/transactions/purchases',
    returns: '/transactions/returns',
    adjustments: '/transactions/adjustments',
  },

  // Reports
  reports: {
    sales: '/reports/sales',
    purchases: '/reports/purchases',
    inventory: '/reports/inventory',
    financial: '/reports/financial',
  },

  // Finance
  finance: {
    payments: '/finance/payments',
    receivables: '/finance/receivables',
    banking: '/finance/banking',
  },
};

// API hooks for common operations
export const useApi = () => {
  const handleApiCall = async (apiCall, successMessage = null, errorMessage = null) => {
    try {
      const result = await apiCall();
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      if (errorMessage) {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  return { handleApiCall };
};

// Export the configured axios instance
export default apiClient;
