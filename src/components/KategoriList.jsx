import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

function KategoriList({ onEdit, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [formData, setFormData] = useState({
    kodekategori: '',
    namakategori: '',
    keterangan: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Use data from JSON file
  const { kategori: kategoriData } = useData();
  
  // Transform data to match component structure
  const kategori = useMemo(() => {
    return (kategoriData || []).map(item => ({
      id: item.id_kategori,
      kodekategori: item.kode_kategori,
      namakategori: item.nama_kategori,
      keterangan: item.keterangan
    }));
  }, [kategoriData]);

  const handleDelete = async (kodeKategori) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      console.log('Delete kategori (stub):', kodeKategori);
      // TODO: Integrate delete when API ready
    }
  };

  const filteredKategori = kategori.filter(
    kat =>
      (kat.namakategori || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (kat.kodekategori || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKategori.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKategori.length / itemsPerPage);

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

  // Open modal for adding new kategori
  const handleAdd = () => {
    setEditingKategori(null);
    setFormData({
      kodekategori: '',
      namakategori: '',
      keterangan: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (item) => {
    setEditingKategori(item);
    setFormData({
      kodekategori: item.kodekategori || '',
      namakategori: item.namakategori || '',
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKategori(null);
    setFormData({
      kodekategori: '',
      namakategori: '',
      keterangan: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulate API call with dummy data
      console.log('Saving kategori:', formData);
      
      handleCloseModal();
      
      // Show success message
      alert(editingKategori ? 'Kategori berhasil diupdate!' : 'Kategori berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving kategori:', error);
      alert('Gagal menyimpan kategori: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#f9fafb', 
        height: '100vh', 
        overflow: 'hidden' 
      }}>
        <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Memuat data kategori...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#f9fafb',
      height: '100%'
    }}>
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          onClick={handleAdd}
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
          Tambah Kategori
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
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px', width: '60px' }}>No</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Kode Kategori</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Nama Kategori</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px', width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKategori.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    {searchTerm ? 'Tidak ada kategori yang ditemukan' : 'Belum ada data kategori'}
                  </td>
                </tr>
              ) : (
                currentItems.map((kat, index) => {
                  const rowNumber = indexOfFirstItem + index + 1;
                  return (
                    <tr
                      key={kat.kodekategori}
                      style={{ 
                        borderBottom: index < currentItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                        backgroundColor: 'white',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b', textAlign: 'center', fontWeight: '500' }}>{rowNumber}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>{kat.kodekategori}</td>
                      <td style={{ padding: '6px 12px', fontSize: '13px', color: '#334155', fontWeight: '500' }}>{kat.namakategori}</td>
                      <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button onClick={() => handleEdit(kat)} style={{ padding: '4px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px', transition: 'all 150ms', fontSize: '14px' }} title="Edit kategori">
                            <EditIcon />
                          </button>
                          <button onClick={() => handleDelete(kat.kodekategori)} style={{ padding: '4px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px', transition: 'all 150ms', fontSize: '14px' }} title="Hapus kategori">
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Only show when more than 15 items */}
        {filteredKategori.length > itemsPerPage && (
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingKategori ? '✏️ Edit Kategori' : '➕ Tambah Kategori Baru'}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                {/* Kode Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kodekategori"
                    value={formData.kodekategori}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: KT001"
                    required
                    disabled={!!editingKategori}
                  />
                </div>

                {/* Nama Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namakategori"
                    value={formData.namakategori}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Elektronik"
                    required
                  />
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Keterangan opsional..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : (editingKategori ? 'Update' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KategoriList;
