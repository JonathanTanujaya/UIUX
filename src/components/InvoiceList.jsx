import DataTable from './common/DataTable';
import { formatCurrency } from './common/DataTable';
import { useCrudOperations } from '../hooks/useDataFetch';
import { invoiceService } from '../config/apiService';
import { useConfirmDialog } from './common/LoadingComponents';

function InvoiceList({ onEdit, onRefresh }) {
  const { data: invoices, loading, refresh } = useCrudOperations(invoiceService, onRefresh);

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Invoice',
      message: `Apakah Anda yakin ingin menghapus invoice "${item.noinvoice}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.noinvoice);
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`badge ${status ? 'bg-success' : 'bg-warning'}`}>
      {status ? 'Lunas' : 'Belum Lunas'}
    </span>
  );

  const formatDate = dateString => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID');
    } catch {
      return dateString;
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      accessor: 'kodedivisi',
      className: 'text-center',
    },
    {
      header: 'No. Invoice',
      accessor: 'noinvoice',
      className: 'font-monospace',
    },
    {
      header: 'Tanggal',
      accessor: 'tanggal',
      render: value => formatDate(value),
      className: 'text-center',
    },
    {
      header: 'Customer',
      accessor: 'namacustomer',
      render: value => value || '-',
      className: 'text-start',
    },
    {
      header: 'Total',
      accessor: 'total',
      render: value => formatCurrency(value),
      className: 'text-end',
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
      label: 'Lihat',
      onClick: item => {
        // Implementasi view detail invoice
        console.log('View invoice:', item);
      },
      className: 'btn btn-info btn-sm',
      show: true,
    },
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
        title="Daftar Invoice"
        data={invoices}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['noinvoice', 'namacustomer']}
        keyField="noinvoice"
        defaultSort={{ field: 'tanggal', direction: 'desc' }}
      />
    </div>
  );
}

export default InvoiceList;
