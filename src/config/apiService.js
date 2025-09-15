// Enhanced API Service for better error handling and data processing
import axios from 'axios';
import API_BASE_URL from './api.js';

// Configure axios defaults
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor untuk debugging
axios.interceptors.request.use(
  config => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk handling response
axios.interceptors.response.use(
  response => {
    console.log(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  error => {
    console.error(
      `❌ API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Helper function to normalize response data structure
const normalizeResponse = response => {
  // Standard format: { success: boolean, message: string, data: any }

  if (response.data) {
    // Check if response.data already has the correct structure from interceptor
    if (response.data.data !== undefined && response.data.success !== undefined) {
      // Response sudah di-transform oleh interceptor, langsung return
      return {
        success: response.data.success,
        message: response.data.message || 'Operasi berhasil',
        data: response.data.data, // Array kategori ada di sini
      };
    }

    // Jika response sudah memiliki format yang benar (direct dari Laravel)
    if (typeof response.data.success === 'boolean') {
      return response.data;
    }

    // Jika response berupa array langsung
    if (Array.isArray(response.data)) {
      return {
        success: true,
        message: 'Data berhasil dimuat',
        data: response.data,
      };
    }

    // Default: treat response.data as data
    return {
      success: true,
      message: 'Operasi berhasil',
      data: response.data,
    };
  }

  // Fallback
  return {
    success: false,
    message: 'Response tidak valid',
    data: null,
  };
};

// Helper function untuk normalize error
const normalizeError = error => {
  if (error.response) {
    // Server responded with error status
    const errorData = error.response.data;
    return {
      success: false,
      message: errorData?.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
      data: null,
      errors: errorData?.errors || {},
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Tidak dapat menghubungi server',
      data: null,
      errors: {},
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'Terjadi kesalahan tidak terduga',
      data: null,
      errors: {},
    };
  }
};

// Generic API service dengan konsisten response format
export const apiService = {
  // GET request
  async get(endpoint) {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },

  // POST request
  async post(endpoint, data) {
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },

  // PUT request
  async put(endpoint, data) {
    try {
      const response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },

  // DELETE request
  async delete(endpoint) {
    try {
      const response = await axios.delete(`${API_BASE_URL}${endpoint}`);
      return normalizeResponse(response);
    } catch (error) {
      return normalizeError(error);
    }
  },
};

// Specific API services for entities
export const kategoriService = {
  getAll: () => apiService.get('/categories'),
  create: data => apiService.post('/categories', data),
  update: (kodeDivisi, kodeKategori, data) =>
    apiService.put(`/categories/${kodeDivisi}/${kodeKategori}`, data),
  delete: (kodeDivisi, kodeKategori) =>
    apiService.delete(`/categories/${kodeDivisi}/${kodeKategori}`),
};

export const salesService = {
  getAll: () => apiService.get('/sales'),
  create: data => apiService.post('/sales', data),
  update: (kodeDivisi, kodeSales, data) =>
    apiService.put(`/sales/${kodeDivisi}/${kodeSales}`, data),
  delete: (kodeDivisi, kodeSales) => apiService.delete(`/sales/${kodeDivisi}/${kodeSales}`),
};

export const areaService = {
  getAll: () => apiService.get('/areas'),
  create: data => apiService.post('/areas', data),
  update: (kodeDivisi, kodeArea, data) => apiService.put(`/areas/${kodeDivisi}/${kodeArea}`, data),
  delete: (kodeDivisi, kodeArea) => apiService.delete(`/areas/${kodeDivisi}/${kodeArea}`),
};

export const customerService = {
  getAll: () => apiService.get('/customers'),
  create: data => apiService.post('/customers', data),
  update: (kodeDivisi, kodeCust, data) =>
    apiService.put(`/customers/${kodeDivisi}/${kodeCust}`, data),
  delete: (kodeDivisi, kodeCust) => apiService.delete(`/customers/${kodeDivisi}/${kodeCust}`),
};

export const barangService = {
  getAll: () => apiService.get('/barang'),
  create: data => apiService.post('/barang', data),
  update: (kodeDivisi, kodeBarang, data) =>
    apiService.put(`/barang/${kodeDivisi}/${kodeBarang}`, data),
  delete: (kodeDivisi, kodeBarang) => apiService.delete(`/barang/${kodeDivisi}/${kodeBarang}`),
};

// Sparepart service (d_barang table)
export const sparepartService = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/spareparts${queryString ? `?${queryString}` : ''}`);
  },
  create: data => apiService.post('/spareparts', data),
  update: (kodeDivisi, kodeBarang, id, data) =>
    apiService.put(`/spareparts/${kodeDivisi}/${kodeBarang}/${id}`, data),
  delete: (kodeDivisi, kodeBarang, id) =>
    apiService.delete(`/spareparts/${kodeDivisi}/${kodeBarang}/${id}`),
  search: params => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.get(`/spareparts/search?${queryString}`);
  },
};

// Master data services for newly activated endpoints
export const supplierService = {
  getAll: () => apiService.get('/suppliers'),
  create: data => apiService.post('/suppliers', data),
  update: (id, data) => apiService.put(`/suppliers/${id}`, data),
  delete: id => apiService.delete(`/suppliers/${id}`),
};

export const mcoaService = {
  getAll: () => apiService.get('/mcoa'),
  create: data => apiService.post('/mcoa', data),
  update: (id, data) => apiService.put(`/mcoa/${id}`, data),
  delete: id => apiService.delete(`/mcoa/${id}`),
};

export const mdivisiService = {
  getAll: () => apiService.get('/mdivisi'),
  create: data => apiService.post('/mdivisi', data),
  update: (id, data) => apiService.put(`/mdivisi/${id}`, data),
  delete: id => apiService.delete(`/mdivisi/${id}`),
};

export const mdokumenService = {
  getAll: () => apiService.get('/mdokumen'),
  create: data => apiService.post('/mdokumen', data),
  update: (kodeDivisi, kodeDok, data) => apiService.put(`/mdokumen/${kodeDivisi}/${kodeDok}`, data),
  delete: (kodeDivisi, kodeDok) => apiService.delete(`/mdokumen/${kodeDivisi}/${kodeDok}`),
};

export const masterUserService = {
  getAll: () => apiService.get('/master-user'),
  create: data => apiService.post('/master-user', data),
  update: (kodeDivisi, username, data) =>
    apiService.put(`/master-user/${kodeDivisi}/${username}`, data),
  delete: (kodeDivisi, username) => apiService.delete(`/master-user/${kodeDivisi}/${username}`),
};

// Bank Service
export const bankService = {
  getAll: () => apiService.get('/banks'),
  getById: (kodeDivisi, kodeBank) => apiService.get(`/banks/${kodeDivisi}/${kodeBank}`),
  create: data => apiService.post('/banks', data),
  update: (kodeDivisi, kodeBank, data) => apiService.put(`/banks/${kodeDivisi}/${kodeBank}`, data),
  delete: (kodeDivisi, kodeBank) => apiService.delete(`/banks/${kodeDivisi}/${kodeBank}`),
};

// Invoice Service
export const invoiceService = {
  getAll: () => apiService.get('/invoices'),
  getById: (kodeDivisi, noInvoice) => apiService.get(`/invoices/${kodeDivisi}/${noInvoice}`),
  create: data => apiService.post('/invoices', data),
  update: (kodeDivisi, noInvoice, data) =>
    apiService.put(`/invoices/${kodeDivisi}/${noInvoice}`, data),
  delete: (kodeDivisi, noInvoice) => apiService.delete(`/invoices/${kodeDivisi}/${noInvoice}`),
};

export default apiService;
