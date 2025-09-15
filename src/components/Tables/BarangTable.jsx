import React from 'react';
import DataTable from '../DataTable/DataTable';
import { useBarang } from '../../hooks/useApi';
import './DataTable.css';

// Format currency helper
const formatCurrency = value => {
  if (!value) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

// Column definitions for barang/products
const barangColumns = [
  {
    accessorKey: 'kodeDivisi',
    header: 'Division',
    cell: ({ getValue }) => (
      <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'kodeBarang',
    header: 'Product Code',
    cell: ({ getValue }) => <span className="font-mono text-sm font-semibold">{getValue()}</span>,
  },
  {
    accessorKey: 'namaBarang',
    header: 'Product Name',
    cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span>,
  },
  {
    accessorKey: 'kodeKategori',
    header: 'Category',
    cell: ({ getValue }) => (
      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'hargaJual',
    header: 'Sale Price',
    cell: ({ getValue }) => (
      <span className="font-semibold text-green-600">{formatCurrency(getValue())}</span>
    ),
  },
  {
    accessorKey: 'hargaBeli',
    header: 'Purchase Price',
    cell: ({ getValue }) => <span className="text-gray-600">{formatCurrency(getValue())}</span>,
  },
  {
    accessorKey: 'stok',
    header: 'Stock',
    cell: ({ getValue }) => {
      const stock = getValue() || 0;
      const stockClass =
        stock <= 0
          ? 'text-red-600 bg-red-50'
          : stock <= 10
            ? 'text-yellow-600 bg-yellow-50'
            : 'text-green-600 bg-green-50';

      return (
        <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${stockClass}`}>
          {stock}
        </span>
      );
    },
  },
  {
    accessorKey: 'satuan',
    header: 'Unit',
    cell: ({ getValue }) => <span className="text-gray-500 text-sm">{getValue()}</span>,
  },
];

const BarangTable = ({ onBarangSelect, showDivision = true, divisionFilter = null, ...props }) => {
  const { data, isLoading, error } = useBarang({
    kodeDivisi: divisionFilter,
  });

  const handleRowClick = barang => {
    if (onBarangSelect) {
      onBarangSelect(barang);
    }
  };

  // Filter columns based on showDivision prop
  const displayColumns = showDivision
    ? barangColumns
    : barangColumns.filter(col => col.accessorKey !== 'kodeDivisi');

  return (
    <DataTable
      data={data?.data || []}
      columns={displayColumns}
      loading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      emptyMessage="No products found"
      loadingMessage="Loading products..."
      {...props}
    />
  );
};

export default BarangTable;
