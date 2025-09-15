import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for managing PWA features and offline capabilities
export const useMobilePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    salesQueue: 0,
    stockQueue: 0,
    purchaseQueue: 0,
    lastSync: null,
  });
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [pushSupported, setPushSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  const serviceWorkerRef = useRef(null);

  // Initialize PWA features
  useEffect(() => {
    // Check if app is installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isIOSStandalone = isIOS && window.navigator.standalone;
    setIsInstalled(isStandalone || isIOSStandalone);

    // Check push notification support
    setPushSupported('serviceWorker' in navigator && 'PushManager' in window);
    setNotificationPermission(Notification.permission);

    // Register service worker
    registerServiceWorker();

    // Listen for install prompt
    const handleBeforeInstallPrompt = e => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        serviceWorkerRef.current = reg;

        // Listen for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  // Handle messages from service worker
  const handleServiceWorkerMessage = event => {
    const { type, data } = event.data;

    switch (type) {
      case 'SYNC_SUCCESS':
        console.log('Background sync successful:', data);
        updateSyncStatus();
        break;
      case 'SW_ACTIVATED':
        console.log('Service Worker activated with features:', data.features);
        break;
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data);
        break;
      default:
        console.log('Unknown message from service worker:', event.data);
    }
  };

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!installPrompt) return false;

    try {
      const result = await installPrompt.prompt();
      console.log('Install prompt result:', result);

      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }, [installPrompt]);

  // Update service worker
  const updateServiceWorker = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  }, [registration]);

  // Cache data for offline use
  const cacheData = useCallback(async (type, data) => {
    if (serviceWorkerRef.current) {
      serviceWorkerRef.current.active?.postMessage({
        type: `CACHE_${type.toUpperCase()}_DATA`,
        data,
      });
    }
  }, []);

  // Get cached data
  const getCachedData = useCallback((type, query = {}) => {
    return new Promise(resolve => {
      if (!serviceWorkerRef.current?.active) {
        resolve([]);
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = event => {
        resolve(event.data.success ? event.data.data : []);
      };

      serviceWorkerRef.current.active.postMessage(
        {
          type: 'GET_CACHED_DATA',
          data: { type, query },
        },
        [channel.port2]
      );
    });
  }, []);

  // Handle barcode scan offline
  const handleBarcodeOffline = useCallback(barcode => {
    return new Promise(resolve => {
      if (!serviceWorkerRef.current?.active) {
        resolve(null);
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = event => {
        resolve(event.data.success ? event.data.data : null);
      };

      serviceWorkerRef.current.active.postMessage(
        {
          type: 'BARCODE_SCAN',
          data: { barcode },
        },
        [channel.port2]
      );
    });
  }, []);

  // Save offline sales entry
  const saveOfflineSalesEntry = useCallback(salesData => {
    return new Promise((resolve, reject) => {
      if (!serviceWorkerRef.current?.active) {
        reject(new Error('Service worker not available'));
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = event => {
        if (event.data.success) {
          resolve(event.data);
        } else {
          reject(new Error(event.data.message || 'Failed to save offline'));
        }
      };

      serviceWorkerRef.current.active.postMessage(
        {
          type: 'OFFLINE_SALES_ENTRY',
          data: salesData,
        },
        [channel.port2]
      );
    });
  }, []);

  // Update sync status
  const updateSyncStatus = useCallback(async () => {
    if (!serviceWorkerRef.current?.active) return;

    const channel = new MessageChannel();
    channel.port1.onmessage = event => {
      if (event.data.success) {
        setSyncStatus(event.data.data);
      }
    };

    serviceWorkerRef.current.active.postMessage(
      {
        type: 'SYNC_STATUS',
      },
      [channel.port2]
    );
  }, []);

  // Clear cache
  const clearCache = useCallback((cacheType = 'all') => {
    return new Promise(resolve => {
      if (!serviceWorkerRef.current?.active) {
        resolve();
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = event => {
        resolve(event.data.success);
      };

      serviceWorkerRef.current.active.postMessage(
        {
          type: 'CLEAR_CACHE',
          data: { cacheType },
        },
        [channel.port2]
      );
    });
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPushNotifications = useCallback(async () => {
    if (!pushSupported || !registration) {
      console.log('Push notifications not supported');
      return null;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'your-vapid-public-key', // Replace with your VAPID key
      });

      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }, [pushSupported, registration]);

  // Share content using Web Share API
  const shareContent = useCallback(async data => {
    if (!navigator.share) {
      console.log('Web Share API not supported');
      return false;
    }

    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }, []);

  // Show native mobile notifications
  const showNotification = useCallback(
    async (title, options = {}) => {
      if (notificationPermission !== 'granted') {
        const granted = await requestNotificationPermission();
        if (!granted) return false;
      }

      try {
        if (registration) {
          // Use service worker notification for better mobile support
          await registration.showNotification(title, {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: [200, 100, 200],
            ...options,
          });
        } else {
          // Fallback to regular notification
          new Notification(title, {
            icon: '/icons/icon-192x192.png',
            ...options,
          });
        }
        return true;
      } catch (error) {
        console.error('Notification failed:', error);
        return false;
      }
    },
    [notificationPermission, registration, requestNotificationPermission]
  );

  // Check for updates periodically
  useEffect(() => {
    const checkForUpdates = () => {
      if (registration) {
        registration.update();
      }
    };

    // Check for updates every 5 minutes when online
    const interval = setInterval(
      () => {
        if (isOnline) {
          checkForUpdates();
        }
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [registration, isOnline]);

  // Update sync status periodically
  useEffect(() => {
    updateSyncStatus();

    const interval = setInterval(updateSyncStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [updateSyncStatus]);

  return {
    // Status
    isOnline,
    isInstalled,
    installPrompt: !!installPrompt,
    updateAvailable,
    syncStatus,
    pushSupported,
    notificationPermission,

    // Actions
    installPWA,
    updateServiceWorker,
    cacheData,
    getCachedData,
    handleBarcodeOffline,
    saveOfflineSalesEntry,
    clearCache,
    requestNotificationPermission,
    subscribeToPushNotifications,
    shareContent,
    showNotification,
    updateSyncStatus,
  };
};

// Hook for managing offline storage with IndexedDB
export const useOfflineStorage = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const openDB = () => {
      const request = indexedDB.open('stoir-mobile-storage', 1);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
      };

      request.onsuccess = () => {
        setDb(request.result);
      };

      request.onupgradeneeded = event => {
        const database = event.target.result;

        // Create object stores for offline data
        if (!database.objectStoreNames.contains('products')) {
          const productStore = database.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('barcode', 'barcode', { unique: false });
          productStore.createIndex('category', 'category', { unique: false });
        }

        if (!database.objectStoreNames.contains('sales')) {
          const salesStore = database.createObjectStore('sales', {
            keyPath: 'id',
            autoIncrement: true,
          });
          salesStore.createIndex('timestamp', 'timestamp', { unique: false });
          salesStore.createIndex('status', 'status', { unique: false });
        }

        if (!database.objectStoreNames.contains('customers')) {
          const customerStore = database.createObjectStore('customers', { keyPath: 'id' });
          customerStore.createIndex('name', 'name', { unique: false });
        }

        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    };

    openDB();
  }, []);

  const saveData = useCallback(
    async (storeName, data) => {
      if (!db) return false;

      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        if (Array.isArray(data)) {
          for (const item of data) {
            await store.put(item);
          }
        } else {
          await store.put(data);
        }

        return true;
      } catch (error) {
        console.error(`Failed to save data to ${storeName}:`, error);
        return false;
      }
    },
    [db]
  );

  const getData = useCallback(
    async (storeName, key = null) => {
      if (!db) return null;

      try {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        if (key) {
          return await store.get(key);
        } else {
          return await store.getAll();
        }
      } catch (error) {
        console.error(`Failed to get data from ${storeName}:`, error);
        return null;
      }
    },
    [db]
  );

  const deleteData = useCallback(
    async (storeName, key) => {
      if (!db) return false;

      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.delete(key);
        return true;
      } catch (error) {
        console.error(`Failed to delete data from ${storeName}:`, error);
        return false;
      }
    },
    [db]
  );

  const clearStore = useCallback(
    async storeName => {
      if (!db) return false;

      try {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
        return true;
      } catch (error) {
        console.error(`Failed to clear ${storeName}:`, error);
        return false;
      }
    },
    [db]
  );

  const searchByIndex = useCallback(
    async (storeName, indexName, value) => {
      if (!db) return [];

      try {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        return await index.getAll(value);
      } catch (error) {
        console.error(`Failed to search ${storeName} by ${indexName}:`, error);
        return [];
      }
    },
    [db]
  );

  return {
    saveData,
    getData,
    deleteData,
    clearStore,
    searchByIndex,
    isReady: !!db,
  };
};

export default { useMobilePWA, useOfflineStorage };
