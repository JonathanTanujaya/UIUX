import React from 'react';
import { useDataFetch, useCrudOperations } from '../hooks/useDataFetch.js';
import { salesService } from '../config/apiService.js';
import {
  LoadingSpinner,
  LoadingButton,
  useConfirmDialog,
  EmptyState,
} from './common/LoadingComponents.jsx';

function SalesList({ onEdit, onRefresh }) {
  const {
    data: sales,
    loading,
    error,
    refresh,
  } = useDataFetch(salesService.getAll, [onRefresh], { errorMessage: 'Gagal memuat data sales' });

  const { loading: operationLoading, remove } = useCrudOperations(salesService, refresh);
  const { confirmDelete } = useConfirmDialog();

  const handleDelete = async sale => {
    if (!sale.kodedivisi || !sale.kodesales) {
      return;
    }

    const confirmed = confirmDelete(`sales "${sale.namasales || 'ini'}"`);
    if (confirmed) {
      await remove(sale.kodedivisi, sale.kodesales);
    }
  };

  const handleEdit = sale => {
    if (!sale.kodedivisi || !sale.kodesales) {
      return;
    }
    onEdit(sale);
  };

  if (loading) {
    return <LoadingSpinner message="Memuat data sales..." />;
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

  if (!sales.length) {
    return (
      <EmptyState
        message="Belum ada data sales"
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
        <h2 style={{ margin: 0 }}>Daftar Sales ({sales.length})</h2>
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
              <th style={tableHeaderStyle}>Kode Sales</th>
              <th style={tableHeaderStyle}>Nama Sales</th>
              <th style={tableHeaderStyle}>Alamat</th>
              <th style={tableHeaderStyle}>No HP</th>
              <th style={tableHeaderStyle}>Target</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => {
              const key =
                sale.kodedivisi && sale.kodesales
                  ? `${sale.kodedivisi}-${sale.kodesales}`
                  : `sale-${index}`;

              const isValidData = sale.kodedivisi && sale.kodesales;

              return (
                <tr key={key} style={tableRowStyle}>
                  <td style={tableCellStyle}>{sale.kodedivisi || '-'}</td>
                  <td style={tableCellStyle}>{sale.kodesales || '-'}</td>
                  <td style={tableCellStyle}>{sale.namasales || '-'}</td>
                  <td style={tableCellStyle}>{sale.alamat || '-'}</td>
                  <td style={tableCellStyle}>{sale.nohp || '-'}</td>
                  <td style={tableCellStyle}>
                    {sale.target ? new Intl.NumberFormat('id-ID').format(sale.target) : '0'}
                  </td>
                  <td style={tableCellStyle}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: sale.status ? '#27ae60' : '#e74c3c',
                        color: 'white',
                      }}
                    >
                      {sale.status ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <LoadingButton
                        onClick={() => handleEdit(sale)}
                        disabled={!isValidData}
                        variant="primary"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      >
                        Edit
                      </LoadingButton>
                      <LoadingButton
                        onClick={() => handleDelete(sale)}
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

export default SalesList;
