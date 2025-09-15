/**
 * API Response Handler - Unified response parser dan error handler
 * untuk semua MasterData components
 */

// Safe array converter dengan fallback
export const ensureArray = data => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    // Jika object memiliki property data yang array
    if (Array.isArray(data.data)) return data.data;
    // Jika object memiliki property items yang array
    if (Array.isArray(data.items)) return data.items;
    // Jika object memiliki property results yang array
    if (Array.isArray(data.results)) return data.results;
    // Jika object, convert ke array dengan single item
    return [data];
  }
  // Fallback ke empty array
  return [];
};

// Unique key generator untuk React lists
export const generateUniqueKey = (item, index, prefix = 'item') => {
  // Priority: id > ID > index dengan timestamp
  if (item?.id) return `${prefix}-${item.id}`;
  if (item?.ID) return `${prefix}-${item.ID}`;
  if (item?.uuid) return `${prefix}-${item.uuid}`;
  return `${prefix}-${index}-${Date.now()}`;
};

// Safe object property accessor
export const safeGet = (obj, path, defaultValue = '') => {
  if (!obj || typeof obj !== 'object') return defaultValue;

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined && result !== null ? result : defaultValue;
};

// API Response standardizer
export const standardizeApiResponse = response => {
  try {
    // Jika response sudah dalam format yang benar
    if (response?.data) {
      return {
        success: true,
        data: ensureArray(response.data),
        message: response.message || 'Success',
        total: response.total || response.data?.length || 0,
      };
    }

    // Jika response langsung array
    if (Array.isArray(response)) {
      return {
        success: true,
        data: response,
        message: 'Success',
        total: response.length,
      };
    }

    // Jika response object tapi bukan format standard
    if (response && typeof response === 'object') {
      return {
        success: true,
        data: ensureArray(response),
        message: 'Success',
        total: ensureArray(response).length,
      };
    }

    // Fallback untuk response kosong/undefined
    return {
      success: false,
      data: [],
      message: 'No data received',
      total: 0,
    };
  } catch (error) {
    console.error('Error standardizing API response:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Unknown error',
      total: 0,
    };
  }
};

// Error boundary handler untuk API calls
export const handleApiError = (error, componentName = 'Component') => {
  console.error(`${componentName} API Error:`, error);

  // Network errors
  if (!error.response) {
    return {
      success: false,
      data: [],
      message: 'Network error - Periksa koneksi internet',
      error: 'NETWORK_ERROR',
    };
  }

  // HTTP errors
  const status = error.response?.status;
  const message = error.response?.data?.message || error.message;

  switch (status) {
    case 400:
      return {
        success: false,
        data: [],
        message: `Bad Request: ${message}`,
        error: 'BAD_REQUEST',
      };
    case 401:
      return {
        success: false,
        data: [],
        message: 'Unauthorized - Silakan login ulang',
        error: 'UNAUTHORIZED',
      };
    case 403:
      return {
        success: false,
        data: [],
        message: 'Forbidden - Tidak memiliki akses',
        error: 'FORBIDDEN',
      };
    case 404:
      return {
        success: false,
        data: [],
        message: 'Data tidak ditemukan',
        error: 'NOT_FOUND',
      };
    case 500:
      return {
        success: false,
        data: [],
        message: 'Server error - Coba lagi nanti',
        error: 'SERVER_ERROR',
      };
    default:
      return {
        success: false,
        data: [],
        message: message || 'Unknown error occurred',
        error: 'UNKNOWN_ERROR',
      };
  }
};

// Loading state manager
export const createLoadingState = () => ({
  loading: false,
  error: null,
  data: [],
  total: 0,
});

// Safe search filter
export const safeFilter = (data, searchTerm, searchFields = []) => {
  if (!Array.isArray(data) || !searchTerm) return data;

  const term = searchTerm.toLowerCase().trim();
  if (!term) return data;

  return data.filter(item => {
    if (!item || typeof item !== 'object') return false;

    // Jika searchFields diberikan, search di field tersebut
    if (searchFields.length > 0) {
      return searchFields.some(field => {
        const value = safeGet(item, field, '');
        return String(value).toLowerCase().includes(term);
      });
    }

    // Jika tidak ada searchFields, search di semua string values
    return Object.values(item).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      if (typeof value === 'number') {
        return String(value).includes(term);
      }
      return false;
    });
  });
};

// Pagination helper
export const safePaginate = (data, page = 1, pageSize = 10) => {
  if (!Array.isArray(data)) return { data: [], total: 0, page: 1, pageSize };

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    page: Math.max(1, page),
    pageSize: Math.max(1, pageSize),
    totalPages: Math.ceil(data.length / pageSize),
  };
};

export default {
  ensureArray,
  generateUniqueKey,
  safeGet,
  standardizeApiResponse,
  handleApiError,
  createLoadingState,
  safeFilter,
  safePaginate,
};
