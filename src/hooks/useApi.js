import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ENDPOINTS, getEndpointConfig } from '../config/endpoints';
import { queryKeys, invalidateQueries } from '../config/queryClient';

// Generic data fetching hooks
export const useApiQuery = (endpoint, params = {}, options = {}) => {
  const config = getEndpointConfig(endpoint);

  return useQuery({
    queryKey: [config.queryKey, params],
    queryFn: () => api.get(endpoint, params),
    staleTime: config.staleTime,
    ...options,
  });
};

// Master Data Hooks
export const useCustomers = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.CUSTOMERS, params, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useCustomer = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.customer(id),
    queryFn: () => api.getById(ENDPOINTS.CUSTOMERS, id, { kodeDivisi: options.kodeDivisi }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useSuppliers = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.SUPPLIERS, params, {
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useSupplier = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.supplier(id),
    queryFn: () => api.getById(ENDPOINTS.SUPPLIERS, id, { kodeDivisi: options.kodeDivisi }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useSales = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.SALES, params, {
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useSalesperson = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.salesperson(id),
    queryFn: () => api.getById(ENDPOINTS.SALES, id, { kodeDivisi: options.kodeDivisi }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useAreas = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.AREAS, params, {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useCategories = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.CATEGORIES, params, {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useBarang = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.BARANGS, params, {
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useMasterBarang = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.MASTER_BARANG, params, {
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBarangItem = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.barangItem(id),
    queryFn: () => api.getById(ENDPOINTS.BARANGS, id, { kodeDivisi: options.kodeDivisi }),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useUsers = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.USERS, params, {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useDivisions = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.DIVISIONS, params, {
    staleTime: 30 * 60 * 1000,
    ...options,
  });
};

export const useBanks = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.BANKS, params, {
    staleTime: 30 * 60 * 1000,
    ...options,
  });
};

export const useDocuments = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.DOCUMENTS, params, {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useCompanies = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.COMPANIES, params, {
    staleTime: 30 * 60 * 1000,
    ...options,
  });
};

export const useCoa = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.COA, params, {
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useModules = (params = {}, options = {}) => {
  return useApiQuery(ENDPOINTS.MODULES, params, {
    staleTime: 30 * 60 * 1000,
    ...options,
  });
};

// Transaction Data Hooks
export const useInvoices = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.invoices(params),
    queryFn: () => api.get(ENDPOINTS.INVOICES, params),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useInvoice = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.invoice(id),
    queryFn: () => api.getById(ENDPOINTS.INVOICES, id, { kodeDivisi: options.kodeDivisi }),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useInvoiceDetails = (noInvoice, params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.invoiceDetails(noInvoice),
    queryFn: () => api.getInvoiceDetails(noInvoice, params, { kodeDivisi: options.kodeDivisi }),
    enabled: !!noInvoice,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useJournals = (params = {}, all = false, options = {}) => {
  const endpoint = all ? ENDPOINTS.JOURNALS_ALL : ENDPOINTS.JOURNALS;
  const queryKey = all ? queryKeys.journalsAll(params) : queryKeys.journals(params);

  return useQuery({
    queryKey,
    queryFn: () => api.get(endpoint, params),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useKartuStok = (params = {}, all = false, options = {}) => {
  const endpoint = all ? ENDPOINTS.KARTU_STOK_ALL : ENDPOINTS.KARTU_STOK;
  const queryKey = all ? queryKeys.kartuStokAll(params) : queryKeys.kartuStok(params);

  return useQuery({
    queryKey,
    queryFn: () => api.get(endpoint, params),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const usePartPenerimaan = (params = {}, all = false, options = {}) => {
  const endpoint = all ? ENDPOINTS.PART_PENERIMAAN_ALL : ENDPOINTS.PART_PENERIMAAN;
  const queryKey = all ? queryKeys.partPenerimaanAll(params) : queryKeys.partPenerimaan(params);

  return useQuery({
    queryKey,
    queryFn: () => api.get(endpoint, params),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const usePenerimaanFinance = (params = {}, all = false, options = {}) => {
  const endpoint = all ? ENDPOINTS.PENERIMAAN_FINANCE_ALL : ENDPOINTS.PENERIMAAN_FINANCE;
  const queryKey = all
    ? queryKeys.penerimaanFinanceAll(params)
    : queryKeys.penerimaanFinance(params);

  return useQuery({
    queryKey,
    queryFn: () => api.get(endpoint, params),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useSaldoBank = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.saldoBank(params),
    queryFn: () => api.get(ENDPOINTS.SALDO_BANK, params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useResi = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.resi(params),
    queryFn: () => api.get(ENDPOINTS.RESI, params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useResiItem = (kodeDivisi, noResi, options = {}) => {
  return useQuery({
    queryKey: queryKeys.resiItem(kodeDivisi, noResi),
    queryFn: () => api.getByCompositeKey(ENDPOINTS.M_RESI, kodeDivisi, noResi),
    enabled: !!(kodeDivisi && noResi),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useReturnPurchases = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.returnPurchases(params),
    queryFn: () => api.get(ENDPOINTS.RETURN_PURCHASES, params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useReturnSales = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.returnSales(params),
    queryFn: () => api.get(ENDPOINTS.RETURN_SALES, params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useSpv = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.spv(),
    queryFn: () => api.get(ENDPOINTS.SPV, params),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useOpnames = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.opnames(params),
    queryFn: () => api.get(ENDPOINTS.OPNAMES, params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useStokClaims = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.stokClaims(params),
    queryFn: () => api.get(ENDPOINTS.STOK_CLAIMS, params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// View Hooks
export const useVCustRetur = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.vCustRetur(params),
    queryFn: () => api.get(ENDPOINTS.V_CUST_RETUR, params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useVReturnSalesDetail = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.vReturnSalesDetail(params),
    queryFn: () => api.get(ENDPOINTS.V_RETURN_SALES_DETAIL, params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// Print/Temporary Hooks
export const useTmpPrintInvoices = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.tmpPrintInvoices(params),
    queryFn: () => api.get(ENDPOINTS.TMP_PRINT_INVOICES, params),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useTmpPrintTt = (params = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.tmpPrintTt(params),
    queryFn: () => api.get(ENDPOINTS.TMP_PRINT_TT, params),
    staleTime: 30 * 1000,
    ...options,
  });
};

// Mutation Hooks
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => api.post(ENDPOINTS.CUSTOMERS, data),
    onSuccess: () => {
      invalidateQueries.afterCustomerUpdate();
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.put(ENDPOINTS.CUSTOMERS, id, data),
    onSuccess: () => {
      invalidateQueries.afterCustomerUpdate();
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: id => api.delete(ENDPOINTS.CUSTOMERS, id),
    onSuccess: () => {
      invalidateQueries.afterCustomerUpdate();
    },
  });
};

export const useCreateBarang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => api.post(ENDPOINTS.BARANGS, data),
    onSuccess: () => {
      invalidateQueries.afterBarangUpdate();
    },
  });
};

export const useUpdateBarang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.put(ENDPOINTS.BARANGS, id, data),
    onSuccess: () => {
      invalidateQueries.afterBarangUpdate();
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => api.post(ENDPOINTS.INVOICES, data),
    onSuccess: () => {
      invalidateQueries.afterInvoiceUpdate();
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.put(ENDPOINTS.INVOICES, id, data),
    onSuccess: () => {
      invalidateQueries.afterInvoiceUpdate();
    },
  });
};

// Composite key mutations for m_resi
export const useCreateResi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => api.post(ENDPOINTS.M_RESI, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resi() });
    },
  });
};

export const useUpdateResi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kodeDivisi, noResi, data }) =>
      api.updateByCompositeKey(ENDPOINTS.M_RESI, kodeDivisi, noResi, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resi() });
    },
  });
};

export const useDeleteResi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kodeDivisi, noResi }) =>
      api.deleteByCompositeKey(ENDPOINTS.M_RESI, kodeDivisi, noResi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resi() });
    },
  });
};

// Purchase mutations
export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: data => api.post(ENDPOINTS.PURCHASES, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
};
