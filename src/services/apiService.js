// Enhanced API Service with Authentication
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false, // Important: Don't send cookies for API requests
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(
      `❌ API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`
    );

    // Handle unauthorized responses
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Normalize Laravel API response structure
const normalizeResponse = response => {
  if (response.data) {
    // Laravel returns: { success: boolean, message: string, data: any }
    if (typeof response.data.success === 'boolean') {
      return response.data;
    }

    // Handle direct data arrays/objects
    return {
      success: true,
      message: 'Success',
      data: response.data,
    };
  }

  return {
    success: false,
    message: 'Invalid response format',
    data: null,
  };
};

// Authentication API methods
export const authAPI = {
  login: async credentials => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  logout: async token => {
    try {
      const response = await apiClient.post(
        '/auth/logout',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  me: async token => {
    try {
      const response = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  changePassword: async passwordData => {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Generic CRUD API methods
export const crudAPI = {
  // GET all records
  getAll: async endpoint => {
    try {
      const response = await apiClient.get(endpoint);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // GET single record
  getById: async (endpoint, id) => {
    try {
      const response = await apiClient.get(`${endpoint}/${id}`);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // GET by division (common pattern in your backend)
  getByDivision: async (endpoint, kodeDivisi) => {
    try {
      const response = await apiClient.get(`${endpoint}/${kodeDivisi}`);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // CREATE new record
  create: async (endpoint, data) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // UPDATE existing record
  update: async (endpoint, id, data) => {
    try {
      const response = await apiClient.put(`${endpoint}/${id}`, data);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },

  // DELETE record
  delete: async (endpoint, id) => {
    try {
      const response = await apiClient.delete(`${endpoint}/${id}`);
      return normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  },
};

// Specific API services for your entities
export const customerAPI = {
  getAll: () => crudAPI.getAll('/customers'),
  getByDivision: kodeDivisi => crudAPI.getByDivision('/customers', kodeDivisi),
  getById: (kodeDivisi, kodeCust) => crudAPI.getById('/customers', `${kodeDivisi}/${kodeCust}`),
  create: data => crudAPI.create('/customers', data),
  update: (kodeDivisi, kodeCust, data) =>
    crudAPI.update('/customers', `${kodeDivisi}/${kodeCust}`, data),
  delete: (kodeDivisi, kodeCust) => crudAPI.delete('/customers', `${kodeDivisi}/${kodeCust}`),
};

export const salesAPI = {
  getAll: () => crudAPI.getAll('/sales'),
  getByDivision: kodeDivisi => crudAPI.getByDivision('/sales', kodeDivisi),
  getById: (kodeDivisi, kodeSales) => crudAPI.getById('/sales', `${kodeDivisi}/${kodeSales}`),
  create: data => crudAPI.create('/sales', data),
  update: (kodeDivisi, kodeSales, data) =>
    crudAPI.update('/sales', `${kodeDivisi}/${kodeSales}`, data),
  delete: (kodeDivisi, kodeSales) => crudAPI.delete('/sales', `${kodeDivisi}/${kodeSales}`),
};

export const barangAPI = {
  getAll: () => crudAPI.getAll('/barang'),
  getByDivision: kodeDivisi => crudAPI.getByDivision('/barang', kodeDivisi),
  getById: (kodeDivisi, kodeBarang) => crudAPI.getById('/barang', `${kodeDivisi}/${kodeBarang}`),
  create: data => crudAPI.create('/barang', data),
  update: (kodeDivisi, kodeBarang, data) =>
    crudAPI.update('/barang', `${kodeDivisi}/${kodeBarang}`, data),
  delete: (kodeDivisi, kodeBarang) => crudAPI.delete('/barang', `${kodeDivisi}/${kodeBarang}`),
  getVBarang: () => crudAPI.getAll('/vbarang'),
};

export const areaAPI = {
  getAll: () => crudAPI.getAll('/areas'),
  getByDivision: kodeDivisi => crudAPI.getByDivision('/areas', kodeDivisi),
  getById: (kodeDivisi, kodeArea) => crudAPI.getById('/areas', `${kodeDivisi}/${kodeArea}`),
  create: data => crudAPI.create('/areas', data),
  update: (kodeDivisi, kodeArea, data) =>
    crudAPI.update('/areas', `${kodeDivisi}/${kodeArea}`, data),
  delete: (kodeDivisi, kodeArea) => crudAPI.delete('/areas', `${kodeDivisi}/${kodeArea}`),
};

export const kategoriAPI = {
  getAll: () => crudAPI.getAll('/kategori'),
  getByDivision: kodeDivisi => crudAPI.getByDivision('/kategori', kodeDivisi),
  getById: (kodeDivisi, kodeKategori) =>
    crudAPI.getById('/kategori', `${kodeDivisi}/${kodeKategori}`),
  create: data => crudAPI.create('/kategori', data),
  update: (kodeDivisi, kodeKategori, data) =>
    crudAPI.update('/kategori', `${kodeDivisi}/${kodeKategori}`, data),
  delete: (kodeDivisi, kodeKategori) =>
    crudAPI.delete('/kategori', `${kodeDivisi}/${kodeKategori}`),
};

// Master data APIs (using resource routes)
export const masterUserAPI = {
  getAll: () => crudAPI.getAll('/master-user'),
  getById: id => crudAPI.getById('/master-user', id),
  create: data => crudAPI.create('/master-user', data),
  update: (id, data) => crudAPI.update('/master-user', id, data),
  delete: id => crudAPI.delete('/master-user', id),
};

export const supplierAPI = {
  getAll: () => crudAPI.getAll('/suppliers'),
  getById: id => crudAPI.getById('/suppliers', id),
  create: data => crudAPI.create('/suppliers', data),
  update: (id, data) => crudAPI.update('/suppliers', id, data),
  delete: id => crudAPI.delete('/suppliers', id),
};

export const mcoaAPI = {
  getAll: () => crudAPI.getAll('/mcoa'),
  getById: id => crudAPI.getById('/mcoa', id),
  create: data => crudAPI.create('/mcoa', data),
  update: (id, data) => crudAPI.update('/mcoa', id, data),
  delete: id => crudAPI.delete('/mcoa', id),
};

export const mdivisiAPI = {
  getAll: () => crudAPI.getAll('/mdivisi'),
  getById: id => crudAPI.getById('/mdivisi', id),
  create: data => crudAPI.create('/mdivisi', data),
  update: (id, data) => crudAPI.update('/mdivisi', id, data),
  delete: id => crudAPI.delete('/mdivisi', id),
};

export const mdokumenAPI = {
  getAll: () => crudAPI.getAll('/mdokumen'),
  getById: id => crudAPI.getById('/mdokumen', id),
  create: data => crudAPI.create('/mdokumen', data),
  update: (id, data) => crudAPI.update('/mdokumen', id, data),
  delete: id => crudAPI.delete('/mdokumen', id),
};

export default apiClient;
