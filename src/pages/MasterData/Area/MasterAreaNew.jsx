import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MasterAreaNew = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    kode_area: '',
    nama_area: '',
    wilayah: '',
    provinsi: '',
    keterangan: '',
    status: 'Aktif',
  });

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

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing
        const updatedData = data.map(item => 
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        );
        setData(updatedData);
      } else {
        // Add new
        const newItem = { ...formData, id: Date.now() };
        setData([...data, newItem]);
      }
      resetForm();
      alert(editingItem ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving area:', error);
      alert('Error saving area');
    }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      setData(prev => prev.filter(item => item.id !== id));
      alert('Data berhasil dihapus!');
    }
  };

  const resetForm = () => {
    setFormData({
      kode_area: '',
      nama_area: '',
      wilayah: '',
      provinsi: '',
      keterangan: '',
      status: 'Aktif',
    });
    setEditingItem(null);
    setShowForm(false);
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
      minHeight: '100vh' 
    }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ maxWidth: '400px', flex: 1 }}>
          <Input 
            placeholder="Cari area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Tutup Form' : 'Tambah Area'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
            {editingItem ? 'Edit Area' : 'Tambah Area Baru'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <Input
                label="Kode Area"
                name="kode_area"
                value={formData.kode_area}
                onChange={handleInputChange}
                placeholder="JKT01"
                required
              />
              <Input
                label="Nama Area"
                name="nama_area"
                value={formData.nama_area}
                onChange={handleInputChange}
                placeholder="Jakarta Utara"
                required
              />
              <Input
                label="Wilayah"
                name="wilayah"
                value={formData.wilayah}
                onChange={handleInputChange}
                placeholder="DKI Jakarta"
                required
              />
              <Select
                label="Provinsi"
                name="provinsi"
                value={formData.provinsi}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Provinsi</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Sumatera Selatan">Sumatera Selatan</option>
                <option value="Kalimantan Timur">Kalimantan Timur</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
              </Select>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </Select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '6px' 
              }}>
                Keterangan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
                placeholder="Masukkan keterangan area..."
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
            <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
              <Button type="submit">
                {editingItem ? 'Update Area' : 'Simpan Area'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

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
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '14px', 
                      color: '#64748b',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.keterangan}
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(item)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#3b82f6',
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#3b82f6';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#3b82f6';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#eff6ff';
                            e.target.style.color = '#3b82f6';
                            e.target.style.borderColor = '#bfdbfe';
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#ef4444';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#ef4444';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fef2f2';
                            e.target.style.color = '#ef4444';
                            e.target.style.borderColor = '#fecaca';
                          }}
                        >
                          Hapus
                        </button>
                      </div>
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
          Menampilkan {filteredData.length} dari {data.length} area
        </div>
      </div>
    </div>
  );
};

export default MasterAreaNew;