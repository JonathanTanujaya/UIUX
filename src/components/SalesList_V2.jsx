import React from 'react';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { salesService } from '../config/apiService.js';
import { useConfirmDialog } from './common/LoadingComponents.jsx';
import DataTable, { StatusBadge, formatCurrency } from './common/DataTable.jsx';

function SalesList({ onEdit, onRefresh }) {
  const {
    data: sales,
    loading,
    error,
    refresh,
  } = useDataFetch(salesService.getAll, [onRefresh], { errorMessage: 'Gagal memuat data sales' });

  const { loading: operationLoading, remove } = useCrudOperations(salesService, refresh);
  const { confirmDelete } = useConfirmDialog();

  const handleDelete = async sale => {
    if (!sale.kodedivisi || !sale.kodesales) {
      return;
    }

    const confirmed = confirmDelete(`sales "${sale.namasales || 'ini'}"`);
    if (confirmed) {
      await remove(sale.kodedivisi, sale.kodesales);
    }
  };

  const handleEdit = sale => {
    if (!sale.kodedivisi || !sale.kodesales) {
      return;
    }
    onEdit(sale);
  };

  // Define table columns
  const columns = [
    {
      key: 'kodedivisi',
      header: 'Kode Divisi',
    },
    {
      key: 'kodesales',
      header: 'Kode Sales',
    },
    {
      key: 'namasales',
      header: 'Nama Sales',
    },
    {
      key: 'alamat',
      header: 'Alamat',
    },
    {
      key: 'nohp',
      header: 'No HP',
    },
    {
      key: 'target',
      header: 'Target',
      render: sale => formatCurrency(sale.target),
    },
    {
      key: 'status',
      header: 'Status',
      render: sale => <StatusBadge active={sale.status} />,
    },
  ];

  // Key extractor untuk unique keys
  const keyExtractor = (sale, index) => {
    return sale.kodedivisi && sale.kodesales
      ? `${sale.kodedivisi}-${sale.kodesales}`
      : `sale-${index}`;
  };

  return (
    <DataTable
      title="Daftar Sales"
      data={sales}
      columns={columns}
      loading={loading}
      error={error}
      onRefresh={refresh}
      onEdit={handleEdit}
      onDelete={handleDelete}
      keyExtractor={keyExtractor}
      emptyMessage="Belum ada data sales"
      operationLoading={operationLoading}
    />
  );
}

export default SalesList;
