import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useData } from '../../../hooks/useData';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

function AreaListPage() {
  const navigate = useNavigate();
  const { area: areaData } = useData();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Fixed 15 items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    kode_area: '',
    nama_area: '',
    status: 'Aktif'
  });

  // Transform data from JSON to component format
  const data = useMemo(() => {
    return areaData.map((item, index) => ({
      id: index + 1,
      kode_area: item.kode_area,
      nama_area: item.area,
      status: item.status ? 'Aktif' : 'Tidak Aktif'
    }));
  }, [areaData]);

  const filteredData = data.filter(item => 
    item.nama_area?.toLowerCase().includes(search.toLowerCase()) ||
    item.kode_area?.toLowerCase().includes(search.toLowerCase())
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

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      console.log('Deleting area with id:', id);
      // TODO: Call API to delete area
      alert('Fitur hapus area akan tersedia setelah integrasi API');
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        kode_area: item.kode_area,
        nama_area: item.nama_area,
        status: item.status
      });
    } else {
      setEditingItem(null);
      setFormData({
        kode_area: '',
        nama_area: '',
        status: 'Aktif'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      kode_area: '',
      nama_area: '',
      status: 'Aktif'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.kode_area || !formData.nama_area) {
      alert('Kode Area dan Nama Area harus diisi!');
      return;
    }

    if (editingItem) {
      // Update existing
      console.log('Updating area:', editingItem.id, formData);
      // TODO: Call API to update area
      alert('Fitur update area akan tersedia setelah integrasi API');
    } else {
      // Add new
      console.log('Adding new area:', formData);
      // TODO: Call API to add area
      alert('Fitur tambah area akan tersedia setelah integrasi API');
    }
    
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    return status === 'Aktif' 
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
          placeholder="Cari area..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
          onClick={() => handleOpenModal()}
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
          Tambah Area
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
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
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
                  Kode Area
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
                  Nama Area
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
              {currentItems.map((item, index) => {
                const statusBadge = getStatusBadge(item.status);
                const rowNumber = indexOfFirstItem + index + 1;
                return (
                  <tr 
                    key={item.id}
                    style={{ 
                      borderBottom: index < currentItems.length - 1 ? '1px solid #f1f5f9' : 'none',
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
                      fontWeight: '500', 
                      color: '#64748b',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}>
                      {rowNumber}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1e293b',
                      fontFamily: 'monospace',
                      lineHeight: 1.2
                    }}>
                      {item.kode_area}
                    </td>
                    <td style={{ 
                      padding: '6px 12px', 
                      fontSize: '13px', 
                      color: '#334155',
                      fontWeight: '500',
                      lineHeight: 1.2
                    }}>
                      {item.nama_area}
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center', lineHeight: 1.2 }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: statusBadge.color,
                        backgroundColor: statusBadge.bg,
                        border: `1px solid ${statusBadge.color}20`
                      }}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td style={{ padding: '6px 12px', textAlign: 'center', lineHeight: 1.2 }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleOpenModal(item)}
                          style={{
                            padding: '4px 6px',
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
                          title="Edit area"
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
                            fontSize: '14px',
                            minWidth: '26px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
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
        
  {/* Pagination - Show whenever there is any data */}
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

      {/* Modal */}
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
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                {editingItem ? 'Edit Area' : 'Tambah Area Baru'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '6px'
                }}>
                  Kode Area <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="kode_area"
                  value={formData.kode_area}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode area"
                  disabled={editingItem !== null}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: editingItem ? '#f8fafc' : 'white',
                    cursor: editingItem ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => !editingItem && (e.target.style.borderColor = '#3b82f6')}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '6px'
                }}>
                  Nama Area <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="nama_area"
                  value={formData.nama_area}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama area"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '6px'
                }}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AreaListPage;