import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { salesAPI } from '../../../services/api';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb'
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a'
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626'
  },
  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b'
  }
};

const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem'
};

const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

const borderRadius = {
  md: '0.375rem',
  lg: 'ha0.5rem'
};

function SalesListPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Fixed 15 items per page

  // Sample dummy data
  const dummySales = [
    {
      kodeSales: 'SLS001',
      namaSales: 'Ahmad Sutanto',
      alamat: 'Jl. Sudirman No. 123, Jakarta',
      noHp: '081234567890',
      target: '50000000',
      status: 'Aktif'
    },
    {
      kodeSales: 'SLS002',
      namaSales: 'Siti Nurhaliza',
      alamat: 'Jl. Thamrin No. 456, Jakarta',
      noHp: '081234567891',
      target: '45000000',
      status: 'Aktif'
    },
    {
      kodeSales: 'SLS003',
      namaSales: 'Budi Santoso',
      alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
      noHp: '081234567892',
      target: '40000000',
      status: 'Nonaktif'
    },
    {
      kodeSales: 'SLS004',
      namaSales: 'Maya Puspita',
      alamat: 'Jl. Kuningan No. 321, Jakarta',
      noHp: '081234567893',
      target: '55000000',
      status: 'Aktif'
    },
    {
      kodeSales: 'SLS005',
      namaSales: 'Indra Wijaya',
      alamat: 'Jl. Menteng No. 654, Jakarta',
      noHp: '081234567894',
      target: '48000000',
      status: 'Aktif'
    },
    {
      kodeSales: 'SLS006',
      namaSales: 'Dewi Lestari',
      alamat: 'Jl. Senopati No. 234, Jakarta',
      noHp: '081234567895',
      target: '42000000',
      status: 'Aktif'
    },
    {
      kodeSales: 'SLS007',
      namaSales: 'Rudi Hermawan',
      alamat: 'Jl. Kemang No. 567, Jakarta',
      noHp: '081234567896',
      target: '38000000',
      status: 'Aktif'
    },
    {
      kodeSales: 'SLS008',
      namaSales: 'Linda Wijaya',
      alamat: 'Jl. Panglima Polim No. 890, Jakarta',
      noHp: '081234567897',
      target: '46000000',
      status: 'Nonaktif'
    }
  ];

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      // Gunakan dummy data untuk sementara
      setSales(dummySales);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setSales(dummySales); // Fallback ke dummy data
      setLoading(false);
    }
  };

  const handleDelete = async (kodeSales) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sales ini?')) {
      try {
        // await salesAPI.delete(kodeSales);
        // Remove from dummy data
        setSales(sales.filter(s => s.kodeSales !== kodeSales));
      } catch (error) {
        console.error('Error deleting sales:', error);
      }
    }
  };

  const filteredSales = sales.filter(
    sale =>
      (sale.namaSales || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.kodeSales || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const isActive = status === 'Aktif' || status === true || status === 1;
    return (
      <span style={{
        padding: `${spacing[1]} ${spacing[3]}`,
        borderRadius: borderRadius.md,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        backgroundColor: isActive ? colors.green[100] : colors.red[100],
        color: isActive ? colors.green[600] : colors.red[600]
      }}>
        {isActive ? 'Aktif' : 'Nonaktif'}
      </span>
    );
  };

  const tableHeaderStyle = {
    padding: `${spacing[3]} ${spacing[4]}`,
    textAlign: 'left',
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.sm,
    color: colors.gray[900],
    backgroundColor: colors.gray[50],
    borderBottom: `1px solid ${colors.gray[200]}`
  };

  const tableCellStyle = {
    padding: `${spacing[3]} ${spacing[4]}`,
    borderBottom: `1px solid ${colors.gray[200]}`,
    fontSize: typography.fontSize.sm,
    color: colors.gray[900]
  };

  const tableRowStyle = {
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  };

  if (loading) {
    return (
      <div style={{ 
        padding: spacing[6], 
        backgroundColor: colors.gray[50], 
        height: '100vh', 
        overflow: 'hidden' 
      }}>
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <div style={{ fontSize: typography.fontSize.lg, color: colors.gray[600] }}>
            Memuat data sales...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#f9fafb',
      height: '100%'
    }}>
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            height: '40px',
            padding: '0 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            width: '300px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={() => navigate('/master/sales/create')}
          style={{
            height: '40px',
            padding: '0 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Sales
        </button>
      </div>

      {/* Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px', width: '60px' }}>No</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Kode Sales</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Nama Sales</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Alamat</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>No HP</th>
                <th style={{ padding: '6px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Target</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px', width: '120px' }}>Status</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px', width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    {searchTerm ? 'Tidak ada sales yang ditemukan' : 'Belum ada data sales'}
                  </td>
                </tr>
              ) : (
                currentItems.map((sale, index) => {
                  const statusBadge = sale.status === 'Aktif' 
                    ? { text: 'Aktif', color: '#10b981', bg: '#f0fdf4' }
                    : { text: 'Tidak Aktif', color: '#6b7280', bg: '#f9fafb' };
                  const rowNumber = indexOfFirstItem + index + 1;
                  return (
                    <tr
                      key={sale.kodeSales}
                      style={{ 
                        borderBottom: index < currentItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                        backgroundColor: 'white',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b', textAlign: 'center', fontWeight: '500' }}>{rowNumber}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>{sale.kodeSales}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#334155', fontWeight: '500' }}>{sale.namaSales}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b', maxWidth: '250px' }}>{sale.alamat}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b' }}>{sale.noHp}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#475569', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(sale.target)}</td>
                      <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '16px', fontSize: '11px', fontWeight: '600', color: statusBadge.color, backgroundColor: statusBadge.bg, border: `1px solid ${statusBadge.color}20` }}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button onClick={() => navigate(`/master/sales/edit/${sale.kodeSales}`)} style={{ padding: '4px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px', transition: 'all 150ms', fontSize: '14px' }} title="Edit sales">
                            <EditIcon />
                          </button>
                          <button onClick={() => handleDelete(sale.kodeSales)} style={{ padding: '4px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px', transition: 'all 150ms', fontSize: '14px' }} title="Hapus sales">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Only show when more than 15 items */}
        {filteredSales.length > 15 && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                backgroundColor: currentPage === 1 ? '#f1f5f9' : 'white',
                color: currentPage === 1 ? '#94a3b8' : '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 150ms'
              }}
            >
              ‹ Prev
            </button>

            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: currentPage === pageNum ? '#3b82f6' : 'white',
                    color: currentPage === pageNum ? 'white' : '#475569',
                    border: `1px solid ${currentPage === pageNum ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    minWidth: '36px',
                    transition: 'all 150ms'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNum) {
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNum) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {pageNum}
                </button>
              )
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                backgroundColor: currentPage === totalPages ? '#f1f5f9' : 'white',
                color: currentPage === totalPages ? '#94a3b8' : '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 150ms'
              }}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesListPage;