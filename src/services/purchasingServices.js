// API services for purchasing system
import apiClient from './apiClient';

// Base purchasing API
export const purchasingAPI = {
  // Get notification counts for badges
  getNotificationCounts: () => apiClient.get('/purchasing/notifications'),

  // Get dashboard stats
  getDashboardStats: () => apiClient.get('/purchasing/dashboard/stats'),

  // Health check for PWA
  healthCheck: () => apiClient.head('/health'),

  // Export reports
  exportReport: (type, filters) => apiClient.get(`/purchasing/export/${type}`, { params: filters }),
};

// Purchase Requests API
export const purchaseRequestsAPI = {
  // Get all purchase requests
  getAll: (filters = {}) => apiClient.get('/purchase-requests', { params: filters }),

  // Get single request
  getById: id => apiClient.get(`/purchase-requests/${id}`),

  // Create new request
  create: data => apiClient.post('/purchase-requests', data),

  // Update request
  update: (id, data) => apiClient.put(`/purchase-requests/${id}`, data),

  // Delete request
  delete: id => apiClient.delete(`/purchase-requests/${id}`),

  // Submit for approval
  submit: id => apiClient.post(`/purchase-requests/${id}/submit`),

  // Approve request
  approve: (id, data) => apiClient.post(`/purchase-requests/${id}/approve`, data),

  // Reject request
  reject: (id, data) => apiClient.post(`/purchase-requests/${id}/reject`, data),

  // Get approval history
  getApprovalHistory: id => apiClient.get(`/purchase-requests/${id}/approvals`),

  // Get AI recommendations
  getAIRecommendations: data => apiClient.post('/purchase-requests/ai-recommendations', data),

  // Check budget impact
  checkBudgetImpact: data => apiClient.post('/purchase-requests/budget-impact', data),

  // Get reorder suggestions
  getReorderSuggestions: () => apiClient.get('/purchase-requests/reorder-suggestions'),
};

// Purchase Orders API
export const purchaseOrdersAPI = {
  // Get all purchase orders
  getAll: (filters = {}) => apiClient.get('/purchase-orders', { params: filters }),

  // Get single order
  getById: id => apiClient.get(`/purchase-orders/${id}`),

  // Create new order
  create: data => apiClient.post('/purchase-orders', data),

  // Update order
  update: (id, data) => apiClient.put(`/purchase-orders/${id}`, data),

  // Delete order
  delete: id => apiClient.delete(`/purchase-orders/${id}`),

  // Send to supplier
  send: id => apiClient.post(`/purchase-orders/${id}/send`),

  // Cancel order
  cancel: (id, reason) => apiClient.post(`/purchase-orders/${id}/cancel`, { reason }),

  // Get workflow status
  getWorkflowStatus: id => apiClient.get(`/purchase-orders/${id}/workflow`),

  // Update workflow status
  updateWorkflowStatus: (id, status, data) =>
    apiClient.post(`/purchase-orders/${id}/workflow/${status}`, data),

  // Bulk operations
  bulkApprove: (ids, data) => apiClient.post('/purchase-orders/bulk/approve', { ids, ...data }),
  bulkReject: (ids, data) => apiClient.post('/purchase-orders/bulk/reject', { ids, ...data }),
  bulkCancel: (ids, data) => apiClient.post('/purchase-orders/bulk/cancel', { ids, ...data }),

  // Get order timeline
  getTimeline: id => apiClient.get(`/purchase-orders/${id}/timeline`),

  // Generate PDF
  generatePDF: id => apiClient.get(`/purchase-orders/${id}/pdf`, { responseType: 'blob' }),

  // Three-way matching
  performThreeWayMatching: (id, data) =>
    apiClient.post(`/purchase-orders/${id}/three-way-match`, data),
};

// Goods Receiving API
export const goodsReceivingAPI = {
  // Get all receipts
  getAll: (filters = {}) => apiClient.get('/goods-receiving', { params: filters }),

  // Get single receipt
  getById: id => apiClient.get(`/goods-receiving/${id}`),

  // Create new receipt
  create: data => apiClient.post('/goods-receiving', data),

  // Update receipt
  update: (id, data) => apiClient.put(`/goods-receiving/${id}`, data),

  // Complete receiving
  complete: (id, data) => apiClient.post(`/goods-receiving/${id}/complete`, data),

  // Get pending receipts
  getPending: () => apiClient.get('/goods-receiving/pending'),

  // Scan barcode
  scanBarcode: barcode => apiClient.get(`/goods-receiving/scan/${barcode}`),

  // Quality inspection
  recordInspection: (id, data) => apiClient.post(`/goods-receiving/${id}/inspection`, data),

  // Upload photos
  uploadPhotos: (id, photos) => {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });
    return apiClient.post(`/goods-receiving/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Report discrepancy
  reportDiscrepancy: (id, data) => apiClient.post(`/goods-receiving/${id}/discrepancy`, data),

  // Get quality templates
  getQualityTemplates: () => apiClient.get('/goods-receiving/quality-templates'),

  // Three-way matching validation
  validateThreeWayMatch: data => apiClient.post('/goods-receiving/validate-match', data),
};

// Suppliers API
export const suppliersAPI = {
  // Get all suppliers
  getAll: (filters = {}) => apiClient.get('/suppliers', { params: filters }),

  // Get single supplier
  getById: id => apiClient.get(`/suppliers/${id}`),

  // Create new supplier
  create: data => apiClient.post('/suppliers', data),

  // Update supplier
  update: (id, data) => apiClient.put(`/suppliers/${id}`, data),

  // Delete supplier
  delete: id => apiClient.delete(`/suppliers/${id}`),

  // Get supplier performance
  getPerformance: (id, timeframe = '6months') =>
    apiClient.get(`/suppliers/${id}/performance`, { params: { timeframe } }),

  // Search suppliers
  search: query => apiClient.get('/suppliers/search', { params: { q: query } }),

  // Get supplier categories
  getCategories: () => apiClient.get('/suppliers/categories'),

  // Update supplier category
  updateCategory: (id, category) => apiClient.put(`/suppliers/${id}/category`, { category }),

  // Get price history
  getPriceHistory: (supplierId, productId, timeframe = '1year') =>
    apiClient.get(`/suppliers/${supplierId}/price-history/${productId}`, {
      params: { timeframe },
    }),

  // Compare suppliers
  compare: supplierIds => apiClient.post('/suppliers/compare', { supplier_ids: supplierIds }),

  // Get market analysis
  getMarketAnalysis: productId => apiClient.get(`/suppliers/market-analysis/${productId}`),
};

// Performance & Analytics API
export const performanceAPI = {
  // Get supplier performance data
  getSupplierPerformance: (timeframe = '6months') =>
    apiClient.get('/analytics/supplier-performance', { params: { timeframe } }),

  // Update supplier evaluation
  updateSupplierEvaluation: (supplierId, evaluation) =>
    apiClient.post(`/suppliers/${supplierId}/evaluation`, evaluation),

  // Get KPI data
  getKPIs: (timeframe = '6months') => apiClient.get('/analytics/kpis', { params: { timeframe } }),

  // Get trend data
  getTrends: (metric, timeframe = '1year') =>
    apiClient.get('/analytics/trends', { params: { metric, timeframe } }),

  // Get cost savings analysis
  getCostSavings: (timeframe = '1year') =>
    apiClient.get('/analytics/cost-savings', { params: { timeframe } }),

  // Get efficiency metrics
  getEfficiencyMetrics: (timeframe = '6months') =>
    apiClient.get('/analytics/efficiency', { params: { timeframe } }),
};

// Analytics & Reporting API
export const analyticsAPI = {
  // Dashboard statistics
  getSupplierDashboardStats: () => apiClient.get('/analytics/supplier-dashboard'),
  getPurchasingDashboardStats: () => apiClient.get('/analytics/purchasing-dashboard'),

  // Trend analysis
  getSupplierTrends: (timeframe = '6months') =>
    apiClient.get('/analytics/supplier-trends', { params: { timeframe } }),
  getPurchasingTrends: (timeframe = '6months') =>
    apiClient.get('/analytics/purchasing-trends', { params: { timeframe } }),

  // Export functions
  exportSupplierReport: (filters = {}) =>
    apiClient.get('/analytics/export/suppliers', {
      params: filters,
      responseType: 'blob',
    }),
  exportPurchasingReport: (filters = {}) =>
    apiClient.get('/analytics/export/purchasing', {
      params: filters,
      responseType: 'blob',
    }),

  // Predictive analytics
  getPredictiveAnalysis: (type, data) => apiClient.post(`/analytics/predictive/${type}`, data),

  // Custom reports
  generateCustomReport: config => apiClient.post('/analytics/custom-report', config),
};

// Products API
export const productsAPI = {
  // Get all products
  getAll: (filters = {}) => apiClient.get('/products', { params: filters }),

  // Get single product
  getById: id => apiClient.get(`/products/${id}`),

  // Search products
  search: query => apiClient.get('/products/search', { params: { q: query } }),

  // Get categories
  getCategories: () => apiClient.get('/products/categories'),

  // Get product pricing
  getPricing: (id, supplierId) =>
    apiClient.get(`/products/${id}/pricing`, { params: { supplier_id: supplierId } }),

  // Get stock levels
  getStockLevels: id => apiClient.get(`/products/${id}/stock`),

  // Get reorder points
  getReorderPoints: () => apiClient.get('/products/reorder-points'),
};

// Approval Workflow API
export const approvalWorkflowAPI = {
  // Get workflow configuration
  getWorkflowConfig: type => apiClient.get(`/workflow/config/${type}`),

  // Get approval matrix
  getApprovalMatrix: (amount, category) =>
    apiClient.get('/workflow/approval-matrix', {
      params: { amount, category },
    }),

  // Get pending approvals
  getPendingApprovals: userId =>
    apiClient.get('/workflow/pending-approvals', { params: { user_id: userId } }),

  // Process approval
  processApproval: (workflowId, action, data) =>
    apiClient.post(`/workflow/${workflowId}/action/${action}`, data),

  // Get approval history
  getApprovalHistory: (entityType, entityId) =>
    apiClient.get(`/workflow/history/${entityType}/${entityId}`),

  // Delegate approval
  delegateApproval: (workflowId, userId, data) =>
    apiClient.post(`/workflow/${workflowId}/delegate/${userId}`, data),
};

// Budget API
export const budgetAPI = {
  // Get budget data
  getBudget: (department, category, period) =>
    apiClient.get('/budget', {
      params: { department, category, period },
    }),

  // Check budget availability
  checkAvailability: data => apiClient.post('/budget/check-availability', data),

  // Reserve budget
  reserveBudget: data => apiClient.post('/budget/reserve', data),

  // Release budget
  releaseBudget: reservationId => apiClient.delete(`/budget/reserve/${reservationId}`),

  // Get budget utilization
  getUtilization: (filters = {}) => apiClient.get('/budget/utilization', { params: filters }),
};

// Notifications API
export const notificationsAPI = {
  // Get notifications
  getAll: (filters = {}) => apiClient.get('/notifications', { params: filters }),

  // Mark as read
  markAsRead: id => apiClient.put(`/notifications/${id}/read`),

  // Mark all as read
  markAllAsRead: () => apiClient.put('/notifications/read-all'),

  // Get unread count
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),

  // Subscribe to push notifications
  subscribeToPush: subscription => apiClient.post('/notifications/push/subscribe', subscription),

  // Unsubscribe from push notifications
  unsubscribeFromPush: subscription =>
    apiClient.post('/notifications/push/unsubscribe', subscription),
};

// Configuration API
export const configAPI = {
  // Get purchasing configuration
  getPurchasingConfig: () => apiClient.get('/config/purchasing'),

  // Update purchasing configuration
  updatePurchasingConfig: config => apiClient.put('/config/purchasing', config),

  // Get approval limits
  getApprovalLimits: () => apiClient.get('/config/approval-limits'),

  // Update approval limits
  updateApprovalLimits: limits => apiClient.put('/config/approval-limits', limits),

  // Get user permissions
  getUserPermissions: userId => apiClient.get(`/config/permissions/${userId}`),

  // Update user permissions
  updateUserPermissions: (userId, permissions) =>
    apiClient.put(`/config/permissions/${userId}`, permissions),
};

// Audit API
export const auditAPI = {
  // Get audit trail
  getAuditTrail: (filters = {}) => apiClient.get('/audit', { params: filters }),

  // Get audit details
  getAuditDetails: id => apiClient.get(`/audit/${id}`),

  // Export audit report
  exportAuditReport: (filters = {}) =>
    apiClient.get('/audit/export', {
      params: filters,
      responseType: 'blob',
    }),
};

// Integration API
export const integrationAPI = {
  // ERP integration
  syncWithERP: data => apiClient.post('/integration/erp/sync', data),

  // Accounting integration
  syncWithAccounting: data => apiClient.post('/integration/accounting/sync', data),

  // Bank integration
  getBankTransactions: (filters = {}) =>
    apiClient.get('/integration/bank/transactions', { params: filters }),

  // Email integration
  sendEmail: data => apiClient.post('/integration/email/send', data),

  // SMS integration
  sendSMS: data => apiClient.post('/integration/sms/send', data),
};

// Utility functions for offline support
export const offlineUtils = {
  // Check if request can be cached
  isCacheable: (url, method) => {
    const cacheableEndpoints = ['/suppliers', '/products', '/purchase-orders', '/goods-receiving'];

    return method === 'GET' && cacheableEndpoints.some(endpoint => url.includes(endpoint));
  },

  // Queue request for offline sync
  queueForSync: async request => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'QUEUE_REQUEST',
        data: request,
      });
    }
  },

  // Get cached data
  getCachedData: async type => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      return new Promise(resolve => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = event => {
          resolve(event.data);
        };

        navigator.serviceWorker.controller.postMessage(
          {
            type: 'GET_CACHED_DATA',
            data: { type },
          },
          [messageChannel.port2]
        );
      });
    }
    return { success: false, data: [] };
  },

  // Cache supplier data
  cacheSupplierData: suppliers => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_SUPPLIER_DATA',
        data: suppliers,
      });
    }
  },

  // Cache product data
  cacheProductData: products => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PRODUCT_DATA',
        data: products,
      });
    }
  },
};

// Export default collection
const purchasingServices = {
  purchasingAPI,
  purchaseRequestsAPI,
  purchaseOrdersAPI,
  goodsReceivingAPI,
  suppliersAPI,
  performanceAPI,
  analyticsAPI,
  productsAPI,
  approvalWorkflowAPI,
  budgetAPI,
  notificationsAPI,
  configAPI,
  auditAPI,
  integrationAPI,
  offlineUtils,
};

export default purchasingServices;
