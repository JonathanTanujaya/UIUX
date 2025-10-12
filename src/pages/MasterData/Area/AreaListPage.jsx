import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

function AreaListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Data dummy untuk testing
    const dummyData = [
      {
        id: 1,
        kode_area: 'JKT01',
        nama_area: 'Jakarta Utara',
        wilayah: 'DKI Jakarta',
        provinsi: 'DKI Jakarta',
        keterangan: 'Area Jakarta Utara dan sekitarnya',
        status: 'Aktif',
      },
      {
        id: 2,
        kode_area: 'JKT02', 
        nama_area: 'Jakarta Selatan',
        wilayah: 'DKI Jakarta',
        provinsi: 'DKI Jakarta',
        keterangan: 'Area Jakarta Selatan dan sekitarnya',
        status: 'Aktif',
      },
      {
        id: 3,
        kode_area: 'BDG01',
        nama_area: 'Bandung Kota',
        wilayah: 'Jawa Barat',
        provinsi: 'Jawa Barat',
        keterangan: 'Area Bandung Kota',
        status: 'Tidak Aktif',
      },
      {
        id: 4,
        kode_area: 'SBY01',
        nama_area: 'Surabaya Timur',
        wilayah: 'Jawa Timur',
        provinsi: 'Jawa Timur',
        keterangan: 'Area Surabaya bagian Timur',
        status: 'Aktif',
      },
      {
        id: 5,
        kode_area: 'MDN01',
        nama_area: 'Medan Kota',
        wilayah: 'Sumatera Utara',
        provinsi: 'Sumatera Utara', 
        keterangan: 'Area Medan Kota dan sekitarnya',
        status: 'Aktif',
      }
    ];
    
    setData(dummyData);
  }, []);

  const filteredData = data.filter(item => 
    item.nama_area?.toLowerCase().includes(search.toLowerCase()) ||
    item.kode_area?.toLowerCase().includes(search.toLowerCase()) ||
    item.wilayah?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      setData(prev => prev.filter(item => item.id !== id));
      alert('Data berhasil dihapus!');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Aktif' 
      ? { text: 'Aktif', color: '#10b981', bg: '#f0fdf4' }
      : { text: 'Tidak Aktif', color: '#6b7280', bg: '#f9fafb' };
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8fafc', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Search Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151', minWidth: 'fit-content' }}>
              Cari Area:
            </span>
            <Input 
              placeholder="Masukkan nama area, kode area, atau wilayah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
          </div>
          <Button 
            onClick={() => navigate('/master/area/create')}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              padding: '8px 16px',
              fontSize: '14px'
            }}
          >
            Tambah Area
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        height: 'calc(100vh - 140px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ height: '100%', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Kode Area
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Nama Area
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Wilayah
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Provinsi
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'left', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Keterangan
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'center', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Status
                </th>
                <th style={{ 
                  padding: '16px 20px', 
                  textAlign: 'center', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  color: '#475569', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const statusBadge = getStatusBadge(item.status);
                return (
                  <tr 
                    key={item.id}
                    style={{ 
                      borderBottom: index < filteredData.length - 1 ? '1px solid #f1f5f9' : 'none',
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
                      padding: '18px 20px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontFamily: 'monospace'
                    }}>
                      {item.kode_area}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '15px', 
                      color: '#334155',
                      fontWeight: '500'
                    }}>
                      {item.nama_area}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '14px', 
                      color: '#64748b'
                    }}>
                      {item.wilayah}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '14px', 
                      color: '#64748b'
                    }}>
                      {item.provinsi}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '14px', 
                      color: '#64748b', 
                      maxWidth: '200px'
                    }}>
                      {item.keterangan}
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: statusBadge.color,
                        backgroundColor: statusBadge.bg,
                        border: `1px solid ${statusBadge.color}20`
                      }}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/master/area/edit/${item.kode_area}`)}
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
                          title="Edit area"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                          title="Hapus area"
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
              Tidak ada data area yang ditemukan
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
          Menampilkan {filteredData.length} dari {data.length} area
        </div>
      </div>
    </div>
  );
}

export default AreaListPage;