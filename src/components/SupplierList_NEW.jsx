import { DataTable } from './DataTable';
import { useCrudOperations } from '../hooks/useDataFetch';
import { supplierService } from '../config/apiService';
import { useConfirmDialog } from './LoadingComponents';

function SupplierList({ onEdit, onRefresh }) {
  const { data: suppliers, loading, refresh } = useCrudOperations(supplierService, onRefresh);

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Supplier',
      message: `Apakah Anda yakin ingin menghapus supplier "${item.namasupplier}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.kodesupplier);
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
      header: 'Kode Supplier',
      accessor: 'kodesupplier',
      className: 'font-monospace',
    },
    {
      header: 'Nama Supplier',
      accessor: 'namasupplier',
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
      header: 'Email',
      accessor: 'email',
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
        title="Daftar Supplier"
        data={suppliers}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodesupplier', 'namasupplier', 'alamat', 'telepon', 'email']}
        keyField="kodesupplier"
      />
    </div>
  );
}

export default SupplierList;
