// Frontend API Endpoint Configuration
// Complete mapping of all database tables to API endpoints
// Usage: import { ENDPOINTS } from './config/endpoints';

export const ENDPOINTS = {
  // Master Data Endpoints
  CUSTOMERS: '/customers',
  SUPPLIERS: '/suppliers',
  MASTER_SUPPLIERS: '/master-suppliers',
  SALES: '/sales',
  AREAS: '/areas',
  CATEGORIES: '/kategoris',
  CATEGORIES_ALT: '/categories',
  BARANG: '/barang',
  BARANGS: '/barangs',
  MASTER_BARANG: '/master-barang',
  USERS: '/users',
  MASTER_USERS: '/master-users',
  DIVISIONS: '/divisis',
  DIVISIONS_ALT: '/divisions',
  BANKS: '/banks',
  DOCUMENTS: '/dokumens',
  DOCUMENTS_ALT: '/documents',
  COMPANIES: '/companies',
  COA: '/coas',
  MODULES: '/user-modules',
  MODULES_ALT: '/modules',

  // Transaction Endpoints
  INVOICES: '/invoices',
  INVOICE_DETAILS: '/invoice-details',
  JOURNALS: '/journals',
  JOURNALS_ALL: '/journals/all',
  KARTU_STOK: '/kartu-stok',
  KARTU_STOK_ALL: '/kartu-stok/all',
  PART_PENERIMAAN: '/part-penerimaan',
  PART_PENERIMAAN_ALL: '/part-penerimaan/all',
  PENERIMAAN_FINANCE: '/penerimaan-finance',
  PENERIMAAN_FINANCE_ALL: '/penerimaan-finance/all',
  SALDO_BANK: '/saldo-bank',
  RESI: '/resi',
  M_RESI: '/m-resi',

  // Return/Retur Endpoints
  RETURN_PURCHASES: '/return-purchases',
  RETURN_SALES: '/return-sales',
  PURCHASES: '/purchases',

  // Print/Temporary Endpoints
  TMP_PRINT_INVOICES: '/tmp-print-invoices',
  TMP_PRINT_TT: '/tmp-print-tt',

  // Administrative Endpoints
  SPV: '/spv',
  OPNAMES: '/opnames',
  STOK_CLAIMS: '/stok-claims',

  // View Endpoints (Custom)
  V_CUST_RETUR: '/v-cust-retur',
  V_RETURN_SALES_DETAIL: '/v-return-sales-detail',
};

// Endpoint Metadata for React Query
export const ENDPOINT_CONFIG = {
  [ENDPOINTS.CUSTOMERS]: {
    queryKey: 'customers',
    staleTime: 5 * 60 * 1000, // 5 minutes
    description: 'Customer master data',
  },
  [ENDPOINTS.SUPPLIERS]: {
    queryKey: 'suppliers',
    staleTime: 5 * 60 * 1000,
    description: 'Supplier master data',
  },
  [ENDPOINTS.SALES]: {
    queryKey: 'sales',
    staleTime: 5 * 60 * 1000,
    description: 'Sales person data',
  },
  [ENDPOINTS.AREAS]: {
    queryKey: 'areas',
    staleTime: 10 * 60 * 1000,
    description: 'Area/region master data',
  },
  [ENDPOINTS.CATEGORIES]: {
    queryKey: 'categories',
    staleTime: 10 * 60 * 1000,
    description: 'Product categories',
  },
  [ENDPOINTS.BARANGS]: {
    queryKey: 'barang',
    staleTime: 2 * 60 * 1000,
    description: 'Product/item master data',
  },
  [ENDPOINTS.USERS]: {
    queryKey: 'users',
    staleTime: 10 * 60 * 1000,
    description: 'System users',
  },
  [ENDPOINTS.DIVISIONS]: {
    queryKey: 'divisions',
    staleTime: 30 * 60 * 1000,
    description: 'Company divisions',
  },
  [ENDPOINTS.BANKS]: {
    queryKey: 'banks',
    staleTime: 30 * 60 * 1000,
    description: 'Bank information',
  },
  [ENDPOINTS.DOCUMENTS]: {
    queryKey: 'documents',
    staleTime: 10 * 60 * 1000,
    description: 'Document types',
  },
  [ENDPOINTS.COMPANIES]: {
    queryKey: 'companies',
    staleTime: 30 * 60 * 1000,
    description: 'Company information',
  },
  [ENDPOINTS.INVOICES]: {
    queryKey: 'invoices',
    staleTime: 1 * 60 * 1000,
    description: 'Sales invoices',
  },
  [ENDPOINTS.INVOICE_DETAILS]: {
    queryKey: 'invoiceDetails',
    staleTime: 1 * 60 * 1000,
    description: 'Invoice line items',
  },
  [ENDPOINTS.JOURNALS]: {
    queryKey: 'journals',
    staleTime: 30 * 1000,
    description: 'Journal entries (limited)',
  },
  [ENDPOINTS.JOURNALS_ALL]: {
    queryKey: 'journalsAll',
    staleTime: 30 * 1000,
    description: 'All journal entries',
  },
  [ENDPOINTS.KARTU_STOK]: {
    queryKey: 'kartuStok',
    staleTime: 30 * 1000,
    description: 'Stock movement cards (limited)',
  },
  [ENDPOINTS.KARTU_STOK_ALL]: {
    queryKey: 'kartuStokAll',
    staleTime: 30 * 1000,
    description: 'All stock movements',
  },
  [ENDPOINTS.PART_PENERIMAAN]: {
    queryKey: 'partPenerimaan',
    staleTime: 1 * 60 * 1000,
    description: 'Part receiving transactions',
  },
  [ENDPOINTS.PENERIMAAN_FINANCE]: {
    queryKey: 'penerimaanFinance',
    staleTime: 1 * 60 * 1000,
    description: 'Finance receipts',
  },
  [ENDPOINTS.SALDO_BANK]: {
    queryKey: 'saldoBank',
    staleTime: 2 * 60 * 1000,
    description: 'Bank balances',
  },
  [ENDPOINTS.RESI]: {
    queryKey: 'resi',
    staleTime: 5 * 60 * 1000,
    description: 'Receipt/resi management',
  },
  [ENDPOINTS.RETURN_PURCHASES]: {
    queryKey: 'returnPurchases',
    staleTime: 2 * 60 * 1000,
    description: 'Purchase returns',
  },
  [ENDPOINTS.RETURN_SALES]: {
    queryKey: 'returnSales',
    staleTime: 2 * 60 * 1000,
    description: 'Sales returns',
  },
  [ENDPOINTS.SPV]: {
    queryKey: 'spv',
    staleTime: 10 * 60 * 1000,
    description: 'SPV documents',
  },
  [ENDPOINTS.OPNAMES]: {
    queryKey: 'opnames',
    staleTime: 5 * 60 * 1000,
    description: 'Stock opname results',
  },
};

// Helper function to get endpoint config
export const getEndpointConfig = endpoint => {
  return (
    ENDPOINT_CONFIG[endpoint] || {
      queryKey: endpoint.replace('/', ''),
      staleTime: 60 * 1000,
      description: 'API endpoint',
    }
  );
};

// High-frequency vs Low-frequency categorization
export const HIGH_FREQUENCY_ENDPOINTS = [
  ENDPOINTS.INVOICES,
  ENDPOINTS.JOURNALS,
  ENDPOINTS.KARTU_STOK,
  ENDPOINTS.BARANGS,
];

export const LOW_FREQUENCY_ENDPOINTS = [
  ENDPOINTS.DIVISIONS,
  ENDPOINTS.BANKS,
  ENDPOINTS.COMPANIES,
  ENDPOINTS.AREAS,
  ENDPOINTS.CATEGORIES,
];
