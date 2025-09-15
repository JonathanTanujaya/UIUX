import React, { useState } from 'react';
import ModernDataTable from '../../../components/ModernDataTable';

const ModernMasterCategories = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Sample data untuk kategori
  const sampleCategories = [
    {
      id: 1,
      kode: 'KAT001',
      nama: 'Spare Part Mesin',
      deskripsi: 'Kategori untuk komponen mesin kendaraan',
      status: 'Aktif',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      kode: 'KAT002',
      nama: 'Oli & Pelumas',
      deskripsi: 'Kategori untuk oli dan bahan pelumas',
      status: 'Aktif',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      kode: 'KAT003',
      nama: 'Aksesoris',
      deskripsi: 'Kategori untuk aksesoris kendaraan',
      status: 'Tidak Aktif',
      createdAt: '2024-01-05'
    }
  ];

  // Define columns untuk master kategori
  const categoryColumns = [
    { key: 'kode', title: 'Kode' },
    { key: 'nama', title: 'Nama Kategori' },
    { key: 'deskripsi', title: 'Deskripsi' },
    { 
      key: 'status', 
      title: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'Aktif' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'createdAt', title: 'Tanggal Dibuat', type: 'date' }
  ];

  const handleAdd = () => {
    console.log('Tambah kategori baru');
  };

  const handleEdit = (category) => {
    console.log('Edit kategori:', category);
  };

  const handleDelete = (category) => {
    console.log('Delete kategori:', category);
  };

  const handleView = (category) => {
    console.log('View kategori:', category);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Master Kategori</h1>
        <p className="text-gray-600 mt-2">Kelola data kategori produk</p>
      </div>

      <ModernDataTable
        title="Daftar Kategori"
        subtitle="Kelola kategori produk Anda"
        columns={categoryColumns}
        data={sampleCategories}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        borderColor="border-indigo-500"
        addButtonText="Tambah Kategori"
        emptyStateText="Belum ada kategori"
        emptyStateSubtext="Klik 'Tambah Kategori' untuk membuat kategori baru"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModernMasterCategories;
