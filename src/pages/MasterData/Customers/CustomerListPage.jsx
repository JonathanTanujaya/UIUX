import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EditIcon = () => <span>✏️</span>;
const TrashIcon = () => <span>🗑️</span>;

function CustomerListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Fixed 15 items per page
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        kode_customer: 'CUST001',
        nama_customer: 'PT. Maju Jaya',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        no_telpon: '081234567890',
        contact: 'Budi Santoso',
        nama_area: 'Jakarta Selatan',
        credit_limit: 50000000,
        jatuh_tempo: 30,
        no_npwp: '01.234.567.8-901.000',
        nik: '3174012345670001',
        nama_pajak: 'PT. Maju Jaya',
        alamat_pajak: 'Jl. Sudirman No. 123, Jakarta Selatan'
      },
      {
        id: 2,
        kode_customer: 'CUST002',
        nama_customer: 'CV. Berkah Sejahtera',
        alamat: 'Jl. Asia Afrika No. 456, Bandung',
        no_telpon: '081234567891',
        contact: 'Sari Dewi',
        nama_area: 'Bandung Kota',
        credit_limit: 35000000,
        jatuh_tempo: 45,
        no_npwp: '02.345.678.9-012.000',
        nik: '3273012345670002',
        nama_pajak: 'CV. Berkah Sejahtera',
        alamat_pajak: 'Jl. Asia Afrika No. 456, Bandung'
      },
      {
        id: 3,
        kode_customer: 'CUST003',
        nama_customer: 'Toko Sumber Rezeki',
        alamat: 'Jl. Pemuda No. 789, Surabaya',
        no_telpon: '081234567892',
        contact: 'Ahmad Rizki',
        nama_area: 'Surabaya Pusat',
        credit_limit: 25000000,
        jatuh_tempo: 30,
        no_npwp: '03.456.789.0-123.000',
        nik: '3578012345670003',
        nama_pajak: 'Toko Sumber Rezeki',
        alamat_pajak: 'Jl. Pemuda No. 789, Surabaya'
      },
      {
        id: 4,
        kode_customer: 'CUST004',
        nama_customer: 'UD. Mitra Usaha',
        alamat: 'Jl. Gatot Subroto No. 321, Medan',
        no_telpon: '081234567893',
        contact: 'Diana Putri',
        nama_area: 'Medan Kota',
        credit_limit: 40000000,
        jatuh_tempo: 60,
        no_npwp: '04.567.890.1-234.000',
        nik: '1271012345670004',
        nama_pajak: 'UD. Mitra Usaha',
        alamat_pajak: 'Jl. Gatot Subroto No. 321, Medan'
      },
      {
        id: 5,
        kode_customer: 'CUST005',
        nama_customer: 'PT. Global Trading',
        alamat: 'Jl. Malioboro No. 654, Yogyakarta',
        no_telpon: '081234567894',
        contact: 'Eko Prasetyo',
        nama_area: 'Jakarta Pusat',
        credit_limit: 60000000,
        jatuh_tempo: 30,
        no_npwp: '05.678.901.2-345.000',
        nik: '3374012345670005',
        nama_pajak: 'PT. Global Trading',
        alamat_pajak: 'Jl. Malioboro No. 654, Yogyakarta'
      },
      {
        id: 6,
        kode_customer: 'CUST006',
        nama_customer: 'CV. Sentosa Makmur',
        alamat: 'Jl. Ahmad Yani No. 987, Makassar',
        no_telpon: '081234567895',
        contact: 'Linda Wijaya',
        nama_area: 'Jakarta Utara',
        credit_limit: 45000000,
        jatuh_tempo: 45,
        no_npwp: '06.789.012.3-456.000',
        nik: '7371012345670006',
        nama_pajak: 'CV. Sentosa Makmur',
        alamat_pajak: 'Jl. Ahmad Yani No. 987, Makassar'
      },
      {
        id: 7,
        kode_customer: 'CUST007',
        nama_customer: 'Toko Jaya Abadi',
        alamat: 'Jl. Diponegoro No. 111, Semarang',
        no_telpon: '081234567896',
        contact: 'Rudi Hermawan',
        nama_area: 'Jakarta Timur',
        credit_limit: 30000000,
        jatuh_tempo: 30,
        no_npwp: '07.890.123.4-567.000',
        nik: '3374012345670007',
        nama_pajak: 'Toko Jaya Abadi',
        alamat_pajak: 'Jl. Diponegoro No. 111, Semarang'
      },
      {
        id: 8,
        kode_customer: 'CUST008',
        nama_customer: 'PT. Sejahtera Mandiri',
        alamat: 'Jl. Veteran No. 222, Palembang',
        no_telpon: '081234567897',
        contact: 'Dewi Lestari',
        nama_area: 'Jakarta Barat',
        credit_limit: 55000000,
        jatuh_tempo: 60,
        no_npwp: '08.901.234.5-678.000',
        nik: '1671012345670008',
        nama_pajak: 'PT. Sejahtera Mandiri',
        alamat_pajak: 'Jl. Veteran No. 222, Palembang'
      }
    ];
    setData(dummyData);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
  };

  const filteredData = data.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.nama_customer?.toLowerCase().includes(searchLower) ||
      item.alamat?.toLowerCase().includes(searchLower) ||
      item.nama_area?.toLowerCase().includes(searchLower)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
          placeholder="Cari customer..."
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
          onClick={() => navigate('/master/customer/create')}
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
          Tambah Customer
        </button>
      </div>

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
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Nama Customer</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Alamat</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>No Telpon</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Area</th>
                <th style={{ padding: '6px 12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Credit Limit</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Jatuh Tempo</th>
                <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px', width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => {
                const rowNumber = indexOfFirstItem + idx + 1;
                return (
                  <tr 
                    key={item.id} 
                    style={{ 
                      borderBottom: idx < currentItems.length - 1 ? '1px solid #f1f5f9' : 'none', 
                      backgroundColor: 'white', 
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    onClick={() => handleRowClick(item)}
                  >
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b', textAlign: 'center', fontWeight: '500' }}>{rowNumber}</td>
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>{item.nama_customer}</td>
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b', maxWidth: '300px' }}>{item.alamat}</td>
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b' }}>{item.no_telpon}</td>
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b' }}>{item.nama_area}</td>
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#475569', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(item.credit_limit)}</td>
                    <td style={{ padding: '6px 12px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>{item.jatuh_tempo} Hari</td>
                    <td style={{ padding: '6px 12px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button onClick={() => navigate(`/master/customer/edit/${item.kode_customer}`)} style={{ padding: '4px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px', transition: 'all 150ms', fontSize: '14px' }} title="Edit customer"><EditIcon /></button>
                        <button onClick={() => handleDelete(item.id)} style={{ padding: '4px 6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', borderRadius: '4px', transition: 'all 150ms', fontSize: '14px' }} title="Hapus customer"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            {search ? 'Tidak ada customer yang ditemukan' : 'Belum ada data customer'}
          </div>
        )}
        
        {/* Pagination - Only show when more than 15 items */}
        {filteredData.length > 15 && (
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

      {/* Detail Modal */}
      {isDetailModalOpen && selectedCustomer && (
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
        }} onClick={handleCloseDetailModal}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                Detail Customer
              </h2>
              <button
                onClick={handleCloseDetailModal}
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

            {/* Content */}
            <div style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px 32px'
            }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kode Customer</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#1e293b', fontWeight: '600', fontFamily: 'monospace' }}>{selectedCustomer.kode_customer}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Customer</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{selectedCustomer.nama_customer}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Area</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155' }}>{selectedCustomer.nama_area}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alamat</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{selectedCustomer.alamat}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>No Telpon</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155' }}>{selectedCustomer.no_telpon}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Person</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155' }}>{selectedCustomer.contact}</p>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credit Limit</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{formatCurrency(selectedCustomer.credit_limit)}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Jatuh Tempo</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155' }}>{selectedCustomer.jatuh_tempo} Hari</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>No NPWP</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155', fontFamily: 'monospace' }}>{selectedCustomer.no_npwp}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NIK</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155', fontFamily: 'monospace' }}>{selectedCustomer.nik}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nama Pajak</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155' }}>{selectedCustomer.nama_pajak}</p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alamat Pajak</label>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{selectedCustomer.alamat_pajak}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={handleCloseDetailModal}
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
                Tutup
              </button>
              <button
                onClick={() => {
                  handleCloseDetailModal();
                  navigate(`/master/customer/edit/${selectedCustomer.kode_customer}`);
                }}
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
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerListPage;