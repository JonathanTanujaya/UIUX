import React from 'react';
import DataTable, { StatusBadge } from './common/DataTable.jsx';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { salesService } from '../config/apiService.js';
import { useConfirmDialog } from './common/LoadingComponents.jsx';

function SalesList({ onEdit, onRefresh }) {
  const {
    data: sales,
    loading,
    error,
    refresh,
  } = useDataFetch(salesService.getAll, [onRefresh], { errorMessage: 'Gagal memuat data sales' });

  const { loading: operationLoading, remove } = useCrudOperations(salesService, refresh);
  const confirm = useConfirmDialog();

  const handleDelete = async sale => {
    if (!sale.kodedivisi || !sale.kodesales) {
      return;
    }

    const confirmed = await confirm({
      title: 'Hapus Sales',
      message: `Apakah Anda yakin ingin menghapus sales "${sale.namasales || 'ini'}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      await remove(sale.kodedivisi, sale.kodesales);
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      key: 'kodedivisi',
      style: { textAlign: 'center' },
    },
    {
      header: 'Kode Sales',
      key: 'kodesales',
      style: { fontFamily: 'monospace' },
    },
    {
      header: 'Nama Sales',
      key: 'namasales',
      style: { textAlign: 'left' },
    },
    {
      header: 'Telepon',
      key: 'telp',
      style: { textAlign: 'left' },
    },
    {
      header: 'Alamat',
      key: 'alamat',
      style: { textAlign: 'left' },
    },
    {
      header: 'Status',
      key: 'status',
      render: value => <StatusBadge active={value} />,
      style: { textAlign: 'center' },
    },
  ];

  return (
    <DataTable
      title="Daftar Sales"
      data={sales}
      columns={columns}
      loading={loading}
      error={error}
      onRefresh={refresh}
      onEdit={onEdit}
      onDelete={handleDelete}
      operationLoading={operationLoading}
      keyExtractor={(item, index) =>
        item.kodedivisi && item.kodesales
          ? `${item.kodedivisi}-${item.kodesales}`
          : `sales-${index}`
      }
      searchable={true}
      searchFields={['kodesales', 'namasales', 'telp', 'alamat']}
      keyField="kodesales"
      defaultSort={{ field: 'namasales', direction: 'asc' }}
    />
  );
}

export default SalesList;
