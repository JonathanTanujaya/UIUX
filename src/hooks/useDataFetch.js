import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook untuk data fetching dengan loading, error handling, dan refresh
 * @param {Function} fetchFunction - Function yang mengembalikan promise untuk fetch data
 * @param {Array} dependencies - Dependencies untuk trigger ulang fetch
 * @param {Object} options - Options untuk konfigurasi
 */
export const useDataFetch = (fetchFunction, dependencies = [], options = {}) => {
  const {
    showSuccessToast = false,
    successMessage = 'Data berhasil dimuat',
    errorMessage = 'Gagal memuat data',
    initialData = [],
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();

      if (result.success) {
        const responseData = Array.isArray(result.data) ? result.data : [];
        setData(responseData);

        if (showSuccessToast) {
          toast.success(result.message || successMessage);
        }
      } else {
        setError(result.message || errorMessage);
        toast.error(result.message || errorMessage);
        setData(initialData);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || errorMessage;
      setError(errorMsg);
      toast.error(errorMsg);
      setData(initialData);
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, showSuccessToast, successMessage, errorMessage, initialData]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    setData, // For manual data updates
  };
};

/**
 * Custom hook untuk operasi CRUD dengan loading states
 */
export const useCrudOperations = (service, refreshCallback) => {
  const [loading, setLoading] = useState(false);

  const performOperation = useCallback(
    async (operation, successMessage, ...args) => {
      setLoading(true);
      try {
        const result = await operation(...args);

        if (result.success) {
          toast.success(result.message || successMessage);
          if (refreshCallback) refreshCallback();
          return { success: true, data: result.data };
        } else {
          toast.error(result.message || 'Operasi gagal');
          return { success: false, error: result.message };
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan';
        toast.error(errorMsg);
        console.error('CRUD operation error:', error);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [refreshCallback]
  );

  const create = useCallback(
    (data, successMessage = 'Data berhasil dibuat') => {
      return performOperation(service.create, successMessage, data);
    },
    [service.create, performOperation]
  );

  const update = useCallback(
    (id1, id2, data, successMessage = 'Data berhasil diperbarui') => {
      return performOperation(service.update, successMessage, id1, id2, data);
    },
    [service.update, performOperation]
  );

  const remove = useCallback(
    (id1, id2, successMessage = 'Data berhasil dihapus') => {
      return performOperation(service.delete, successMessage, id1, id2);
    },
    [service.delete, performOperation]
  );

  return {
    loading,
    create,
    update,
    remove,
  };
};

export default useDataFetch;
