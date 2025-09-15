import React from 'react';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { barangService } from '../config/apiService.js';
import { useConfirmDialog } from './common/LoadingComponents.jsx';
import DataTable, { StatusBadge, formatCurrency } from './common/DataTable.jsx';

function BarangList({ onEdit, onRefresh }) {
  const {
    data: barang,
    loading,
    error,
    refresh,
  } = useDataFetch(barangService.getAll, [onRefresh], { errorMessage: 'Gagal memuat data barang' });

  const { loading: operationLoading, remove } = useCrudOperations(barangService, refresh);
  const { confirmDelete } = useConfirmDialog();

  const handleDelete = async item => {
    if (!item.kodedivisi || !item.kodebarang) {
      return;
    }

    const confirmed = confirmDelete(`barang "${item.namabarang || 'ini'}"`);
    if (confirmed) {
      await remove(item.kodedivisi, item.kodebarang);
    }
  };

  const handleEdit = item => {
    if (!item.kodedivisi || !item.kodebarang) {
      return;
    }
    onEdit(item);
  };

  // Define table columns
  const columns = [
    {
      key: 'kodedivisi',
      header: 'Kode Divisi',
    },
    {
      key: 'kodebarang',
      header: 'Kode Barang',
    },
    {
      key: 'namabarang',
      header: 'Nama Barang',
    },
    {
      key: 'kodekategori',
      header: 'Kategori',
    },
    {
      key: 'satuan',
      header: 'Satuan',
    },
    {
      key: 'hargajual',
      header: 'Harga Jual',
      render: item => `Rp ${formatCurrency(item.hargajual)}`,
    },
    {
      key: 'hargabeli',
      header: 'Harga Beli',
      render: item => `Rp ${formatCurrency(item.hargabeli)}`,
    },
    {
      key: 'stok',
      header: 'Stok',
      render: item => formatCurrency(item.stok),
    },
    {
      key: 'status',
      header: 'Status',
      render: item => <StatusBadge active={item.status} />,
    },
  ];

  // Key extractor untuk unique keys
  const keyExtractor = (item, index) => {
    return item.kodedivisi && item.kodebarang
      ? `${item.kodedivisi}-${item.kodebarang}`
      : `barang-${index}`;
  };

  return (
    <DataTable
      title="Daftar Barang"
      data={barang}
      columns={columns}
      loading={loading}
      error={error}
      onRefresh={refresh}
      onEdit={handleEdit}
      onDelete={handleDelete}
      keyExtractor={keyExtractor}
      emptyMessage="Belum ada data barang"
      operationLoading={operationLoading}
    />
  );
}

export default BarangList;
