import { QueryClient } from '@tanstack/react-query';

// Create QueryClient with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data considered fresh
      staleTime: 60 * 1000, // 1 minute default

      // Cache time - how long inactive data stays in cache
      cacheTime: 5 * 60 * 1000, // 5 minutes

      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },

      // Retry delay with exponential backoff
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch settings
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,

      // Keep previous data while fetching new
      keepPreviousData: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Query key factory for consistent key generation
export const queryKeys = {
  // Master data
  customers: () => ['customers'],
  customer: id => ['customers', id],

  suppliers: () => ['suppliers'],
  supplier: id => ['suppliers', id],

  sales: () => ['sales'],
  salesperson: id => ['sales', id],

  areas: () => ['areas'],
  area: id => ['areas', id],

  categories: () => ['categories'],
  category: id => ['categories', id],

  barang: () => ['barang'],
  barangItem: id => ['barang', id],

  users: () => ['users'],
  user: id => ['users', id],

  divisions: () => ['divisions'],
  division: id => ['divisions', id],

  banks: () => ['banks'],
  bank: id => ['banks', id],

  documents: () => ['documents'],
  document: id => ['documents', id],

  companies: () => ['companies'],
  company: id => ['companies', id],

  coa: () => ['coa'],
  coaItem: id => ['coa', id],

  modules: () => ['modules'],
  module: id => ['modules', id],

  // Transaction data
  invoices: filters => ['invoices', { filters }],
  invoice: id => ['invoices', id],

  invoiceDetails: invoiceId => ['invoiceDetails', invoiceId],

  journals: filters => ['journals', { filters }],
  journalsAll: filters => ['journalsAll', { filters }],

  kartuStok: filters => ['kartuStok', { filters }],
  kartuStokAll: filters => ['kartuStokAll', { filters }],

  partPenerimaan: filters => ['partPenerimaan', { filters }],
  partPenerimaanAll: filters => ['partPenerimaanAll', { filters }],

  penerimaanFinance: filters => ['penerimaanFinance', { filters }],
  penerimaanFinanceAll: filters => ['penerimaanFinanceAll', { filters }],

  saldoBank: filters => ['saldoBank', { filters }],

  resi: filters => ['resi', { filters }],
  resiItem: (kodeDivisi, noResi) => ['resi', kodeDivisi, noResi],

  returnPurchases: filters => ['returnPurchases', { filters }],
  returnPurchase: id => ['returnPurchases', id],

  returnSales: filters => ['returnSales', { filters }],
  returnSale: id => ['returnSales', id],

  spv: () => ['spv'],
  spvItem: id => ['spv', id],

  opnames: filters => ['opnames', { filters }],
  opname: id => ['opnames', id],

  stokClaims: filters => ['stokClaims', { filters }],
  stokClaim: id => ['stokClaims', id],

  // View endpoints
  vCustRetur: filters => ['vCustRetur', { filters }],
  vReturnSalesDetail: filters => ['vReturnSalesDetail', { filters }],

  // Print/temporary
  tmpPrintInvoices: filters => ['tmpPrintInvoices', { filters }],
  tmpPrintTt: filters => ['tmpPrintTt', { filters }],
};

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate all queries for a specific resource
  customers: () => queryClient.invalidateQueries({ queryKey: queryKeys.customers() }),
  suppliers: () => queryClient.invalidateQueries({ queryKey: queryKeys.suppliers() }),
  barang: () => queryClient.invalidateQueries({ queryKey: queryKeys.barang() }),
  invoices: () => queryClient.invalidateQueries({ queryKey: queryKeys.invoices() }),
  journals: () => queryClient.invalidateQueries({ queryKey: ['journals'] }),
  kartuStok: () => queryClient.invalidateQueries({ queryKey: ['kartuStok'] }),

  // Invalidate related queries when data changes
  afterCustomerUpdate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers() });
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices() });
  },

  afterBarangUpdate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.barang() });
    queryClient.invalidateQueries({ queryKey: queryKeys.kartuStok() });
    queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDetails() });
  },

  afterInvoiceUpdate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices() });
    queryClient.invalidateQueries({ queryKey: queryKeys.invoiceDetails() });
    queryClient.invalidateQueries({ queryKey: queryKeys.journals() });
    queryClient.invalidateQueries({ queryKey: queryKeys.kartuStok() });
  },

  // Clear all caches
  all: () => queryClient.clear(),
};

// Prefetch helpers for better UX
export const prefetchQueries = {
  masterData: async () => {
    // Prefetch commonly used master data
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.customers(),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.suppliers(),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.barang(),
        staleTime: 2 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.categories(),
        staleTime: 10 * 60 * 1000,
      }),
    ]);
  },

  transactionData: async (filters = {}) => {
    // Prefetch recent transactions
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.invoices(filters),
        staleTime: 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.journals(filters),
        staleTime: 30 * 1000,
      }),
    ]);
  },
};
