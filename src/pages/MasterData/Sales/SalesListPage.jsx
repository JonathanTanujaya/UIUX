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
  lg: '0.5rem'
};

function SalesListPage() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      backgroundColor: '#f9fafb', 
      minHeight: '100vh' 
    }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', flex: 1 }}>
          <Input
            type="text"
            placeholder="Cari sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/master/sales/create')}>Tambah Baru</Button>
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
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>No</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Kode Sales</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Nama Sales</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Alamat</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>No HP</th>
                <th style={{ padding: '6px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Target</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Status</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Aksi</th>
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
                filteredSales.map((sale, index) => {
                  const statusBadge = sale.status === 'Aktif' 
                    ? { text: 'Aktif', color: '#10b981', bg: '#f0fdf4' }
                    : { text: 'Tidak Aktif', color: '#6b7280', bg: '#f9fafb' };
                  return (
                    <tr
                      key={sale.kodeSales}
                      style={{ 
                        borderBottom: index < filteredSales.length - 1 ? '1px solid #f1f5f9' : 'none',
                        backgroundColor: 'white',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b' }}>{index + 1}</td>
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
        
        {/* Footer */}
        <div style={{ padding: '16px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
          Menampilkan {filteredSales.length} dari {sales.length} sales
        </div>
      </div>
    </div>
  );
}

export default SalesListPage;