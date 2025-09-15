// Enhanced PWA Service Worker for Mobile-First Stoir with Workbox
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSync } from 'workbox-background-sync';
import { Queue } from 'workbox-background-sync';

const CACHE_NAME = 'stoir-mobile-cache-v2';
const OFFLINE_URL = '/offline.html';

// Precache and route with workbox
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// Mobile-first cache strategies
// App Shell - Cache First for core app files
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'app-shell',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Static Assets - Cache First with fallback
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Images - Cache First with long expiration
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// API Calls - Stale While Revalidate for fresh data
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Background Sync Queues for offline operations
const salesQueue = new Queue('sales-sync', {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('Sales sync successful');
        
        // Notify clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_SUCCESS',
            operation: 'sales',
            data: entry.request.url
          });
        });
      } catch (error) {
        console.error('Sales sync failed:', error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

const stockQueue = new Queue('stock-sync', {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('Stock sync successful');
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_SUCCESS',
            operation: 'stock',
            data: entry.request.url
          });
        });
      } catch (error) {
        console.error('Stock sync failed:', error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

const purchaseQueue = new Queue('purchase-sync', {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
        console.log('Purchase sync successful');
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_SUCCESS',
            operation: 'purchase',
            data: entry.request.url
          });
        });
      } catch (error) {
        console.error('Purchase sync failed:', error);
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Enhanced mobile-first install event
self.addEventListener('install', (event) => {
  console.log('Enhanced Mobile PWA Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache essential mobile resources
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll([
          '/',
          '/offline.html',
          '/static/js/bundle.js',
          '/static/css/main.css',
          '/manifest.json',
          '/icons/icon-192x192.png',
          '/icons/icon-512x512.png'
        ]);
      }),
      // Initialize IndexedDB for mobile offline storage
      initializeOfflineDB()
    ]).then(() => {
      console.log('Mobile PWA Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Enhanced activate event with mobile features
self.addEventListener('activate', (event) => {
  console.log('Mobile PWA Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('stoir-') && cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Enable mobile features
      self.clients.claim()
    ]).then(() => {
      console.log('Mobile PWA Service Worker activated');
      
      // Notify clients about activation
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            features: ['offline-sync', 'push-notifications', 'background-fetch']
          });
        });
      });
    })
  );
});

// Enhanced mobile fetch handler with offline strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests for background sync
  if (request.method !== 'GET') {
    return handleOfflineOperations(event);
  }

  // Handle navigation requests with mobile-first approach
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Handle mobile API requests with enhanced caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleMobileApiRequest(request));
    return;
  }

  // Handle static assets with mobile optimization
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Serve from cache, update in background for mobile speed
        fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {
          // Network failed, cache is still valid
        });
        return response;
      }
      
      return fetch(request).then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Handle offline operations for mobile POST/PUT/DELETE requests
function handleOfflineOperations(event) {
  const { request } = event;
  const url = new URL(request.url);
  
  if (!url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => {
      // Queue for background sync based on operation type
      const requestData = {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        body: await request.text(),
        timestamp: Date.now()
      };

      // Determine queue based on URL pattern
      if (url.pathname.includes('/sales')) {
        await salesQueue.pushRequest({ request: new Request(request.url, requestData) });
      } else if (url.pathname.includes('/stock') || url.pathname.includes('/inventory')) {
        await stockQueue.pushRequest({ request: new Request(request.url, requestData) });
      } else if (url.pathname.includes('/purchase')) {
        await purchaseQueue.pushRequest({ request: new Request(request.url, requestData) });
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Request queued for sync when online',
          queued: true,
          operation: getOperationType(url.pathname)
        }),
        { 
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    })
  );
}

// Enhanced mobile API request handler
async function handleMobileApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses with mobile-optimized expiration
    if (response.status === 200) {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      
      // Different cache strategies for mobile
      if (url.pathname.includes('/products') || url.pathname.includes('/suppliers')) {
        // Long cache for relatively static data
        cache.put(request, responseClone);
      } else if (url.pathname.includes('/stock') || url.pathname.includes('/inventory')) {
        // Short cache for dynamic data
        cache.put(request, responseClone);
        setTimeout(() => cache.delete(request), 60000); // 1 minute
      }
    }
    
    return response;
  } catch (error) {
    console.log('Mobile API request failed, checking cache...', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator header
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Served-From', 'cache-offline');
      
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: headers
      });
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Offline - data not available in cache',
        offline: true
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Utility functions for mobile PWA
function getOperationType(pathname) {
  if (pathname.includes('/sales')) return 'sales';
  if (pathname.includes('/stock') || pathname.includes('/inventory')) return 'stock';
  if (pathname.includes('/purchase')) return 'purchase';
  return 'general';
}

// Enhanced IndexedDB initialization for mobile offline storage
async function initializeOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('stoir-mobile-offline', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Enhanced object stores for mobile features
      if (!db.objectStoreNames.contains('sales')) {
        const salesStore = db.createObjectStore('sales', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        salesStore.createIndex('timestamp', 'timestamp');
        salesStore.createIndex('customer', 'customer');
        salesStore.createIndex('status', 'status');
      }
      
      if (!db.objectStoreNames.contains('stock')) {
        const stockStore = db.createObjectStore('stock', { 
          keyPath: 'product_id' 
        });
        stockStore.createIndex('barcode', 'barcode');
        stockStore.createIndex('category', 'category');
        stockStore.createIndex('last_updated', 'last_updated');
      }
      
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { 
          keyPath: 'id' 
        });
        productStore.createIndex('barcode', 'barcode');
        productStore.createIndex('name', 'name');
        productStore.createIndex('category', 'category');
      }
      
      if (!db.objectStoreNames.contains('customers')) {
        const customerStore = db.createObjectStore('customers', { 
          keyPath: 'id' 
        });
        customerStore.createIndex('name', 'name');
        customerStore.createIndex('phone', 'phone');
      }
      
      if (!db.objectStoreNames.contains('suppliers')) {
        const supplierStore = db.createObjectStore('suppliers', { 
          keyPath: 'id' 
        });
        supplierStore.createIndex('name', 'name');
        supplierStore.createIndex('category', 'category');
      }
      
      if (!db.objectStoreNames.contains('pending_uploads')) {
        const uploadStore = db.createObjectStore('pending_uploads', { 
          keyPath: 'id',
          autoIncrement: true 
        });
        uploadStore.createIndex('type', 'type');
        uploadStore.createIndex('timestamp', 'timestamp');
      }
    };
  });
}

// Enhanced push notification handling for mobile
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200, 100, 200],
    data: data.data,
    tag: data.tag || 'stoir-notification',
    renotify: true,
    requireInteraction: data.urgent || false,
    actions: data.actions || [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };
  
  // Add mobile-specific options
  if (data.image) {
    options.image = data.image;
  }
  
  if (data.silent) {
    options.silent = true;
    options.vibrate = [];
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Enhanced notification click handling for mobile navigation
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event.notification;
  let url = '/';
  
  if (action === 'dismiss') {
    return; // Just close the notification
  }
  
  // Handle different notification types for mobile
  if (data && data.type) {
    switch (data.type) {
      case 'stock_low':
        url = `/stock?product=${data.productId}`;
        break;
      case 'sales_completed':
        url = `/sales?invoice=${data.invoiceId}`;
        break;
      case 'purchase_received':
        url = `/purchase/receiving?po=${data.poId}`;
        break;
      case 'barcode_scan_result':
        url = `/products?barcode=${data.barcode}`;
        break;
      case 'sync_completed':
        url = `/dashboard?sync=completed`;
        break;
      default:
        url = '/dashboard';
    }
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Enhanced message handling for mobile PWA features
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_STOCK_DATA':
      cacheStockData(data);
      break;
      
    case 'CACHE_PRODUCT_DATA':
      cacheProductData(data);
      break;
      
    case 'CACHE_CUSTOMER_DATA':
      cacheCustomerData(data);
      break;
      
    case 'CACHE_SALES_DATA':
      cacheSalesData(data);
      break;
      
    case 'GET_CACHED_DATA':
      getCachedData(data.type, data.query)
        .then(cachedData => {
          event.ports[0].postMessage({ 
            success: true, 
            data: cachedData 
          });
        });
      break;
      
    case 'BARCODE_SCAN':
      handleBarcodeSearch(data.barcode)
        .then(result => {
          event.ports[0].postMessage({
            success: true,
            data: result
          });
        });
      break;
      
    case 'SYNC_STATUS':
      getBackgroundSyncStatus()
        .then(status => {
          event.ports[0].postMessage({
            success: true,
            data: status
          });
        });
      break;
      
    case 'CLEAR_CACHE':
      clearSpecificCache(data.cacheType)
        .then(() => {
          event.ports[0].postMessage({
            success: true,
            message: 'Cache cleared successfully'
          });
        });
      break;
      
    case 'OFFLINE_SALES_ENTRY':
      saveOfflineSalesEntry(data)
        .then(() => {
          event.ports[0].postMessage({
            success: true,
            message: 'Sales entry saved offline'
          });
        });
      break;
  }
});

// Enhanced caching functions for mobile data
async function cacheStockData(stockData) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction(['stock'], 'readwrite');
    const store = transaction.objectStore('stock');
    
    if (Array.isArray(stockData)) {
      for (const item of stockData) {
        item.last_updated = Date.now();
        store.put(item);
      }
    } else {
      stockData.last_updated = Date.now();
      store.put(stockData);
    }
  } catch (error) {
    console.error('Failed to cache stock data:', error);
  }
}

async function cacheProductData(products) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction(['products'], 'readwrite');
    const store = transaction.objectStore('products');
    
    if (Array.isArray(products)) {
      for (const product of products) {
        store.put(product);
      }
    } else {
      store.put(products);
    }
  } catch (error) {
    console.error('Failed to cache product data:', error);
  }
}

async function cacheCustomerData(customers) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction(['customers'], 'readwrite');
    const store = transaction.objectStore('customers');
    
    if (Array.isArray(customers)) {
      for (const customer of customers) {
        store.put(customer);
      }
    } else {
      store.put(customers);
    }
  } catch (error) {
    console.error('Failed to cache customer data:', error);
  }
}

async function cacheSalesData(salesData) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction(['sales'], 'readwrite');
    const store = transaction.objectStore('sales');
    
    if (Array.isArray(salesData)) {
      for (const sale of salesData) {
        sale.timestamp = Date.now();
        store.put(sale);
      }
    } else {
      salesData.timestamp = Date.now();
      store.put(salesData);
    }
  } catch (error) {
    console.error('Failed to cache sales data:', error);
  }
}

// Enhanced data retrieval with mobile-specific queries
async function getCachedData(type, query = {}) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction([type], 'readonly');
    const store = transaction.objectStore(type);
    
    if (query.barcode && type === 'products') {
      const index = store.index('barcode');
      return await index.get(query.barcode);
    }
    
    if (query.category && (type === 'products' || type === 'suppliers')) {
      const index = store.index('category');
      return await index.getAll(query.category);
    }
    
    if (query.limit) {
      const allItems = await store.getAll();
      return allItems.slice(0, query.limit);
    }
    
    return await store.getAll();
  } catch (error) {
    console.error('Failed to get cached data:', error);
    return [];
  }
}

// Mobile-specific barcode search
async function handleBarcodeSearch(barcode) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction(['products', 'stock'], 'readonly');
    
    const productStore = transaction.objectStore('products');
    const stockStore = transaction.objectStore('stock');
    
    const productIndex = productStore.index('barcode');
    const product = await productIndex.get(barcode);
    
    if (product) {
      const stock = await stockStore.get(product.id);
      return {
        product,
        stock: stock || { quantity: 0, last_updated: null }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Barcode search failed:', error);
    return null;
  }
}

// Background sync status for mobile dashboard
async function getBackgroundSyncStatus() {
  try {
    return {
      salesQueue: await salesQueue.size(),
      stockQueue: await stockQueue.size(),
      purchaseQueue: await purchaseQueue.size(),
      lastSync: localStorage.getItem('lastSyncTime') || null
    };
  } catch (error) {
    console.error('Failed to get sync status:', error);
    return {
      salesQueue: 0,
      stockQueue: 0,
      purchaseQueue: 0,
      lastSync: null
    };
  }
}

// Clear specific cache for mobile storage management
async function clearSpecificCache(cacheType) {
  try {
    if (cacheType === 'all') {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    } else {
      await caches.delete(cacheType);
    }
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

// Save offline sales entry for mobile use
async function saveOfflineSalesEntry(salesData) {
  try {
    const db = await initializeOfflineDB();
    const transaction = db.transaction(['sales'], 'readwrite');
    const store = transaction.objectStore('sales');
    
    salesData.timestamp = Date.now();
    salesData.status = 'offline';
    salesData.sync_pending = true;
    
    const result = await store.add(salesData);
    
    // Queue for sync when online
    if (navigator.onLine) {
      await salesQueue.pushRequest({
        request: new Request('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(salesData)
        })
      });
    }
    
    return result;
  } catch (error) {
    console.error('Failed to save offline sales entry:', error);
    throw error;
  }
}
