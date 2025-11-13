import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../../styles/designTokens';
import { api } from '../../../services/api';
import { useData } from '../../../hooks/useData';

const SearchIcon = () => <span>🔍</span>;
const PlusIcon = () => <span>+</span>;
const EditIcon = () => <span>📝</span>;
const TrashIcon = () => <span>🗑️</span>;
const XIcon = () => <span>✖️</span>;

const CategoriesPage = () => {
  const { kategori: kategoriData } = useData();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Fixed 15 items per page
  const [formData, setFormData] = useState({
    kode_kategori: '',
    nama_kategori: ''
  });

  // Transform data from JSON to component format
  const categories = useMemo(() => {
    return kategoriData.map(item => ({
      kode_kategori: item.kode_kategori,
      nama_kategori: item.kategori  // Field name in JSON is "kategori"
    }));
  }, [kategoriData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing - in real app, this would call API
      console.log('Updating category:', editingId, formData);
      // TODO: Call API to update category
      alert('Fitur update kategori akan tersedia setelah integrasi API');
    } else {
      // Add new - in real app, this would call API
      console.log('Adding category:', formData);
      // TODO: Call API to add category
      alert('Fitur tambah kategori akan tersedia setelah integrasi API');
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
      // TODO: Call API to delete category
      alert('Fitur hapus kategori akan tersedia setelah integrasi API');
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  return (
    <div style={{ 
      padding: spacing[6], 
      backgroundColor: colors.gray[50], 
      minHeight: 'calc(100vh - 60px)', // Kurangi tinggi navbar
      paddingTop: spacing[4],
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Search and Button in one row */}
      <Card padding={spacing[3]} style={{ marginBottom: spacing[3] }}> {/* Kurangi padding dan margin */}
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
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        flex: 1 // Ambil sisa ruang yang tersedia
      }}> 
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0, flex: 1 }}>
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
                  lineHeight: '1.2',
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
                  letterSpacing: '0.3px',
                  lineHeight: '1.2'
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
                  letterSpacing: '0.3px',
                  lineHeight: '1.2'
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
                  lineHeight: '1.2',
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
                    padding: '12px', 
                    textAlign: 'center', 
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    Loading data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    color: '#64748b',
                    fontSize: '13px'
                  }}>
                    {searchTerm ? 'Tidak ada kategori yang sesuai pencarian' : 'Belum ada data kategori'}
                  </td>
                </tr>
              ) : (
                currentItems.map((category, index) => (
                  <tr 
                    key={category.kode_kategori || index} 
                    style={{ 
                      borderBottom: index < currentItems.length - 1 ? '1px solid #f1f5f9' : 'none',
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
                      color: '#64748b',
                      lineHeight: '1.2'
                    }}>
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontFamily: 'monospace',
                      lineHeight: '1.2'
                    }}>
                      {category.kode_kategori}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#334155',
                      fontWeight: '500',
                      lineHeight: '1.2'
                    }}>
                      {category.nama_kategori}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button 
                          style={{
                            padding: '4px 6px',
                            backgroundColor: 'transparent',
                            color: '#3b82f6',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease',
                            minWidth: '26px',
                            height: '22px',
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
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease',
                            minWidth: '26px',
                            height: '22px',
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

        {/* Footer Info & Pagination */}
        <div style={{ 
          padding: '10px 12px', 
          borderTop: '1px solid #e5e7eb', 
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Pagination Controls - Center */}
          {totalPages >= 1 && (
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
          )}
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

export default CategoriesPage;
