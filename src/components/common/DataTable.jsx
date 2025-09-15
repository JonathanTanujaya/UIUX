import React, { useState, useMemo } from 'react';
import { LoadingButton, EmptyState } from './LoadingComponents.jsx';

/**
 * Generic Data Table Component
 * Komponen table yang dapat digunakan ulang untuk semua list data dengan fitur sorting
 */
const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  error = null,
  onRefresh,
  onEdit,
  onDelete,
  keyExtractor,
  renderActions,
  emptyMessage = 'Belum ada data',
  operationLoading = false,
  sortable = true,
  defaultSort = null,
  searchable = false,
  searchFields = [],
  keyField = 'id',
}) => {
  const [sortBy, setSortBy] = useState(
    defaultSort?.field || (columns.length > 0 ? columns[0].key || columns[0].accessor : null)
  );
  const [sortDirection, setSortDirection] = useState(defaultSort?.direction || 'asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sorting
  const handleSort = field => {
    if (!sortable) return;

    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = field => {
    if (!sortable || sortBy !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];
    let filtered = [...safeData];

    // Apply search filter
    if (searchable && searchTerm) {
      filtered = filtered.filter(item => {
        if (searchFields.length > 0) {
          return searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
          });
        } else {
          // Search all fields if no specific fields provided
          return Object.values(item).some(
            value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }

    // Apply sorting
    if (sortable && sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aStr = aValue.toString().toLowerCase();
        const bStr = bValue.toString().toLowerCase();

        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [data, searchTerm, sortBy, sortDirection, searchable, searchFields, sortable]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
        <div>❌ {error}</div>
        <LoadingButton onClick={onRefresh} variant="primary" style={{ marginTop: '1rem' }}>
          Coba Lagi
        </LoadingButton>
      </div>
    );
  }

  if (!processedData.length && !searchTerm) {
    return (
      <EmptyState
        message={emptyMessage}
        action={
          <LoadingButton onClick={onRefresh} variant="primary">
            Refresh
          </LoadingButton>
        }
      />
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2 style={{ margin: 0 }}>
          {title} ({processedData.length})
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {searchable && (
            <input
              type="text"
              placeholder="Cari..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            />
          )}
          <LoadingButton onClick={onRefresh} variant="secondary" loading={loading}>
            Refresh
          </LoadingButton>
        </div>
      </div>

      {/* Search Results Info */}
      {searchable && searchTerm && (
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
          {processedData.length === 0
            ? `Tidak ada hasil untuk "${searchTerm}"`
            : `Menampilkan ${processedData.length} hasil untuk "${searchTerm}"`}
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              {columns.map((column, index) => {
                const field = column.key || column.accessor;
                const isClickable = sortable && field;

                return (
                  <th
                    key={index}
                    style={{
                      ...tableHeaderStyle,
                      cursor: isClickable ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={() => isClickable && handleSort(field)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {column.header}
                      {isClickable && (
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          {getSortIcon(field)}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              <th style={tableHeaderStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => {
              const key = keyExtractor
                ? keyExtractor(item, index)
                : item[keyField] || `item-${index}`;
              const isValidData = keyExtractor
                ? keyExtractor(item, index) !== `item-${index}`
                : !!item[keyField];

              return (
                <tr key={key} style={tableRowStyle} className="table-row-hover">
                  {columns.map((column, colIndex) => {
                    const value = item[column.key || column.accessor];
                    return (
                      <td key={colIndex} style={{ ...tableCellStyle, ...(column.style || {}) }}>
                        {column.render
                          ? column.render(value, item)
                          : value !== null && value !== undefined
                            ? value
                            : '-'}
                      </td>
                    );
                  })}
                  <td style={tableCellStyle}>
                    {renderActions ? (
                      renderActions(item, isValidData, operationLoading)
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <LoadingButton
                          onClick={() => onEdit && onEdit(item)}
                          disabled={!isValidData}
                          variant="primary"
                          style={actionButtonStyle}
                        >
                          Edit
                        </LoadingButton>
                        <LoadingButton
                          onClick={() => onDelete && onDelete(item)}
                          disabled={!isValidData || operationLoading}
                          loading={operationLoading}
                          variant="danger"
                          style={actionButtonStyle}
                        >
                          Hapus
                        </LoadingButton>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No Results for Search */}
      {searchable && searchTerm && processedData.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div>Tidak ada data yang sesuai dengan pencarian Anda</div>
          <button
            onClick={() => setSearchTerm('')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Hapus Filter
          </button>
        </div>
      )}
    </div>
  );
};

// Styles
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const tableHeaderStyle = {
  padding: '1rem 0.75rem',
  textAlign: 'left',
  fontWeight: '600',
  color: '#2c3e50',
  borderBottom: '2px solid #e9ecef',
  transition: 'background-color 0.2s ease',
};

const tableRowStyle = {
  borderBottom: '1px solid #e9ecef',
  transition: 'background-color 0.2s ease',
};

const tableCellStyle = {
  padding: '0.75rem',
  verticalAlign: 'middle',
};

const actionButtonStyle = {
  fontSize: '0.8rem',
  padding: '0.25rem 0.5rem',
};

// Add CSS for hover effects
const injectHoverStyles = () => {
  if (document.getElementById('datatable-hover-styles')) return;

  const style = document.createElement('style');
  style.id = 'datatable-hover-styles';
  style.textContent = `
    .table-row-hover:hover {
      background-color: #f8f9fa !important;
      cursor: pointer;
    }
    
    .table-header-sortable:hover {
      background-color: #e9ecef !important;
    }
    
    .table-row-hover:nth-child(even) {
      background-color: rgba(0,0,0,0.02);
    }
    
    .table-row-hover:nth-child(even):hover {
      background-color: #f8f9fa !important;
    }
  `;
  document.head.appendChild(style);
};

// Inject styles when component loads
if (typeof window !== 'undefined') {
  injectHoverStyles();
}

/**
 * Status Badge Component
 */
export const StatusBadge = ({ active, activeText = 'Aktif', inactiveText = 'Tidak Aktif' }) => (
  <span
    style={{
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      backgroundColor: active ? '#27ae60' : '#e74c3c',
      color: 'white',
    }}
  >
    {active ? activeText : inactiveText}
  </span>
);

/**
 * Currency formatter
 */
export const formatCurrency = amount => {
  return new Intl.NumberFormat('id-ID').format(amount || 0);
};

export default DataTable;
