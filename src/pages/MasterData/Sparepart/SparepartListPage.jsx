import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditIcon = () => <span>✏️</span>;
const SearchIcon = () => <span>🔍</span>;
import api from '../../../services/api';

function SparepartListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Fixed 15 items per page
  
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
      padding: '24px', 
      backgroundColor: '#f9fafb', 
      minHeight: 'calc(100vh - 60px)',
      paddingTop: '16px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Cari sparepart..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '40px',
              padding: '0 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              backgroundColor: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <button
          onClick={() => navigate('/master/sparepart/create')}
          style={{
            height: '40px',
            padding: '0 20px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#3b82f6';
          }}
        >
          Tambah Baru
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
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  width: '60px'
                }}>
                  No
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
                  letterSpacing: '0.3px',
                  width: '100px'
                }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => {
                const stockBadge = getStockBadge(item.stok, item.min_stok);
                return (
                  <tr 
                    key={item.kode_barang} 
                    style={{ 
                      borderBottom: idx < currentItems.length - 1 ? '1px solid #f1f5f9' : 'none',
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
                      textAlign: 'center',
                      fontSize: '13px', 
                      color: '#64748b'
                    }}>
                      {indexOfFirstItem + idx + 1}
                    </td>
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
                          padding: '5px 7px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#3b82f6',
                          borderRadius: '4px',
                          transition: 'all 150ms',
                          fontSize: '14px',
                          minWidth: '26px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto'
                        }}
                        title="Edit sparepart"
                        onMouseEnter={(e) => {
                          e.target.style.color = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#3b82f6';
                        }}
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
        
        {/* Footer with Pagination - only show if more than 15 items */}
        {filteredData.length > 15 && (
          <div style={{ 
            padding: '10px 12px', 
            borderTop: '1px solid #e5e7eb', 
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '4px',
              alignItems: 'center'
            }}>
              {/* Previous Button */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: currentPage === 1 ? '#cbd5e1' : '#475569',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} style={{ 
                    padding: '6px 8px',
                    color: '#94a3b8',
                    fontSize: '13px'
                  }}>
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: currentPage === page ? 'white' : '#475569',
                      backgroundColor: currentPage === page ? '#3b82f6' : 'white',
                      border: `1px solid ${currentPage === page ? '#3b82f6' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      minWidth: '36px'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.target.style.backgroundColor = '#f1f5f9';
                        e.target.style.borderColor = '#cbd5e1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#e2e8f0';
                      }
                    }}
                  >
                    {page}
                  </button>
                )
              ))}

              {/* Next Button */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.backgroundColor = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SparepartListPage;
