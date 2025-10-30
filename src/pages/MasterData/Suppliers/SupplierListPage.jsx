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

  useEffect(() => {
    // Data dummy untuk testing
    const dummyData = [
      {
        id: 1,
        kode_supplier: 'SUP001',
        nama_supplier: 'PT. Supplier Utama',
        alamat: 'Jl. Raya No. 123, Jakarta',
        telepon: '021-1234567',
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
        email: 'hello@primamandiri.com',
        kontak_person: 'Eko Prasetyo',
        status: 'aktif'
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', flex: 1 }}>
          <Input
            type="text"
            placeholder="Cari supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/master/supplier/create')}>Tambah Baru</Button>
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
                  Kontak Person
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
                  Status
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
                const statusBadge = getStatusBadge(item.status);
                return (
                  <tr
                    key={item.id}
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
        
        {/* Footer */}
        <div style={{ 
          padding: '16px 20px', 
          backgroundColor: '#f8fafc', 
          borderTop: '1px solid #e2e8f0', 
          fontSize: '14px', 
          color: '#64748b',
          fontWeight: '500'
        }}>
          Menampilkan {filteredData.length} dari {data.length} supplier
        </div>
      </div>
    </div>
  );
}

export default SupplierListPage;