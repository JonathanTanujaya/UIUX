import React from 'react';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { customerService } from '../config/apiService.js';
import {
  LoadingSpinner,
  LoadingButton,
  useConfirmDialog,
  EmptyState,
} from './common/LoadingComponents.jsx';

function CustomerList({ onEdit, onRefresh }) {
  const {
    data: customers,
    loading,
    error,
    refresh,
  } = useDataFetch(customerService.getAll, [onRefresh], {
    errorMessage: 'Gagal memuat data pelanggan',
  });

  const { loading: operationLoading, remove } = useCrudOperations(customerService, refresh);
  const { confirmDelete } = useConfirmDialog();

  const handleDelete = async customer => {
    if (!customer.kodedivisi || !customer.kodecust) {
      return;
    }

    const confirmed = confirmDelete(`pelanggan "${customer.namacust || 'ini'}"`);
    if (confirmed) {
      await remove(customer.kodedivisi, customer.kodecust);
    }
  };

  const handleEdit = customer => {
    if (!customer.kodedivisi || !customer.kodecust) {
      return;
    }
    onEdit(customer);
  };

  if (loading) {
    return <LoadingSpinner message="Memuat data pelanggan..." />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
        <div>❌ {error}</div>
        <LoadingButton onClick={refresh} variant="primary" style={{ marginTop: '1rem' }}>
          Coba Lagi
        </LoadingButton>
      </div>
    );
  }

  if (!customers.length) {
    return (
      <EmptyState
        message="Belum ada data pelanggan"
        action={
          <LoadingButton onClick={refresh} variant="primary">
            Refresh
          </LoadingButton>
        }
      />
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ margin: 0 }}>Daftar Pelanggan ({customers.length})</h2>
        <LoadingButton onClick={refresh} variant="secondary" loading={loading}>
          Refresh
        </LoadingButton>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={tableHeaderStyle}>Kode Divisi</th>
              <th style={tableHeaderStyle}>Kode Customer</th>
              <th style={tableHeaderStyle}>Nama Customer</th>
              <th style={tableHeaderStyle}>Area</th>
              <th style={tableHeaderStyle}>Alamat</th>
              <th style={tableHeaderStyle}>Telepon</th>
              <th style={tableHeaderStyle}>Contact</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => {
              const key =
                customer.kodedivisi && customer.kodecust
                  ? `${customer.kodedivisi}-${customer.kodecust}`
                  : `customer-${index}`;

              const isValidData = customer.kodedivisi && customer.kodecust;

              return (
                <tr key={key} style={tableRowStyle}>
                  <td style={tableCellStyle}>{customer.kodedivisi || '-'}</td>
                  <td style={tableCellStyle}>{customer.kodecust || '-'}</td>
                  <td style={tableCellStyle}>{customer.namacust || '-'}</td>
                  <td style={tableCellStyle}>{customer.kodearea || '-'}</td>
                  <td style={tableCellStyle}>{customer.alamat || '-'}</td>
                  <td style={tableCellStyle}>{customer.telp || '-'}</td>
                  <td style={tableCellStyle}>{customer.contact || '-'}</td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: customer.status ? '#27ae60' : '#e74c3c',
                        color: 'white',
                      }}
                    >
                      {customer.status ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <LoadingButton
                        onClick={() => handleEdit(customer)}
                        disabled={!isValidData}
                        variant="primary"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      >
                        Edit
                      </LoadingButton>
                      <LoadingButton
                        onClick={() => handleDelete(customer)}
                        disabled={!isValidData || operationLoading}
                        loading={operationLoading}
                        variant="danger"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      >
                        Hapus
                      </LoadingButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const tableHeaderStyle = {
  padding: '1rem 0.75rem',
  textAlign: 'left',
  fontWeight: '600',
  color: '#2c3e50',
  borderBottom: '2px solid #e9ecef',
};

const tableRowStyle = {
  borderBottom: '1px solid #e9ecef',
  transition: 'background-color 0.2s ease',
};

const tableCellStyle = {
  padding: '0.75rem',
  verticalAlign: 'middle',
};

export default CustomerList;
