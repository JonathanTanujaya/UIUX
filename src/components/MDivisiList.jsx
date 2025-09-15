import DataTable from './common/DataTable';
import { useCrudOperations } from '../hooks/useDataFetch';
import { mdivisiService } from '../config/apiService';
import { useConfirmDialog } from './common/LoadingComponents';

function MDivisiList({ onEdit, onRefresh }) {
  const { data: divisi, loading, refresh } = useCrudOperations(mdivisiService, onRefresh);

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Divisi',
      message: `Apakah Anda yakin ingin menghapus divisi "${item.namadivisi}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi);
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
      className: 'text-center font-monospace',
    },
    {
      header: 'Nama Divisi',
      accessor: 'namadivisi',
      className: 'text-start',
    },
    {
      header: 'Alamat',
      accessor: 'alamat',
      render: value => value || '-',
      className: 'text-start',
    },
    {
      header: 'Telepon',
      accessor: 'telepon',
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
        title="Daftar Divisi"
        data={divisi}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodedivisi', 'namadivisi', 'alamat', 'telepon']}
        keyField="kodedivisi"
      />
    </div>
  );
}

export default MDivisiList;
