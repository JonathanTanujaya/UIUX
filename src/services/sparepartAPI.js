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

// Sparepart API
export const sparepartAPI = {
  // Get all sparepart
  getAll: async (perPage = 'all') => {
    try {
      const response = await apiClient.get('/spareparts', {
        params: {
          per_page: perPage
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching sparepart:', error);
      throw error;
    }
  },

  // Get sparepart by ID  
  getById: async (kodeDivisi, kodeBarang, id) => {
    try {
      const response = await apiClient.get(`/spareparts/${kodeDivisi}/${kodeBarang}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching sparepart:', error);
      throw error;
    }
  },

  // Create new sparepart
  create: async (data) => {
    try {
      const response = await apiClient.post('/spareparts', data);
      return response;
    } catch (error) {
      console.error('Error creating sparepart:', error);
      throw error;
    }
  },

  // Update sparepart
  update: async (kodeDivisi, kodeBarang, id, data) => {
    try {
      const response = await apiClient.put(`/spareparts/${kodeDivisi}/${kodeBarang}/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating sparepart:', error);
      throw error;
    }
  },

  // Delete sparepart
  delete: async (kodeDivisi, kodeBarang, id) => {
    try {
      const response = await apiClient.delete(`/spareparts/${kodeDivisi}/${kodeBarang}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting sparepart:', error);
      throw error;
    }
  }
};

export default sparepartAPI;
