import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

function SupplierListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Fixed 15 items per page

  useEffect(() => {
    // Data dummy untuk testing
    const dummyData = [
      {
        id: 1,
        kode_supplier: 'SUP001',
        nama_supplier: 'PT. Supplier Utama',
        alamat: 'Jl. Raya No. 123, Jakarta',
        telepon: '021-1234567',
        no_telpon: '081234567890',
        email: 'contact@supplierutama.com',
        kontak_person: 'Budi Santoso',
        status: 'aktif'
      },
      {
        id: 2,
        kode_supplier: 'SUP002',
        nama_supplier: 'CV. Mitra Sejati',
        alamat: 'Jl. Sudirman No. 456, Bandung',
        telepon: '022-7654321',
        no_telpon: '081234567891',
        email: 'info@mitrasejati.com',
        kontak_person: 'Sari Dewi',
        status: 'aktif'
      },
      {
        id: 3,
        kode_supplier: 'SUP003',
        nama_supplier: 'UD. Berkah Jaya',
        alamat: 'Jl. Ahmad Yani No. 789, Surabaya',
        telepon: '031-9876543',
        no_telpon: '081234567892',
        email: 'admin@berkahjaya.com',
        kontak_person: 'Ahmad Rizki',
        status: 'nonaktif'
      },
      {
        id: 4,
        kode_supplier: 'SUP004',
        nama_supplier: 'PT. Global Supply',
        alamat: 'Jl. Gatot Subroto No. 321, Jakarta',
        telepon: '021-5555666',
        no_telpon: '081234567893',
        email: 'cs@globalsupply.com',
        kontak_person: 'Diana Putri',
        status: 'aktif'
      },
      {
        id: 5,
        kode_supplier: 'SUP005',
        nama_supplier: 'CV. Prima Mandiri',
        alamat: 'Jl. Diponegoro No. 654, Yogyakarta',
        telepon: '0274-888999',
        no_telpon: '081234567894',
        email: 'hello@primamandiri.com',
        kontak_person: 'Eko Prasetyo',
        status: 'aktif'
      },
      {
        id: 6,
        kode_supplier: 'SUP006',
        nama_supplier: 'PT. Sentosa Jaya',
        alamat: 'Jl. Veteran No. 111, Semarang',
        telepon: '024-7777888',
        no_telpon: '081234567895',
        email: 'info@sentosajaya.com',
        kontak_person: 'Linda Wijaya',
        status: 'aktif'
      },
      {
        id: 7,
        kode_supplier: 'SUP007',
        nama_supplier: 'CV. Cahaya Abadi',
        alamat: 'Jl. Merdeka No. 222, Medan',
        telepon: '061-6666777',
        no_telpon: '081234567896',
        email: 'contact@cahayaabadi.com',
        kontak_person: 'Rudi Hermawan',
        status: 'aktif'
      },
      {
        id: 8,
        kode_supplier: 'SUP008',
        nama_supplier: 'UD. Makmur Sejahtera',
        alamat: 'Jl. Pahlawan No. 333, Makassar',
        telepon: '0411-5555444',
        no_telpon: '081234567897',
        email: 'admin@makmursejahtera.com',
        kontak_person: 'Dewi Lestari',
        status: 'nonaktif'
      }
    ];
    setData(dummyData);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const filteredData = data.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.kode_supplier?.toLowerCase().includes(searchLower) ||
      item.nama_supplier?.toLowerCase().includes(searchLower) ||
      item.alamat?.toLowerCase().includes(searchLower) ||
      item.kontak_person?.toLowerCase().includes(searchLower)
    );
  });

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

  const getStatusBadge = (status) => {
    return status === 'aktif' 
      ? { text: 'Aktif', color: '#10b981', bg: '#f0fdf4' }
      : { text: 'Tidak Aktif', color: '#6b7280', bg: '#f9fafb' };
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh' 
    }}>
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          onClick={() => navigate('/master/supplier/create')}
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
          Tambah Supplier
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
                  Kode Supplier
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
                  Nama Supplier
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
                  Alamat
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
                  No Telpon
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
                  Kontak Person
                </th>
                <th style={{ 
                  padding: '6px 12px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  width: '120px'
                }}>
                  Status
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
                const statusBadge = getStatusBadge(item.status);
                const rowNumber = indexOfFirstItem + idx + 1;
                return (
                  <tr
                    key={item.id}
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
                      fontSize: '13px', 
                      color: '#64748b',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {rowNumber}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontFamily: 'monospace'
                    }}>
                      {item.kode_supplier}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#334155',
                      fontWeight: '500'
                    }}>
                      {item.nama_supplier}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#64748b',
                      maxWidth: '300px'
                    }}>
                      {item.alamat}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#64748b'
                    }}>
                      {item.no_telpon}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#64748b'
                    }}>
                      {item.kontak_person}
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '16px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: statusBadge.color,
                        backgroundColor: statusBadge.bg,
                        border: `1px solid ${statusBadge.color}20`
                      }}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/master/supplier/edit/${item.kode_supplier}`)}
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
                          title="Edit supplier"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                          title="Hapus supplier"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#64748b',
              fontSize: '14px'
            }}>
              Tidak ada data supplier yang ditemukan
            </div>
          )}
        </div>
        
        {/* Pagination - Only show when more than 15 items */}
  {filteredData.length > 0 && (
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

export default SupplierListPage;