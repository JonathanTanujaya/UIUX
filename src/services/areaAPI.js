import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  error => {
    console.error('API Error:', error);
    throw error;
  }
);

// Area API
export const areaAPI = {
  // Get all areas
  getAll: async () => {
    try {
      const response = await apiClient.get('/areas');
      return response;
    } catch (error) {
      console.error('Error fetching areas:', error);
      throw error;
    }
  },

  // Get area by ID
  getById: async (kodeDivisi, kodeArea) => {
    try {
      const response = await apiClient.get(`/areas/${kodeDivisi}/${kodeArea}`);
      return response;
    } catch (error) {
      console.error('Error fetching area:', error);
      throw error;
    }
  },

  // Create new area
  create: async (data) => {
    try {
      const response = await apiClient.post('/areas', data);
      return response;
    } catch (error) {
      console.error('Error creating area:', error);
      throw error;
    }
  },

  // Update area
  update: async (kodeDivisi, kodeArea, data) => {
    try {
      const response = await apiClient.put(`/areas/${kodeDivisi}/${kodeArea}`, data);
      return response;
    } catch (error) {
      console.error('Error updating area:', error);
      throw error;
    }
  },

  // Delete area
  delete: async (kodeDivisi, kodeArea) => {
    try {
      const response = await apiClient.delete(`/areas/${kodeDivisi}/${kodeArea}`);
      return response;
    } catch (error) {
      console.error('Error deleting area:', error);
      throw error;
    }
  }
};

export default areaAPI;
