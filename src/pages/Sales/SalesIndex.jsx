import React from 'react';
import { Link } from 'react-router-dom';

const SalesIndex = () => {
  const menuItems = [
    {
      title: 'Form Penjualan',
      description: 'Buat transaksi penjualan baru',
      path: '/transactions/sales/penjualan',
      icon: '📝',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      title: 'Daftar Penjualan',
      description: 'Lihat dan kelola semua transaksi penjualan',
      path: '/transactions/sales/list',
      icon: '📋',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
      title: 'Retur Penjualan',
      description: 'Proses pengembalian barang dari customer',
      path: '/transactions/sales/retur-penjualan',
      icon: '↩️',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    },
    {
      title: 'Laporan Penjualan',
      description: 'Lihat laporan dan analisis penjualan',
      path: '/reports/sales',
      icon: '📊',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
  ];

  return (
    <div className="sales-index">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`block p-6 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${item.color}`}
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{item.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📈 Ringkasan Penjualan Hari Ini
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">--</div>
              <div className="text-sm text-gray-600">Total Transaksi</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">--</div>
              <div className="text-sm text-gray-600">Total Penjualan</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">--</div>
              <div className="text-sm text-gray-600">Retur Hari Ini</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">--</div>
              <div className="text-sm text-gray-600">Pending Invoice</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-800">Informasi</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Pastikan untuk memverifikasi semua transaksi penjualan dan update stok secara
                berkala.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesIndex;
