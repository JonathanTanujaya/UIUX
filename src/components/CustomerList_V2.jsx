import React from 'react';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { customerService } from '../config/apiService.js';
import { useConfirmDialog } from './common/LoadingComponents.jsx';
import DataTable, { StatusBadge } from './common/DataTable.jsx';

function CustomerList({ onEdit, onRefresh }) {
  const {
    data: customers,
    loading,
    error,
    refresh,
  } = useDataFetch(customerService.getAll, [onRefresh], {
    errorMessage: 'Gagal memuat data pelanggan',
  });

  const { loading: operationLoading, remove } = useCrudOperations(customerService, refresh);
  const { confirmDelete } = useConfirmDialog();

  const handleDelete = async customer => {
    if (!customer.kodedivisi || !customer.kodecust) {
      return;
    }

    const confirmed = confirmDelete(`pelanggan "${customer.namacust || 'ini'}"`);
    if (confirmed) {
      await remove(customer.kodedivisi, customer.kodecust);
    }
  };

  const handleEdit = customer => {
    if (!customer.kodedivisi || !customer.kodecust) {
      return;
    }
    onEdit(customer);
  };

  // Define table columns
  const columns = [
    {
      key: 'kodedivisi',
      header: 'Kode Divisi',
    },
    {
      key: 'kodecust',
      header: 'Kode Customer',
    },
    {
      key: 'namacust',
      header: 'Nama Customer',
    },
    {
      key: 'kodearea',
      header: 'Area',
    },
    {
      key: 'alamat',
      header: 'Alamat',
    },
    {
      key: 'telp',
      header: 'Telepon',
    },
    {
      key: 'contact',
      header: 'Contact',
    },
    {
      key: 'status',
      header: 'Status',
      render: customer => <StatusBadge active={customer.status} />,
    },
  ];

  // Key extractor untuk unique keys
  const keyExtractor = (customer, index) => {
    return customer.kodedivisi && customer.kodecust
      ? `${customer.kodedivisi}-${customer.kodecust}`
      : `customer-${index}`;
  };

  return (
    <DataTable
      title="Daftar Pelanggan"
      data={customers}
      columns={columns}
      loading={loading}
      error={error}
      onRefresh={refresh}
      onEdit={handleEdit}
      onDelete={handleDelete}
      keyExtractor={keyExtractor}
      emptyMessage="Belum ada data pelanggan"
      operationLoading={operationLoading}
    />
  );
}

export default CustomerList;
