import DataTable from './common/DataTable';
import { useDataFetch } from '../hooks/useDataFetch';
import { kategoriService } from '../config/apiService';
import { useConfirmDialog } from './common/LoadingComponents';

function KategoriList({ onEdit, onRefresh }) {
  const {
    data: kategori,
    loading,
    refresh,
  } = useDataFetch(() => kategoriService.getAll(), [onRefresh], {
    errorMessage: 'Gagal memuat data kategori',
  });

  // Debug log untuk melihat data yang diterima
  console.log('KategoriList Debug:', {
    kategori,
    loading,
    kategoriType: typeof kategori,
    kategoriLength: Array.isArray(kategori) ? kategori.length : 'not array',
  });

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Kategori',
      message: `Apakah Anda yakin ingin menghapus kategori "${item.namakategori}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.kodekategori);
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      accessor: 'kodedivisi',
      className: 'text-center',
    },
    {
      header: 'Kode Kategori',
      accessor: 'kodekategori',
      className: 'font-monospace',
    },
    {
      header: 'Nama Kategori',
      accessor: 'namakategori',
      className: 'text-start',
    },
    {
      header: 'Keterangan',
      accessor: 'keterangan',
      render: value => value || '-',
      className: 'text-start',
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
        title="Daftar Kategori"
        data={kategori || []}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodekategori', 'namakategori', 'keterangan']}
        keyField="id"
      />
    </div>
  );
}

export default KategoriList;
