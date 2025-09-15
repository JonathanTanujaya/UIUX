import { DataTable } from './DataTable';
import { useCrudOperations } from '../hooks/useDataFetch';
import { bankService } from '../config/apiService';
import { useConfirmDialog } from './LoadingComponents';

function MBankList({ onEdit, onRefresh }) {
  const { data: banks, loading, refresh } = useCrudOperations(bankService, onRefresh);

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Bank',
      message: `Apakah Anda yakin ingin menghapus bank "${item.namabank}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.kodebank);
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
      header: 'Kode Bank',
      accessor: 'kodebank',
      className: 'font-monospace',
    },
    {
      header: 'Nama Bank',
      accessor: 'namabank',
      className: 'text-start',
    },
    {
      header: 'No. Rekening',
      accessor: 'norekening',
      render: value => value || '-',
      className: 'font-monospace',
    },
    {
      header: 'Atas Nama',
      accessor: 'atasnama',
      render: value => value || '-',
      className: 'text-start',
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
        title="Daftar Bank"
        data={banks}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodebank', 'namabank', 'norekening', 'atasnama']}
        keyField="kodebank"
      />
    </div>
  );
}

export default MBankList;
