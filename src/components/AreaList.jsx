import DataTable from './common/DataTable';
import { useDataFetch } from '../hooks/useDataFetch';
import { areaService } from '../config/apiService';
import { useConfirmDialog } from './common/LoadingComponents';

function AreaList({ onEdit, onRefresh }) {
  const {
    data: areas,
    loading,
    refresh,
  } = useDataFetch(() => areaService.getAll(), [onRefresh], {
    errorMessage: 'Gagal memuat data area',
  });

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Area',
      message: `Apakah Anda yakin ingin menghapus area "${item.namaarea}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.kodearea);
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      accessor: 'kodedivisi',
      className: 'text-center',
    },
    {
      header: 'Kode Area',
      accessor: 'kodearea',
      className: 'font-monospace',
    },
    {
      header: 'Nama Area',
      accessor: 'namaarea',
      className: 'text-start',
    },
    {
      header: 'Status',
      accessor: 'status',
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
        title="Daftar Area"
        data={areas || []}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodearea', 'namaarea', 'status']}
        keyField="id"
      />
    </div>
  );
}

export default AreaList;
