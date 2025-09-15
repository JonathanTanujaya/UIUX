// PWA utilities and hooks for offline purchasing functionality
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

// Custom hook for PWA functionality
export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSwRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const installPromptRef = useRef(null);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (installPromptRef.current) {
      const result = await installPromptRef.current.prompt();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        toast.success('Stoir Purchasing installed successfully!');
      }
      installPromptRef.current = null;
    }
  }, []);

  // Update PWA
  const updatePWA = useCallback(() => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [swRegistration]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!swRegistration) return null;

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
      });

      // Send subscription to server
      await fetch('/api/notifications/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      toast.success('Push notifications enabled!');
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      toast.error('Failed to enable push notifications');
      return null;
    }
  }, [swRegistration]);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          setSwRegistration(registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = e => {
      e.preventDefault();
      installPromptRef.current = e;
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      toast.success('App installed successfully!');
    };

    // Listen for online/offline
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing data...');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Some features may be limited.');
    };

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

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    installPWA,
    updatePWA,
    subscribeToPush,
  };
};

// Custom hook for offline data management
export const useOfflineData = (key, apiCall, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineData, setIsOfflineData] = useState(false);

  const { enableOffline = true, syncInterval = 30000, retryOnline = true } = options;

  // Fetch data with offline fallback
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        // Try network first
        const response = await apiCall();
        const newData = response.data;

        setData(newData);
        setIsOfflineData(false);

        // Cache data for offline use
        if (enableOffline) {
          localStorage.setItem(
            `offline_${key}`,
            JSON.stringify({
              data: newData,
              timestamp: Date.now(),
            })
          );
        }
      } catch (networkError) {
        console.warn('Network request failed, trying offline data:', networkError);

        // Try offline data
        if (enableOffline) {
          const cachedData = localStorage.getItem(`offline_${key}`);
          if (cachedData) {
            const { data: offlineData, timestamp } = JSON.parse(cachedData);
            const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours

            if (!isExpired || !navigator.onLine) {
              setData(offlineData);
              setIsOfflineData(true);

              if (isExpired) {
                toast.warning('Showing cached data (may be outdated)');
              }
            } else {
              setError(networkError);
            }
          } else {
            setError(networkError);
          }
        } else {
          setError(networkError);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall, key, enableOffline]
  );

  // Auto-sync when back online
  useEffect(() => {
    if (retryOnline && navigator.onLine && isOfflineData) {
      fetchData();
    }
  }, [navigator.onLine, isOfflineData, fetchData, retryOnline]);

  // Periodic sync
  useEffect(() => {
    if (syncInterval > 0 && navigator.onLine) {
      const interval = setInterval(() => {
        fetchData();
      }, syncInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, syncInterval]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isOfflineData,
    refetch: fetchData,
  };
};

// Custom hook for offline form management
export const useOfflineForm = (submitApi, options = {}) => {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { enableOfflineQueue = true, autoSyncOnline = true } = options;

  // Submit form with offline support
  const submitForm = useCallback(
    async formData => {
      setIsSubmitting(true);

      try {
        if (navigator.onLine) {
          // Submit online
          const response = await submitApi(formData);
          toast.success('Form submitted successfully!');
          return response;
        } else if (enableOfflineQueue) {
          // Queue for offline sync
          const submission = {
            id: Date.now().toString(),
            data: formData,
            timestamp: Date.now(),
            status: 'pending',
          };

          const existing = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
          const updated = [...existing, submission];
          localStorage.setItem('offline_submissions', JSON.stringify(updated));

          setPendingSubmissions(updated);
          toast.info('Form queued for submission when online');

          return { success: true, queued: true };
        } else {
          throw new Error('Cannot submit while offline');
        }
      } catch (error) {
        toast.error(`Submission failed: ${error.message}`);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitApi, enableOfflineQueue]
  );

  // Sync pending submissions
  const syncPendingSubmissions = useCallback(async () => {
    const pending = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
    if (pending.length === 0) return;

    const successful = [];
    const failed = [];

    for (const submission of pending) {
      try {
        await submitApi(submission.data);
        successful.push(submission.id);
        toast.success(`Queued submission synced successfully`);
      } catch (error) {
        failed.push(submission.id);
        console.error('Failed to sync submission:', error);
      }
    }

    // Remove successful submissions
    const remaining = pending.filter(s => !successful.includes(s.id));
    localStorage.setItem('offline_submissions', JSON.stringify(remaining));
    setPendingSubmissions(remaining);

    if (successful.length > 0) {
      toast.success(`${successful.length} queued submissions synced`);
    }
    if (failed.length > 0) {
      toast.warning(`${failed.length} submissions failed to sync`);
    }
  }, [submitApi]);

  // Auto-sync when online
  useEffect(() => {
    if (autoSyncOnline && navigator.onLine) {
      syncPendingSubmissions();
    }
  }, [navigator.onLine, autoSyncOnline, syncPendingSubmissions]);

  // Load pending submissions on mount
  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem('offline_submissions') || '[]');
    setPendingSubmissions(pending);
  }, []);

  return {
    submitForm,
    isSubmitting,
    pendingSubmissions,
    syncPendingSubmissions,
  };
};

// Custom hook for background sync
export const useBackgroundSync = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Register background sync
  const registerSync = useCallback(
    async tag => {
      if (!isSupported) return false;

      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(tag);
        setIsRegistered(true);
        return true;
      } catch (error) {
        console.error('Background sync registration failed:', error);
        return false;
      }
    },
    [isSupported]
  );

  useEffect(() => {
    // Check support
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      setIsSupported(true);
    }
  }, []);

  return {
    isSupported,
    isRegistered,
    registerSync,
  };
};

// Utility functions for PWA
export const pwaUtils = {
  // Check if app is running as PWA
  isPWA: () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')
    );
  },

  // Get install prompt
  getInstallPrompt: () => {
    return new Promise(resolve => {
      const handler = e => {
        e.preventDefault();
        window.removeEventListener('beforeinstallprompt', handler);
        resolve(e);
      };
      window.addEventListener('beforeinstallprompt', handler);
    });
  },

  // Show install banner
  showInstallBanner: () => {
    if (!pwaUtils.isPWA() && 'serviceWorker' in navigator) {
      const banner = document.createElement('div');
      banner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: linear-gradient(45deg, #2196F3, #21CBF3);
          color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Roboto', sans-serif;
        ">
          <div>
            <strong>📱 Install Stoir Purchasing</strong><br>
            <small>Get faster access and offline features</small>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 12px;
          ">Install</button>
        </div>
      `;
      document.body.appendChild(banner);

      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (banner.parentElement) {
          banner.remove();
        }
      }, 10000);
    }
  },

  // Check for updates
  checkForUpdates: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  },

  // Clear cache
  clearCache: async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    }
    localStorage.clear();
    sessionStorage.clear();
  },

  // Get cache size
  getCacheSize: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage,
        available: estimate.quota,
        percentage: (estimate.usage / estimate.quota) * 100,
      };
    }
    return null;
  },

  // Request persistent storage
  requestPersistentStorage: async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const persistent = await navigator.storage.persist();
      if (persistent) {
        toast.success('Persistent storage enabled');
      }
      return persistent;
    }
    return false;
  },
};

// Export all utilities
export default {
  usePWA,
  useOfflineData,
  useOfflineForm,
  useBackgroundSync,
  pwaUtils,
};
