import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const ModernDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - in real app this would come from API
  const stats = {
    revenue: { value: 125000000, change: 12.5, trend: 'up' },
    orders: { value: 234, change: -5.2, trend: 'down' },
    products: { value: 1250, change: 8.3, trend: 'up' },
    customers: { value: 856, change: 15.7, trend: 'up' }
  };

  const recentTransactions = [
    { id: 'TRX001', type: 'Pembelian', supplier: 'PT. Supplier Utama', amount: 15000000, status: 'completed', time: '2 jam lalu' },
    { id: 'TRX002', type: 'Penjualan', customer: 'CV. Mitra Jaya', amount: 8500000, status: 'pending', time: '3 jam lalu' },
    { id: 'TRX003', type: 'Retur', supplier: 'UD. Sumber Rejeki', amount: -2000000, status: 'completed', time: '5 jam lalu' },
    { id: 'TRX004', type: 'Penjualan', customer: 'PT. Mandiri Sejahtera', amount: 12000000, status: 'completed', time: '1 hari lalu' },
  ];

  const topProducts = [
    { name: 'Sparepart Engine A100', sold: 45, revenue: 22500000, growth: 15.2 },
    { name: 'Oil Filter Premium', sold: 32, revenue: 16000000, growth: 8.7 },
    { name: 'Brake Pad Ceramic', sold: 28, revenue: 14000000, growth: -2.1 },
    { name: 'Air Filter Standard', sold: 25, revenue: 12500000, growth: 5.5 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Refresh immediately without delay
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.value)}</p>
                <div className="flex items-center mt-2">
                  {stats.revenue.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stats.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.revenue.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.orders.value)}</p>
                <div className="flex items-center mt-2">
                  {stats.orders.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stats.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.orders.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.products.value)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">{stats.products.change}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.customers.value)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">{stats.customers.change}%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-200">
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-200">
                  <PieChart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all duration-200">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Simple Chart Placeholder */}
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                <p className="text-sm text-gray-400">Integrasi dengan Chart.js atau Recharts</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-gray-100 hover:border-blue-200">
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-700">New Purchase</span>
                </div>
                <span className="text-blue-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-green-50 rounded-lg transition-colors duration-200 border border-gray-100 hover:border-green-200">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-700">New Sale</span>
                </div>
                <span className="text-green-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-purple-50 rounded-lg transition-colors duration-200 border border-gray-100 hover:border-purple-200">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-700">Stock Check</span>
                </div>
                <span className="text-purple-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-orange-50 rounded-lg transition-colors duration-200 border border-gray-100 hover:border-orange-200">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-medium text-gray-700">Add Customer</span>
                </div>
                <span className="text-orange-400">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <button className="px-3 py-1 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200">View All</button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      transaction.type === 'Pembelian' ? 'bg-blue-100' :
                      transaction.type === 'Penjualan' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'Pembelian' ? <ShoppingCart className="w-4 h-4 text-blue-600" /> :
                       transaction.type === 'Penjualan' ? <DollarSign className="w-4 h-4 text-green-600" /> :
                       <RefreshCw className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.id}</p>
                      <p className="text-sm text-gray-500">{transaction.supplier || transaction.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex items-center">
                      {transaction.status === 'completed' ? (
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-500 mr-1" />
                      )}
                      <p className="text-xs text-gray-500">{transaction.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button className="px-3 py-1 bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200">View All</button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sold} terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <p className={`text-xs ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(product.growth)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Alert/Notification Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <div>
                <h4 className="font-semibold">Stok Rendah Terdeteksi</h4>
                <p className="text-blue-100">5 produk membutuhkan restocking segera</p>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
