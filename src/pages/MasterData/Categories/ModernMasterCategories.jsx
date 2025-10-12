import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../../styles/designTokens';
import { api } from '../../../services/api';

const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>✏️</span>;
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
      height: '100vh', 
      overflow: 'hidden' 
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

      {/* Table - Scrollable */}
      <Card padding="0">
        <div style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.fontSize.sm }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: colors.gray[50], zIndex: 1 }}>
              <tr style={{ borderBottom: `2px solid ${colors.gray[200]}` }}>
                <th style={tableHeaderStyle}>No</th>
                <th style={tableHeaderStyle}>Kode Kategori</th>
                <th style={tableHeaderStyle}>Nama Kategori</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center', width: '120px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                    Loading data...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: spacing[8], textAlign: 'center', color: colors.gray[500] }}>
                    {searchTerm ? 'Tidak ada kategori yang sesuai pencarian' : 'Belum ada data kategori'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr 
                    key={category.kode_kategori || index} 
                    style={{ 
                      borderBottom: `1px solid ${colors.gray[200]}`,
                      backgroundColor: editingId === category.kode_kategori ? colors.primary[50] : 'transparent'
                    }}
                  >
                    <td style={{ ...tableCellStyle, width: '60px', textAlign: 'center' }}>
                      <span style={{ color: colors.gray[500], fontSize: typography.fontSize.sm }}>{index + 1}</span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ 
                        fontFamily: typography.fontFamily.mono, 
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.primary[700],
                        backgroundColor: colors.primary[50],
                        padding: `${spacing[1]} ${spacing[2]}`,
                        borderRadius: borderRadius.base
                      }}>
                        {category.kode_kategori}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{ fontWeight: typography.fontWeight.medium, color: colors.gray[900] }}>
                        {category.nama_kategori}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'center' }}>
                        <button 
                          style={actionButtonStyle} 
                          onClick={() => handleEdit(category)}
                          title="Edit kategori"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          style={{ ...actionButtonStyle, color: colors.error[600] }} 
                          onClick={() => handleDelete(category.kode_kategori)}
                          title="Hapus kategori"
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
          padding: spacing[3], 
          borderTop: `1px solid ${colors.gray[200]}`, 
          backgroundColor: colors.gray[50],
          fontSize: typography.fontSize.sm,
          color: colors.gray[600],
          textAlign: 'center'
        }}>
          Total: <strong style={{ color: colors.gray[900] }}>{filteredCategories.length}</strong> kategori
          {searchTerm && ` (hasil pencarian untuk "${searchTerm}")`}
        </div>
      </Card>
    </div>
  );
};

const tableHeaderStyle = {
  padding: spacing[3],
  textAlign: 'left',
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
  color: colors.gray[700],
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tableCellStyle = {
  padding: spacing[3],
  color: colors.gray[700],
};

const actionButtonStyle = {
  padding: spacing[2],
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray[600],
  borderRadius: borderRadius.base,
  transition: 'all 150ms',
  fontSize: typography.fontSize.base,
};

export default ModernMasterCategories;
