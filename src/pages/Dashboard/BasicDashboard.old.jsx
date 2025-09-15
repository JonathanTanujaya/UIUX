import React from 'react';
import ModernDashboard from '../../components/ModernDashboard';

const BasicDashboard = () => {
  return <ModernDashboard />;
};
    ]);
  }, []);

  // Format currency
  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Simple SVG Chart Component
  const MiniChart = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.sales));
    const chartWidth = 400;
    const chartHeight = 200;
    const padding = 40;

    const points = data
      .map((item, index) => {
        const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
        const y = chartHeight - padding - (item.sales / maxValue) * (chartHeight - 2 * padding);
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="w-full" style={{ height: '300px' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Chart line */}
          <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={points} />

          {/* Data points */}
          {data.map((item, index) => {
            const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
            const y = chartHeight - padding - (item.sales / maxValue) * (chartHeight - 2 * padding);
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                <text x={x} y={chartHeight - 10} textAnchor="middle" fontSize="12" fill="#6b7280">
                  {item.day}
                </text>
              </g>
            );
          })}

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
            const value = maxValue * ratio;
            return (
              <text
                key={index}
                x={padding - 10}
                y={y + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {(value / 1000000).toFixed(0)}M
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Ringkasan aktivitas bisnis hari ini</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Penjualan Hari Ini"
          value={formatCurrency(kpiData.todaySales)}
          subtitle="Target: Rp 18.000.000"
          icon="💰"
          color="success"
        />

        <StatCard
          title="Transaksi Tertunda"
          value={kpiData.pendingTransactions}
          subtitle="Memerlukan tindak lanjut"
          icon="⏳"
          color="warning"
        />

        <StatCard
          title="Barang Akan Habis"
          value={kpiData.lowStockItems}
          subtitle="Di bawah stok minimum"
          icon="📦"
          color="danger"
        />
      </div>

      {/* Sales Chart */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">Penjualan 7 Hari Terakhir</h3>
          <p className="text-sm text-gray-600">Tren penjualan dalam seminggu</p>
        </div>
        <div className="card-body">
          <MiniChart data={salesData} />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ringkasan Mingguan</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Penjualan Minggu Ini</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(salesData.reduce((sum, item) => sum + item.sales, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rata-rata per Hari</span>
                <span className="font-semibold">
                  {formatCurrency(
                    salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.length
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hari Terbaik</span>
                <span className="font-semibold text-blue-600">
                  {salesData.reduce(
                    (max, item) => (item.sales > max.sales ? item : max),
                    salesData[0]
                  )?.day || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Aktivitas Terbaru</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Invoice #INV-2025-001 telah dibayar</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Stok Oli Yamalube menipis (5 tersisa)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Pesanan #PO-2025-045 diterima</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Invoice #INV-2025-042 jatuh tempo besok</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Aksi Cepat</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-outline-primary flex flex-col items-center p-4 hover:bg-blue-50 transition-colors">
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm">Buat Invoice</span>
            </button>

            <button className="btn btn-outline-primary flex flex-col items-center p-4 hover:bg-blue-50 transition-colors">
              <span className="text-2xl mb-2">📦</span>
              <span className="text-sm">Cek Stok</span>
            </button>

            <button className="btn btn-outline-primary flex flex-col items-center p-4 hover:bg-blue-50 transition-colors">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm">Laporan</span>
            </button>

            <button className="btn btn-outline-primary flex flex-col items-center p-4 hover:bg-blue-50 transition-colors">
              <span className="text-2xl mb-2">⚙️</span>
              <span className="text-sm">Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDashboard;
