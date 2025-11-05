import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../../styles/designTokens';
import { api } from '../../../services/api';

const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>📝</span>;
const TrashIcon = () => <span>🗑️</span>;
const XIcon = () => <span>✖️</span>;

const ModernMasterCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    kode_kategori: '',
    nama_kategori: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const data = response.data || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing
      console.log('Updating category:', editingId, formData);
      setCategories(categories.map(cat => 
        cat.kode_kategori === editingId 
          ? { ...cat, ...formData }
          : cat
      ));
    } else {
      // Add new
      console.log('Adding category:', formData);
      setCategories([...categories, { ...formData }]);
    }
    
    resetForm();
    setIsModalOpen(false);
  };

  const handleEdit = (category) => {
    setEditingId(category.kode_kategori);
    setFormData({
      kode_kategori: category.kode_kategori,
      nama_kategori: category.nama_kategori
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleDelete = (kodeKategori) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      console.log('Deleting category:', kodeKategori);
      setCategories(categories.filter(cat => cat.kode_kategori !== kodeKategori));
    }
  };

  const resetForm = () => {
    setFormData({ kode_kategori: '', nama_kategori: '' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.nama_kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.kode_kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      padding: spacing[6], 
      backgroundColor: colors.gray[50], 
      height: '100%' 
    }}>
      {/* Search and Button in one row */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: spacing[4]
        }}>
          {/* Search - Left */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing[2],
            flex: 1,
            maxWidth: '400px'
          }}>
            <label style={{ 
              fontWeight: typography.fontWeight.medium,
              fontSize: typography.fontSize.sm,
              color: colors.gray[700],
              minWidth: '80px'
            }}>
              Pencarian:
            </label>
            <div style={{ 
              position: 'relative', 
              flex: 1
            }}>
              <input
                type="text"
                placeholder="Cari kategori (kode/nama)..."
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
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Add Button - Right */}
          <Button onClick={handleAdd} icon={<PlusIcon />}>
            Tambah Kategori
          </Button>
        </div>
      </Card>

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
                  Kode Kategori
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
                  Nama Kategori
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
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ 
                    padding: '12px 12px', 
                    textAlign: 'center', 
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    Loading data...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ 
                    padding: '12px 12px', 
                    textAlign: 'center', 
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    {searchTerm ? 'Tidak ada kategori yang sesuai pencarian' : 'Belum ada data kategori'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr 
                    key={category.kode_kategori || index} 
                    style={{ 
                      borderBottom: index < filteredCategories.length - 1 ? '1px solid #f1f5f9' : 'none',
                      backgroundColor: editingId === category.kode_kategori ? '#eff6ff' : 'white',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (editingId !== category.kode_kategori) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (editingId !== category.kode_kategori) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <td style={{ 
                      padding: '6px 12px', 
                      textAlign: 'center',
                      fontSize: '13px', 
                      color: '#64748b'
                    }}>
                      {index + 1}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontFamily: 'monospace'
                    }}>
                      {category.kode_kategori}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '14px', 
                      color: '#334155',
                      fontWeight: '500'
                    }}>
                      {category.nama_kategori}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button 
                          style={{
                            padding: '4px 6px',
                            backgroundColor: 'transparent',
                            color: '#3b82f6',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease',
                            minWidth: '24px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => handleEdit(category)}
                          title="Edit kategori"
                          onMouseEnter={(e) => {
                            e.target.style.color = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#3b82f6';
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button 
                          style={{
                            padding: '4px 6px',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease',
                            minWidth: '24px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => handleDelete(category.kode_kategori)}
                          title="Hapus kategori"
                          onMouseEnter={(e) => {
                            e.target.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#ef4444';
                          }}
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

        {/* Footer Info */}
        <div style={{ 
          padding: '6px 12px', 
          borderTop: '1px solid #e5e7eb', 
          backgroundColor: '#f8fafc',
          fontSize: '13px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Total: <strong style={{ color: '#1e293b' }}>{filteredCategories.length}</strong> kategori
          {searchTerm && ` (hasil pencarian untuk "${searchTerm}")`}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            maxWidth: '500px',
            margin: '16px'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {editingId ? '✏️ Edit Kategori' : '➕ Tambah Kategori Baru'}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Kode Kategori */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Kode Kategori <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="kode_kategori"
                    value={formData.kode_kategori}
                    onChange={(e) => setFormData({ ...formData, kode_kategori: e.target.value })}
                    placeholder="Contoh: KAT001"
                    required
                    disabled={!!editingId}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      backgroundColor: editingId ? '#f3f4f6' : 'white',
                      color: '#111827'
                    }}
                    onFocus={(e) => {
                      if (!editingId) {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Nama Kategori */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Nama Kategori <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_kategori"
                    value={formData.nama_kategori}
                    onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                    placeholder="Contoh: Elektronik"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      outline: 'none',
                      backgroundColor: 'white',
                      color: '#111827'
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
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                  }}
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernMasterCategories;
