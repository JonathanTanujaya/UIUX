import DataTable from './common/DataTable';
import { formatCurrency } from './common/DataTable';
import { useCrudOperations } from '../hooks/useDataFetch';
import { barangService } from '../config/apiService';
import { LoadingButton, useConfirmDialog } from './common/LoadingComponents';

function BarangList({ onEdit, onRefresh }) {
  const { data: barang, loading, refresh } = useCrudOperations(barangService, onRefresh);

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Barang',
      message: `Apakah Anda yakin ingin menghapus barang "${item.namabarang}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.kodebarang);
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`badge ${status ? 'bg-success' : 'bg-danger'}`}>
      {status ? 'Aktif' : 'Nonaktif'}
    </span>
  );

  const columns = [
    {
      header: 'Kode Divisi',
      accessor: 'kodedivisi',
      className: 'text-center',
    },
    {
      header: 'Kode Barang',
      accessor: 'kodebarang',
      className: 'font-monospace',
    },
    {
      header: 'Nama Barang',
      accessor: 'namabarang',
      className: 'text-start',
    },
    {
      header: 'Kategori',
      accessor: 'kodekategori',
      className: 'text-center',
    },
    {
      header: 'Satuan',
      accessor: 'satuan',
      className: 'text-center',
    },
    {
      header: 'Harga Jual',
      accessor: 'hargajual',
      render: value => formatCurrency(value),
      className: 'text-end',
    },
    {
      header: 'Harga List',
      accessor: 'hargalist',
      render: value => formatCurrency(value),
      className: 'text-end',
    },
    {
      header: 'Stok',
      accessor: 'stokmin',
      render: value => value || '-',
      className: 'text-center',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: value => <StatusBadge status={value} />,
      className: 'text-center',
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: onEdit,
      className: 'btn btn-primary btn-sm',
      show: !!onEdit,
    },
    {
      label: 'Hapus',
      onClick: handleDelete,
      className: 'btn btn-danger btn-sm',
      show: true,
    },
  ];

  return (
    <div>
      <DataTable
        title="Daftar Barang"
        data={barang || []}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodebarang', 'namabarang', 'kodekategori', 'merk']}
        keyField="kodebarang"
      />
    </div>
  );
}

export default BarangList;
