import React from 'react';
import DataTable, { StatusBadge } from './common/DataTable.jsx';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { customerService } from '../config/apiService.js';
import { useConfirmDialog } from './common/LoadingComponents.jsx';

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
  const confirm = useConfirmDialog();

  const handleDelete = async customer => {
    if (!customer.kodedivisi || !customer.kodecust) {
      return;
    }

    const confirmed = await confirm({
      title: 'Hapus Pelanggan',
      message: `Apakah Anda yakin ingin menghapus pelanggan "${customer.namacust || 'ini'}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      await remove(customer.kodedivisi, customer.kodecust);
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      key: 'kodedivisi',
      style: { textAlign: 'center' },
    },
    {
      header: 'Kode Customer',
      key: 'kodecust',
      style: { fontFamily: 'monospace' },
    },
    {
      header: 'Nama Customer',
      key: 'namacust',
      style: { textAlign: 'left' },
    },
    {
      header: 'Area',
      key: 'kodearea',
      style: { textAlign: 'center' },
    },
    {
      header: 'Alamat',
      key: 'alamat',
      style: { textAlign: 'left' },
    },
    {
      header: 'Telepon',
      key: 'telp',
      style: { textAlign: 'left' },
    },
    {
      header: 'Contact',
      key: 'contact',
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
      title="Daftar Pelanggan"
      data={customers}
      columns={columns}
      loading={loading}
      error={error}
      onRefresh={refresh}
      onEdit={onEdit}
      onDelete={handleDelete}
      operationLoading={operationLoading}
      keyExtractor={(item, index) =>
        item.kodedivisi && item.kodecust
          ? `${item.kodedivisi}-${item.kodecust}`
          : `customer-${index}`
      }
      searchable={true}
      searchFields={['kodecust', 'namacust', 'alamat', 'telp', 'contact']}
      keyField="kodecust"
      defaultSort={{ field: 'namacust', direction: 'asc' }}
    />
  );
}

export default CustomerList;
