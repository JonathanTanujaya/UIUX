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
  };

  const handleEdit = (category) => {
    setEditingId(category.kode_kategori);
    setFormData({
      kode_kategori: category.kode_kategori,
      nama_kategori: category.nama_kategori
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* Inline Form */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
            {/* Kode Kategori */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
              <label style={{ 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.gray[700],
                minWidth: '100px',
                whiteSpace: 'nowrap'
              }}>
                Kode Kategori:
              </label>
              <input
                name="kode_kategori"
                value={formData.kode_kategori}
                onChange={(e) => setFormData({ ...formData, kode_kategori: e.target.value })}
                placeholder="KAT001"
                required
                disabled={!!editingId}
                style={{
                  width: '120px',
                  padding: `${spacing[2]} ${spacing[3]}`,
                  fontSize: typography.fontSize.sm,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: borderRadius.md,
                  outline: 'none',
                  backgroundColor: editingId ? colors.gray[100] : colors.white,
                  color: colors.gray[900]
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.gray[300];
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Nama Kategori */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flex: 1 }}>
              <label style={{ 
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.gray[700],
                minWidth: '110px',
                whiteSpace: 'nowrap'
              }}>
                Nama Kategori:
              </label>
              <input
                name="nama_kategori"
                value={formData.nama_kategori}
                onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                placeholder="Masukkan nama kategori..."
                required
                style={{
                  flex: 1,
                  padding: `${spacing[2]} ${spacing[3]}`,
                  fontSize: typography.fontSize.sm,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: borderRadius.md,
                  outline: 'none',
                  backgroundColor: colors.white,
                  color: colors.gray[900]
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${colors.primary[50]}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.gray[300];
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <Button type="submit" icon={editingId ? <EditIcon /> : <PlusIcon />}>
                {editingId ? 'Update' : 'Simpan'}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" icon={<XIcon />} onClick={resetForm}>
                  Batal
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>

      {/* Search */}
      <Card padding={spacing[4]} style={{ marginBottom: spacing[4] }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: spacing[2], 
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
            flex: 1,
            marginLeft: '20px' // Menggeser box input agar sejajar dengan input kode kategori
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
    </div>
  );
};

export default ModernMasterCategories;
