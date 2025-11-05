import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  useCustomers,
  useBarang,
  useInvoices,
  useSuppliers,
  useKartuStok,
  useSaldoBank,
} from '../../hooks/useApi';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [kpiData, setKpiData] = useState({
    todaySales: 0,
    pendingTransactions: 0,
    lowStockItems: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalSuppliers: 0,
  });

  // Fetch real data using React Query hooks
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: products, isLoading: productsLoading } = useBarang();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();
  const { data: stockMovements, isLoading: stockLoading } = useKartuStok();
  const { data: bankBalance, isLoading: bankLoading } = useSaldoBank();

  // Process real data untuk KPI
  useEffect(() => {
    if (customers?.data && products?.data && invoices?.data && suppliers?.data) {
      // Calculate real KPIs
      const totalInvoices = invoices.data || [];
      const todayInvoices = totalInvoices.filter(invoice => {
        const today = new Date().toISOString().split('T')[0];
        const invoiceDate = invoice.tglInvoice?.split('T')[0];
        return invoiceDate === today;
      });

      const todaySalesAmount = todayInvoices.reduce(
        (sum, invoice) => sum + (parseFloat(invoice.totalInvoice) || 0),
        0
      );

      const pendingInvoices = totalInvoices.filter(invoice => !invoice.statusLunas);

      const lowStockProducts = (products.data || []).filter(
        product => (product.stok || 0) <= (product.stokMinimum || 5)
      );

      setKpiData({
        todaySales: todaySalesAmount,
        pendingTransactions: pendingInvoices.length,
        lowStockItems: lowStockProducts.length,
        totalCustomers: customers.data?.length || 0,
        totalProducts: products.data?.length || 0,
        totalSuppliers: suppliers.data?.length || 0,
      });

      // Generate sales data for chart (last 7 days)
      const generateSalesChart = () => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayInvoices = totalInvoices.filter(invoice => {
            const invoiceDate = invoice.tglInvoice?.split('T')[0];
            return invoiceDate === dateStr;
          });

          const dayTotal = dayInvoices.reduce(
            (sum, invoice) => sum + (parseFloat(invoice.totalInvoice) || 0),
            0
          );

          last7Days.push({
            date: dateStr,
            sales: dayTotal,
            day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
          });
        }
        return last7Days;
      };

      setSalesData(generateSalesChart());
    }
  }, [customers, products, invoices, suppliers]);

  // Format currency
  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip untuk grafik
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-700">{`${data.day}, ${label}`}</p>
          <p className="text-sm text-blue-600 font-semibold">
            {`Penjualan: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Loading state
  const isLoading = customersLoading || productsLoading || invoicesLoading || suppliersLoading;

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Penjualan Hari Ini</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(kpiData.todaySales)}
              </p>
              <p className="text-xs text-green-600 mt-1">Real-time sales</p>
            </div>
            <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">Invoice Tertunda</p>
              <p className="text-2xl font-bold text-yellow-900">{kpiData.pendingTransactions}</p>
              <p className="text-xs text-yellow-600 mt-1">Belum lunas</p>
            </div>
            <div className="w-14 h-14 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Stok Rendah</p>
              <p className="text-2xl font-bold text-red-900">{kpiData.lowStockItems}</p>
              <p className="text-xs text-red-600 mt-1">Perlu restock</p>
            </div>
            <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Customer</p>
              <p className="text-2xl font-bold text-blue-900">{kpiData.totalCustomers}</p>
              <p className="text-xs text-blue-600 mt-1">Active customers</p>
            </div>
            <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Total Produk</p>
              <p className="text-2xl font-bold text-purple-900">{kpiData.totalProducts}</p>
              <p className="text-xs text-purple-600 mt-1">Items in catalog</p>
            </div>
            <div className="w-14 h-14 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">🛍️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl shadow-sm border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700 mb-1">Total Supplier</p>
              <p className="text-2xl font-bold text-indigo-900">{kpiData.totalSuppliers}</p>
              <p className="text-xs text-indigo-600 mt-1">Active suppliers</p>
            </div>
            <div className="w-14 h-14 bg-indigo-200 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">📈 Penjualan 7 Hari Terakhir</h3>
          <p className="text-sm text-gray-600">Tren penjualan real-time dari data invoice</p>
        </div>
        <div className="p-6">
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <LineChart
                data={salesData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickFormatter={value => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Master Data Quick Access */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">🗂️ Master Data</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link 
                to="/master/kategori"
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-3">📝</span>
                <span className="text-sm font-medium">Kategori</span>
              </Link>
              <Link 
                to="/master/sparepart"
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-3">⚙️</span>
                <span className="text-sm font-medium">Sparepart</span>
              </Link>
              <Link 
                to="/master/suppliers"
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-3">🏭</span>
                <span className="text-sm font-medium">Supplier</span>
              </Link>
              <Link 
                to="/master/sales"
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg mr-3">💼</span>
                <span className="text-sm font-medium">Sales</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">📊 Data Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Customers Data</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${customersLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {customersLoading ? 'Loading...' : `✅ ${customers?.data?.length || 0} records`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Products Data</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${productsLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {productsLoading ? 'Loading...' : `✅ ${products?.data?.length || 0} records`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Invoices Data</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${invoicesLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {invoicesLoading ? 'Loading...' : `✅ ${invoices?.data?.length || 0} records`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Suppliers Data</span>
                <span
                  className={`px-2 py-1 rounded text-sm ${suppliersLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {suppliersLoading ? 'Loading...' : `✅ ${suppliers?.data?.length || 0} records`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">⚡ Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/transactions/pembelian"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
              >
                <span className="text-2xl mb-2">�</span>
                <span className="text-sm font-medium">Form Pembelian</span>
              </Link>

              <Link 
                to="/reports/stok-barang"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
              >
                <span className="text-2xl mb-2">📦</span>
                <span className="text-sm font-medium">Laporan Stok</span>
              </Link>

              <Link 
                to="/master/customers"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
              >
                <span className="text-2xl mb-2">👥</span>
                <span className="text-sm font-medium">Kelola Customer</span>
              </Link>

              <Link 
                to="/reports/penjualan"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
              >
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm font-medium">Laporan Penjualan</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-blue-800 font-medium">
          🚀 Dashboard menggunakan React Query untuk real-time data fetching
        </p>
        <p className="text-blue-600 text-sm mt-1">
          Data di-refresh otomatis setiap beberapa menit untuk performa optimal
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
