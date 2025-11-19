import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Navigation Context
const NavigationContext = createContext();

// Navigation categories and their items
export const navigationConfig = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'HomeIcon',
    path: '/dashboard',
    items: [],
  },
  master: {
    id: 'master',
    label: 'Master Data',
    icon: 'CubeIcon',
    color: 'indigo',
    items: [
      { label: 'Kategori', path: '/master/kategori', icon: 'TagIcon' },
      { label: 'Sparepart', path: '/master/sparepart', icon: 'CogIcon' },
      { label: 'Area', path: '/master/area', icon: 'MapIcon' },
      { label: 'Sales', path: '/master/sales', icon: 'UserIcon' },
      { label: 'Supplier', path: '/master/supplier', icon: 'TruckIcon' },
      { label: 'Customer', path: '/master/customer', icon: 'UsersIcon' },
      { label: 'Bank', path: '/master/bank', icon: 'BuildingLibraryIcon' },
    ],
  },
  transactions: {
    id: 'transactions',
    label: 'Transaksi',
    icon: 'DocumentTextIcon',
    color: 'green',
    items: [
      { label: 'Pembelian', path: '/transactions/pembelian', icon: 'ShoppingCartIcon', active: true },
      {
        label: 'Retur Pembelian',
        path: '/transactions/retur-pembelian',
        icon: 'UndoIcon',
      },
      { label: 'Penjualan', path: '/transactions/penjualan', icon: 'DollarSignIcon' },
      {
        label: 'Retur Penjualan',
        path: '/transactions/retur-penjualan',
        icon: 'UndoIcon',
      },
      {
        label: 'Stok Opname',
        path: '/transactions/stok-opname',
        icon: 'PackageIcon',
      },
      { label: 'Pembelian Bonus', path: '/transactions/pembelian-bonus', icon: 'GiftIcon' },
      { label: 'Penjualan Bonus', path: '/transactions/penjualan-bonus', icon: 'GiftIcon' },
      {
        label: 'Customer Claim',
        path: '/transactions/customer-claim',
        icon: 'AlertTriangleIcon',
      },
    ],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    icon: 'CurrencyDollarIcon',
    color: 'yellow',
    items: [
      { label: 'Penerimaan Resi', path: '/finance/penerimaan-resi', icon: 'InboxIcon' },
      { label: 'Piutang Resi', path: '/finance/piutang-resi', icon: 'ClockIcon' },
      { label: 'Piutang Retur', path: '/finance/piutang-retur', icon: 'ArrowPathIcon' },
      { label: 'Penambahan Saldo', path: '/finance/penambahan-saldo', icon: 'PlusCircleIcon' },
      { label: 'Pengurangan Saldo', path: '/finance/pengurangan-saldo', icon: 'MinusCircleIcon' },
    ],
  },
  reports: {
    id: 'reports',
    label: 'Laporan',
    icon: 'ChartBarIcon',
    color: 'purple',
    items: [
      { label: 'Stok Barang', path: '/reports/stok-barang', icon: 'CubeIcon' },
      { label: 'Pembelian', path: '/reports/pembelian', icon: 'ShoppingBagIcon' },
      { label: 'Penjualan', path: '/reports/penjualan', icon: 'BanknotesIcon' },
    ],
  },
};

// Custom hook for navigation
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

// Navigation Provider Component
export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('dashboard');
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Auto-detect active category based on current route
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const categoryFromPath = pathSegments[1];

    if (navigationConfig[categoryFromPath]) {
      setActiveCategory(categoryFromPath);
    } else if (location.pathname === '/' || location.pathname === '/dashboard') {
      setActiveCategory('dashboard');
    }
  }, [location.pathname]);

  // Toggle favorite item
  const toggleFavorite = item => {
    setFavoriteItems(prev => {
      const exists = prev.find(fav => fav.path === item.path);
      if (exists) {
        return prev.filter(fav => fav.path !== item.path);
      } else {
        return [...prev, item].slice(0, 8); // Max 8 favorites
      }
    });
  };

  // Search functionality
  const searchItems = query => {
    if (!query.trim()) return [];

    const allItems = Object.values(navigationConfig).flatMap(cat => {
      const categoryItems = cat.items || [];
      return [
        { ...cat, type: 'category' },
        ...categoryItems.map(item => ({ ...item, category: cat.label, type: 'item' })),
      ];
    });

    return allItems.filter(
      item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const value = {
    // State
    activeCategory,
    favoriteItems,

    // Actions
    setActiveCategory,
    toggleFavorite,
    searchItems,

    // Config
    navigationConfig,

    // Computed
    activeItems: navigationConfig[activeCategory]?.items || [],
    activeCategoryConfig: navigationConfig[activeCategory],
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export default NavigationProvider;
