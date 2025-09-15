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

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Create new category
  create: async (data) => {
    try {
      const response = await apiClient.post('/categories', data);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

export default categoriesAPI;
