import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import StatCard from '../../components/StatCard';
import '../../design-system.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const NewDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [kpiData, setKpiData] = useState({
    todaySales: 0,
    pendingTransactions: 0,
    lowStockItems: 0,
  });

  // Data dummy untuk KPI
  useEffect(() => {
    setKpiData({
      todaySales: 15750000, // Rp 15.750.000
      pendingTransactions: 12,
      lowStockItems: 8,
    });

    // Data dummy untuk grafik penjualan 7 hari terakhir
    const dummySalesData = {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      datasets: [
        {
          label: 'Penjualan (Rp)',
          data: [8500000, 12300000, 9800000, 14200000, 11500000, 16800000, 15750000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'rgb(59, 130, 246)',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4,
        },
      ],
    };
    setSalesData(dummySalesData);
  }, []);

  // Format currency
  const formatCurrency = value => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Penjualan: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          callback: function (value) {
            return `${(value / 1000000).toFixed(0)}M`;
          },
        },
      },
    },
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
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Penjualan 7 Hari Terakhir</h3>
          <p className="text-sm text-gray-600">Tren penjualan dalam seminggu</p>
        </div>
        <div className="card-body">
          <div style={{ width: '100%', height: '400px' }}>
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Aksi Cepat</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="btn btn-outline-primary flex flex-col items-center p-4">
                <span className="text-2xl mb-2">📝</span>
                <span className="text-sm">Buat Invoice</span>
              </button>

              <button className="btn btn-outline-primary flex flex-col items-center p-4">
                <span className="text-2xl mb-2">📦</span>
                <span className="text-sm">Cek Stok</span>
              </button>

              <button className="btn btn-outline-primary flex flex-col items-center p-4">
                <span className="text-2xl mb-2">📊</span>
                <span className="text-sm">Laporan</span>
              </button>

              <button className="btn btn-outline-primary flex flex-col items-center p-4">
                <span className="text-2xl mb-2">⚙️</span>
                <span className="text-sm">Pengaturan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
