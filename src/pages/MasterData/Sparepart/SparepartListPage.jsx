import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditIcon = () => <span>✏️</span>;
import api from '../../../services/api';

function SparepartListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    // Data dummy untuk testing
    const dummyData = [
      {
        kode_barang: 'SPR001',
        nama_barang: 'Filter Oli Mesin',
        kode_kategori: 'FILTER',
        satuan: 'pcs',
        stok: 25,
        min_stok: 10,
        harga_beli: 35000,
        harga_jual: 50000
      },
      {
        kode_barang: 'SPR002',
        nama_barang: 'Brake Pad Depan',
        kode_kategori: 'BRAKE',
        satuan: 'set',
        stok: 8,
        min_stok: 15,
        harga_beli: 120000,
        harga_jual: 180000
      },
      {
        kode_barang: 'SPR003',
        nama_barang: 'Spark Plug NGK',
        kode_kategori: 'ENGINE',
        satuan: 'pcs',
        stok: 0,
        min_stok: 5,
        harga_beli: 25000,
        harga_jual: 40000
      },
      {
        kode_barang: 'SPR004',
        nama_barang: 'Timing Belt',
        kode_kategori: 'ENGINE',
        satuan: 'pcs',
        stok: 12,
        min_stok: 8,
        harga_beli: 85000,
        harga_jual: 125000
      },
      {
        kode_barang: 'SPR005',
        nama_barang: 'Air Filter',
        kode_kategori: 'FILTER',
        satuan: 'pcs',
        stok: 3,
        min_stok: 10,
        harga_beli: 45000,
        harga_jual: 65000
      },
      {
        kode_barang: 'SPR006',
        nama_barang: 'Radiator Coolant',
        kode_kategori: 'COOLANT',
        satuan: 'liter',
        stok: 18,
        min_stok: 5,
        harga_beli: 28000,
        harga_jual: 42000
      },
      {
        kode_barang: 'SPR007',
        nama_barang: 'Disc Brake Rotor',
        kode_kategori: 'BRAKE',
        satuan: 'pcs',
        stok: 6,
        min_stok: 4,
        harga_beli: 350000,
        harga_jual: 480000
      },
      {
        kode_barang: 'SPR008',
        nama_barang: 'Engine Oil 5W-30',
        kode_kategori: 'OIL',
        satuan: 'liter',
        stok: 22,
        min_stok: 15,
        harga_beli: 75000,
        harga_jual: 95000
      }
    ];
    
    setData(dummyData);
    
    // Uncomment untuk menggunakan API
    // api.get('/spareparts').then(res => setData(res.data || []));
  }, []);

  const filteredData = data.filter(item => 
    item.nama_barang?.toLowerCase().includes(search.toLowerCase()) ||
    item.kode_barang?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const getStockBadge = (stok, minStok) => {
    if (stok <= 0) return { text: 'Habis', color: '#ef4444', bg: '#fef2f2' };
    if (stok <= minStok) return { text: 'Sedikit', color: '#f59e0b', bg: '#fffbeb' };
    return { text: 'Normal', color: '#10b981', bg: '#f0fdf4' };
  };

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
            placeholder="Cari sparepart..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/master/sparepart/create')}>Tambah Baru</Button>
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
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Kode
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Nama Sparepart
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Kategori
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Stok
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'right', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Harga Beli
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'right', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Harga Jual
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const stockBadge = getStockBadge(item.stok, item.min_stok);
                return (
                  <tr 
                    key={item.kode_barang} 
                    style={{ 
                      borderBottom: idx < filteredData.length - 1 ? '1px solid #f1f5f9' : 'none',
                      backgroundColor: 'white',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontFamily: 'monospace'
                    }}>
                      {item.kode_barang}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#334155',
                      fontWeight: '500'
                    }}>
                      {item.nama_barang}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#64748b'
                    }}>
                      {item.kode_kategori}
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ 
                          fontSize: '13px',
                          fontWeight: '600', 
                          color: '#1e293b',
                          minWidth: '40px'
                        }}>
                          {item.stok}
                        </span>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: stockBadge.color,
                          backgroundColor: stockBadge.bg,
                          border: `1px solid ${stockBadge.color}20`
                        }}>
                          {stockBadge.text}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#475569',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      {formatCurrency(item.harga_beli)}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#475569',
                      textAlign: 'right',
                      fontWeight: '500'
                    }}>
                      {formatCurrency(item.harga_jual)}
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/master/sparepart/${item.kode_barang}/edit`)}
                        style={{
                          padding: '4px 6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6b7280',
                          borderRadius: '4px',
                          transition: 'all 150ms',
                          fontSize: '14px'
                        }}
                        title="Edit sparepart"
                      >
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div style={{ 
          padding: '16px 20px', 
          backgroundColor: '#f8fafc', 
          borderTop: '1px solid #e2e8f0', 
          fontSize: '14px', 
          color: '#64748b',
          fontWeight: '500'
        }}>
          Menampilkan {filteredData.length} dari {data.length} sparepart
        </div>
      </div>
    </div>
  );
}

export default SparepartListPage;
