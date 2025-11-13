import { useState, useMemo } from 'react';
import DataTable from './common/DataTable';
import { formatCurrency } from './common/DataTable';
import { useData } from '../hooks/useData';
import { useConfirmDialog } from './common/LoadingComponents';

function BarangList({ onEdit, onRefresh }) {
  // Use data from JSON file
  const { barang: barangData, getKategoriById } = useData();
  const [loading, setLoading] = useState(false);
  
  // Transform data to match component structure
  const barang = useMemo(() => {
    return barangData.map(item => ({
      id: item.id_barang,
      kodedivisi: 'DIV001', // Static for now
      kodebarang: item.kode_barang,
      namabarang: item.nama_barang,
      kodekategori: item.id_kategori,
      satuan: item.satuan,
      hargajual: item.harga_jual,
      hargalist: item.harga_beli, // Assuming harga_list is harga_beli
      stokmin: item.stok_minimum,
      status: item.status === 'aktif' ? true : false,
      merk: item.merk || '-'
    }));
  }, [barangData]);

  const confirm = useConfirmDialog();

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Barang',
      message: `Apakah Anda yakin ingin menghapus barang "${item.namabarang}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      console.log('Delete barang:', item);
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
        onRefresh={() => console.log('Refresh clicked')}
        searchable={true}
        searchFields={['kodebarang', 'namabarang', 'kodekategori', 'merk']}
        keyField="kodebarang"
      />
    </div>
  );
}

export default BarangList;
