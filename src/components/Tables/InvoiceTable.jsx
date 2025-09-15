import React from 'react';
import DataTable from '../DataTable/DataTable';
import { useInvoices } from '../../hooks/useApi';
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

// Format date helper
const formatDate = dateString => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Column definitions for invoices
const invoiceColumns = [
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
    accessorKey: 'noInvoice',
    header: 'Invoice No',
    cell: ({ getValue }) => (
      <span className="font-mono text-sm font-semibold text-blue-600">{getValue()}</span>
    ),
  },
  {
    accessorKey: 'tglInvoice',
    header: 'Date',
    cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue())}</span>,
  },
  {
    accessorKey: 'kodeCustomer',
    header: 'Customer',
    cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
  },
  {
    accessorKey: 'kodeSales',
    header: 'Sales',
    cell: ({ getValue }) => (
      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
        {getValue()}
      </span>
    ),
  },
  {
    accessorKey: 'totalInvoice',
    header: 'Total Amount',
    cell: ({ getValue }) => (
      <span className="font-semibold text-green-600">{formatCurrency(getValue())}</span>
    ),
  },
  {
    accessorKey: 'statusLunas',
    header: 'Status',
    cell: ({ getValue }) => {
      const isLunas = getValue();
      return (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            isLunas ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {isLunas ? 'LUNAS' : 'PENDING'}
        </span>
      );
    },
  },
  {
    accessorKey: 'tglJatuhTempo',
    header: 'Due Date',
    cell: ({ getValue }) => {
      const dueDate = getValue();
      const isOverdue = dueDate && new Date(dueDate) < new Date() && !getValue('statusLunas');

      return (
        <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
          {formatDate(dueDate)}
        </span>
      );
    },
  },
];

const InvoiceTable = ({ onInvoiceSelect, showDivision = true, filters = {}, ...props }) => {
  const { data, isLoading, error } = useInvoices(filters);

  const handleRowClick = invoice => {
    if (onInvoiceSelect) {
      onInvoiceSelect(invoice);
    }
  };

  // Filter columns based on showDivision prop
  const displayColumns = showDivision
    ? invoiceColumns
    : invoiceColumns.filter(col => col.accessorKey !== 'kodeDivisi');

  return (
    <div className="invoice-table-container">
      {/* Summary Cards */}
      {data?.data && (
        <div className="invoice-summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Invoices</div>
            <div className="summary-value">{data.data.length}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Amount</div>
            <div className="summary-value text-green-600">
              {formatCurrency(
                data.data.reduce((sum, invoice) => sum + (invoice.totalInvoice || 0), 0)
              )}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Outstanding</div>
            <div className="summary-value text-yellow-600">
              {data.data.filter(invoice => !invoice.statusLunas).length}
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Overdue</div>
            <div className="summary-value text-red-600">
              {
                data.data.filter(
                  invoice =>
                    !invoice.statusLunas &&
                    invoice.tglJatuhTempo &&
                    new Date(invoice.tglJatuhTempo) < new Date()
                ).length
              }
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={data?.data || []}
        columns={displayColumns}
        loading={isLoading}
        error={error}
        onRowClick={handleRowClick}
        emptyMessage="No invoices found"
        loadingMessage="Loading invoices..."
        {...props}
      />
    </div>
  );
};

export default InvoiceTable;
