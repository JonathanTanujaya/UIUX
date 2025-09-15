import React from 'react';
import DataTable from '../DataTable/DataTable';
import { useCustomers } from '../../hooks/useApi';
import './DataTable.css';

// Column definitions for customers
const customerColumns = [
  {
    accessorKey: 'kodeCustomer',
    header: 'Customer Code',
    cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
  },
  {
    accessorKey: 'namaCustomer',
    header: 'Customer Name',
    cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span>,
  },
  {
    accessorKey: 'alamat',
    header: 'Address',
    cell: ({ getValue }) => <span className="text-gray-600 text-sm">{getValue()}</span>,
  },
  {
    accessorKey: 'kota',
    header: 'City',
  },
  {
    accessorKey: 'telp',
    header: 'Phone',
    cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
  },
  {
    accessorKey: 'kodeArea',
    header: 'Area',
    cell: ({ getValue }) => (
      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
        {getValue()}
      </span>
    ),
  },
];

const CustomerTable = ({ onCustomerSelect, ...props }) => {
  const { data, isLoading, error } = useCustomers();

  const handleRowClick = customer => {
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };

  return (
    <DataTable
      data={data?.data || []}
      columns={customerColumns}
      loading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      emptyMessage="No customers found"
      loadingMessage="Loading customers..."
      {...props}
    />
  );
};

export default CustomerTable;
