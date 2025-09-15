import React, { useState } from 'react';
import ModernDataTable from '../../../components/ModernDataTable';

const ModernSalesPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data untuk penjualan
  const sampleSales = [
    {
      id: 1,
      noFaktur: 'PJL-2024-001',
      tanggal: '2024-02-15',
      customer: 'PT. Automotive Indonesia',
      totalAmount: 2850000,
      status: 'Lunas',
      paymentMethod: 'Transfer Bank'
    },
    {
      id: 2,
      noFaktur: 'PJL-2024-002',
      tanggal: '2024-02-14',
      customer: 'CV. Motor Sejahtera',
      totalAmount: 1750000,
      status: 'Pending',
      paymentMethod: 'Cash'
    },
    {
      id: 3,
      noFaktur: 'PJL-2024-003',
      tanggal: '2024-02-13',
      customer: 'UD. Sumber Rejeki',
      totalAmount: 3200000,
      status: 'Lunas',
      paymentMethod: 'Transfer Bank'
    }
  ];

  // Define columns untuk penjualan
  const salesColumns = [
    { key: 'noFaktur', title: 'No. Faktur' },
    { key: 'tanggal', title: 'Tanggal', type: 'date' },
    { key: 'customer', title: 'Customer' },
    { key: 'totalAmount', title: 'Total', type: 'currency' },
    { 
      key: 'status', 
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Lunas' 
            ? 'bg-green-100 text-green-800' 
            : value === 'Pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'paymentMethod', title: 'Metode Bayar' }
  ];

  const handleAdd = () => {
    console.log('Tambah penjualan baru');
  };

  const handleEdit = (sale) => {
    console.log('Edit penjualan:', sale);
  };

  const handleDelete = (sale) => {
    console.log('Delete penjualan:', sale);
  };

  const handleView = (sale) => {
    console.log('View penjualan:', sale);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaksi Penjualan</h1>
        <p className="text-gray-600 mt-2">Kelola transaksi penjualan produk</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl border-l-4 border-green-500 shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hari Ini</p>
              <p className="text-2xl font-semibold text-gray-900">Rp 7,800,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Transaksi Hari Ini</p>
              <p className="text-2xl font-semibold text-gray-900">15</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-l-4 border-yellow-500 shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-l-4 border-purple-500 shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Harian</p>
              <p className="text-2xl font-semibold text-gray-900">Rp 5,200,000</p>
            </div>
          </div>
        </div>
      </div>

      <ModernDataTable
        title="Daftar Transaksi Penjualan"
        subtitle="Kelola semua transaksi penjualan"
        columns={salesColumns}
        data={sampleSales}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        borderColor="border-green-500"
        addButtonText="Tambah Penjualan"
        emptyStateText="Belum ada transaksi penjualan"
        emptyStateSubtext="Klik 'Tambah Penjualan' untuk membuat transaksi baru"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModernSalesPage;
