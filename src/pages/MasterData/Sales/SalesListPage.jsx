import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
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
      padding: spacing[6], 
      backgroundColor: colors.gray[50], 
      height: '100vh', 
      overflow: 'hidden' 
    }}>
      {/* Header Actions */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], maxWidth: '400px' }}>
            <label style={{ 
              fontWeight: typography.fontWeight.medium,
              fontSize: typography.fontSize.sm,
              color: colors.gray[700],
              minWidth: '80px'
            }}>
              Pencarian:
            </label>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Cari sales (kode/nama)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  padding: `${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[10]}`,
                  fontSize: typography.fontSize.sm,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: borderRadius.md,
                  outline: 'none',
                }}
              />
              <div style={{ position: 'absolute', left: spacing[3], top: '50%', transform: 'translateY(-50%)', color: colors.gray[400] }}>
                🔍
              </div>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/master/sales/create')}
            style={{
              backgroundColor: colors.primary[500],
              color: 'white',
              padding: `${spacing[2]} ${spacing[4]}`,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              borderRadius: borderRadius.md,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ➕ Tambah Sales
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card padding="0">
        <div style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: colors.gray[50], zIndex: 1 }}>
              <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                <th style={tableHeaderStyle}>No</th>
                <th style={tableHeaderStyle}>Kode Sales</th>
                <th style={tableHeaderStyle}>Nama Sales</th>
                <th style={tableHeaderStyle}>Alamat</th>
                <th style={tableHeaderStyle}>No HP</th>
                <th style={tableHeaderStyle}>Target</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ 
                    ...tableCellStyle, 
                    textAlign: 'center', 
                    padding: spacing[6],
                    color: colors.gray[500]
                  }}>
                    {searchTerm ? 'Tidak ada sales yang ditemukan' : 'Belum ada data sales'}
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale, index) => (
                  <tr
                    key={`${sale.kodeDivisi}-${sale.kodeSales}`}
                    style={tableRowStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.gray[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>{sale.kodeSales}</td>
                    <td style={{ ...tableCellStyle, fontWeight: typography.fontWeight.medium }}>
                      {sale.namaSales}
                    </td>
                    <td style={tableCellStyle}>{sale.alamat}</td>
                    <td style={tableCellStyle}>{sale.noHp}</td>
                    <td style={tableCellStyle}>{formatCurrency(sale.target)}</td>
                    <td style={tableCellStyle}>{getStatusBadge(sale.status)}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/master/sales/edit/${sale.kodeSales}`)}
                          style={{
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            borderRadius: '6px',
                            transition: 'all 150ms',
                            fontSize: '16px'
                          }}
                          title="Edit sales"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.kodeSales)}
                          style={{
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            borderRadius: '6px',
                            transition: 'all 150ms',
                            fontSize: '16px'
                          }}
                          title="Hapus sales"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default SalesListPage;