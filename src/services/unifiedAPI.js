// Unified API Service for StockFlow System
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create unified axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
  timeout: 15000, // 15 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  error => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with standardized error handling
apiClient.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  error => {
    console.error(
      `❌ API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`
    );

    // Handle different error types
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access forbidden'));
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }

    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Return the actual error response for other cases
    return Promise.reject(error);
  }
);

// Generic API service factory for standard CRUD operations
const createAPIService = endpoint => ({
  getAll: (params = {}) => apiClient.get(endpoint, { params }),
  getById: id => apiClient.get(`${endpoint}/${id}`),
  create: data => apiClient.post(endpoint, data),
  update: (id, data) => apiClient.put(`${endpoint}/${id}`, data),
  delete: id => apiClient.delete(`${endpoint}/${id}`),
});

// Composite key API service factory for master data
const createCompositeAPIService = endpoint => ({
  getAll: (params = {}) => apiClient.get(endpoint, { params }),
  getByDivisi: kodeDivisi => apiClient.get(`${endpoint}/${kodeDivisi}`),
  getByCompositeKey: (kodeDivisi, key) => apiClient.get(`${endpoint}/${kodeDivisi}/${key}`),
  create: data => apiClient.post(endpoint, data),
  update: (kodeDivisi, key, data) => apiClient.put(`${endpoint}/${kodeDivisi}/${key}`, data),
  delete: (kodeDivisi, key) => apiClient.delete(`${endpoint}/${kodeDivisi}/${key}`),
});

// =============================================================================
// AUTHENTICATION API
// =============================================================================
export const authAPI = {
  login: credentials => apiClient.post('/auth/login', credentials),
  register: userData => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
  changePassword: passwordData => apiClient.post('/auth/change-password', passwordData),
  refreshToken: () => apiClient.post('/auth/refresh'),
};

// =============================================================================
// FRONTEND-FRIENDLY APIs (Simple ID-based operations)
// =============================================================================
export const categoriesAPI = createAPIService('/categories');
export const customersAPI = createAPIService('/customers');
export const suppliersAPI = createAPIService('/suppliers');
export const barangAPI = createAPIService('/barang');
export const invoicesAPI = createAPIService('/invoices');
export const salesAPI = createAPIService('/sales');

// =============================================================================
// MASTER DATA APIs (Composite key operations)
// =============================================================================
export const masterBarangAPI = createCompositeAPIService('/master-barang');
export const masterSuppliersAPI = createCompositeAPIService('/master-suppliers');
export const kategorisAPI = createCompositeAPIService('/kategoris');
export const areasAPI = createCompositeAPIService('/areas');
export const coasAPI = createCompositeAPIService('/coas');
export const dokumensAPI = createCompositeAPIService('/dokumens');

// =============================================================================
// SPECIALIZED APIs
// =============================================================================

// Sales Form API
export const salesFormAPI = {
  getCustomers: () => apiClient.get('/customers'),
  getSalesPersons: () => apiClient.get('/sales'),
  getBarang: () => apiClient.get('/barang'),
  createInvoice: data => apiClient.post('/invoices', data),
  calculateTotal: items => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return Promise.resolve({ data: { total } });
  },
};

// Purchase APIs
export const purchasesAPI = {
  ...createAPIService('/purchases'),
  getSuppliers: () => apiClient.get('/suppliers'),
  getBarang: () => apiClient.get('/barang'),
};

// Part Penerimaan APIs
export const partPenerimaanAPI = {
  ...createAPIService('/part-penerimaan'),
  getAll: () => apiClient.get('/part-penerimaan/all'),
  getBonus: () => apiClient.get('/part-penerimaan-bonus'),
  getBonusDetail: () => apiClient.get('/part-penerimaan-bonus-detail'),
};

// Finance APIs
export const financeAPI = {
  // Penerimaan Finance
  getAllPenerimaan: () => apiClient.get('/penerimaan-finance/all'),
  createPenerimaan: data => apiClient.post('/penerimaan-finance', data),
  updatePenerimaan: (id, data) => apiClient.put(`/penerimaan-finance/${id}`, data),
  deletePenerimaan: id => apiClient.delete(`/penerimaan-finance/${id}`),

  // Bank operations
  getBanks: () => apiClient.get('/banks'),
  getSaldoBank: () => apiClient.get('/saldo-bank'),

  // Journals
  getJournals: () => apiClient.get('/journals'),
  createJournal: data => apiClient.post('/journals', data),
};

// Return Sales APIs
export const returnSalesAPI = {
  ...createAPIService('/return-sales'),
  getCustomers: () => apiClient.get('/customers'),
  getInvoices: () => apiClient.get('/invoices'),
  getVCustRetur: () => apiClient.get('/v-cust-retur'),
  getVReturnSalesDetail: () => apiClient.get('/v-return-sales-detail'),
};

// Stock APIs
export const stockAPI = {
  getKartuStok: () => apiClient.get('/kartu-stok'),
  getOpnames: () => apiClient.get('/opnames'),
  createOpname: data => apiClient.post('/opnames', data),
  updateOpname: (id, data) => apiClient.put(`/opnames/${id}`, data),
  deleteOpname: id => apiClient.delete(`/opnames/${id}`),

  // Stock claims
  getClaims: () => apiClient.get('/stok-claims'),
  createClaim: data => apiClient.post('/stok-claims', data),

  // Stock minimum
  getStokMinimum: () => apiClient.get('/stok-minimum'),
  updateStokMinimum: (id, data) => apiClient.put(`/stok-minimum/${id}`, data),
};

// Print APIs
export const printAPI = {
  getTmpPrintInvoices: () => apiClient.get('/tmp-print-invoices'),
  createTmpPrintInvoice: data => apiClient.post('/tmp-print-invoices', data),
  updateTmpPrintInvoice: (id, data) => apiClient.put(`/tmp-print-invoices/${id}`, data),
  deleteTmpPrintInvoice: id => apiClient.delete(`/tmp-print-invoices/${id}`),

  getTmpPrintTT: () => apiClient.get('/tmp-print-tt'),
  createTmpPrintTT: data => apiClient.post('/tmp-print-tt', data),
};

// User Management APIs
export const userAPI = {
  getUsers: () => apiClient.get('/users'),
  getUserModules: () => apiClient.get('/user-modules'),
  getModules: () => apiClient.get('/modules'),
  getCurrentUser: () => apiClient.get('/user'),
};

// Company APIs
export const companyAPI = createAPIService('/companies');

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Standard response wrapper
export const handleAPIResponse = response => {
  if (response.data.success !== undefined) {
    return response.data;
  }
  // Wrap non-standard responses
  return {
    success: true,
    data: response.data,
    message: 'Operation completed successfully',
  };
};

// Standard error handler
export const handleAPIError = error => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  const errorCode = error.response?.status || 500;

  return {
    success: false,
    error: errorMessage,
    code: errorCode,
  };
};

// Export the axios instance for custom calls
export { apiClient };

// Legacy exports for backward compatibility
export const companiesAPI = companyAPI;
export const invoiceDetailsAPI = createAPIService('/invoice-details');
export const penerimaanFinanceAPI = financeAPI;
export const kartuStokAPI = stockAPI;
export const tmpPrintInvoicesAPI = printAPI;
export const journalsAPI = { getAll: () => apiClient.get('/journals') };
export const banksAPI = { getAll: () => apiClient.get('/banks') };
export const modulesAPI = { getAll: () => apiClient.get('/modules') };
export const usersAPI = userAPI;
export const divisionsAPI = createAPIService('/divisions');
export const documentsAPI = dokumensAPI;

// Deprecated - use new standardized APIs above
export const sparepartsAPI = barangAPI;
export const stockMinAPI = stockAPI;
export const checklistAPI = dokumensAPI;
