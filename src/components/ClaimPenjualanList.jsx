import React from 'react';
import DataTable, { StatusBadge } from './common/DataTable.jsx';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { claimPenjualanService } from '../config/apiService.js';
import { useConfirmDialog } from './common/LoadingComponents.jsx';

function ClaimPenjualanList({ onEdit, onRefresh }) {
  const {
    data: claims,
    loading,
    error,
    refresh,
  } = useDataFetch(
    () => claimPenjualanService.getAll(), // Using a function to call the service
    [onRefresh],
    { errorMessage: 'Gagal memuat data klaim penjualan' }
  );

  const { loading: operationLoading, remove } = useCrudOperations(claimPenjualanService, refresh);
  const confirm = useConfirmDialog();

  const handleDelete = async claim => {
    if (!claim.kodedivisi || !claim.noclaim) {
      return;
    }

    const confirmed = await confirm({
      title: 'Hapus Klaim',
      message: `Apakah Anda yakin ingin menghapus klaim "${claim.noclaim}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      await remove(claim.kodedivisi, claim.noclaim);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch {
      return '-';
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      key: 'kodedivisi',
      style: { textAlign: 'center' },
    },
    {
      header: 'No Klaim',
      key: 'noclaim',
      style: { fontFamily: 'monospace' },
    },
    {
      header: 'Tgl Klaim',
      key: 'tglclaim',
      render: value => formatDate(value),
      style: { textAlign: 'center' },
    },
    {
      header: 'Kode Customer',
      key: 'kodecust',
      style: { textAlign: 'center' },
    },
    {
      header: 'Keterangan',
      key: 'keterangan',
      style: { textAlign: 'left' },
    },
    {
      header: 'Status',
      key: 'status',
      render: value => <StatusBadge active={value} activeText="Selesai" inactiveText="Proses" />,
      style: { textAlign: 'center' },
    },
  ];

  return (
    <DataTable
      title="Daftar Klaim Penjualan"
      data={claims}
      columns={columns}
      loading={loading}
      error={error}
      onRefresh={refresh}
      onEdit={onEdit}
      onDelete={handleDelete}
      operationLoading={operationLoading}
      keyExtractor={(item, index) =>
        item.kodedivisi && item.noclaim ? `${item.kodedivisi}-${item.noclaim}` : `claim-${index}`
      }
      searchable={true}
      searchFields={['noclaim', 'kodecust', 'keterangan']}
      keyField="noclaim"
      defaultSort={{ field: 'tglclaim', direction: 'desc' }}
    />
  );
}

export default ClaimPenjualanList;
