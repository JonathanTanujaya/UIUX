import React, { useState, useEffect } from 'react';
import DataTable from './common/DataTable';
import { sparepartService } from '../config/apiService';
import { useConfirmDialog } from './common/LoadingComponents';

function SparepartList({ onEdit, onRefresh }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    totalCount: 0,
    totalPages: 1,
  });

  // Load data function
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await sparepartService.getAll({
        page: currentPage,
        per_page: perPage,
      });

      if (response && response.success) {
        setSpareparts(response.data || []);
        setPaginationInfo({
          totalCount: response.totalCount || 0,
          totalPages: response.totalPages || 1,
        });
      } else {
        setError('Gagal memuat data sparepart');
        setSpareparts([]);
      }
    } catch (err) {
      setError('Gagal memuat data sparepart');
      setSpareparts([]);
      console.error('Error loading spareparts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadData();
  }, [currentPage, onRefresh]);

  // Extract pagination info
  const { totalCount, totalPages } = paginationInfo;

  // Debug log untuk melihat data yang diterima
  console.log('SparepartList Debug:', {
    spareparts,
    loading,
    sparepartsType: typeof spareparts,
    sparepartsLength: Array.isArray(spareparts) ? spareparts.length : 'not array',
    paginationInfo,
    currentPage,
    totalCount,
    totalPages,
  });

  const confirm = useConfirmDialog();

  // Pagination handlers
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Sparepart',
      message: `Apakah Anda yakin ingin menghapus sparepart "${item.kodeBarang}" dengan ID ${item.id}?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      try {
        await sparepartService.delete(item.kodeDivisi, item.kodeBarang, item.id);
        loadData(); // Refresh data after delete
      } catch (error) {
        console.error('Error deleting sparepart:', error);
        alert('Gagal menghapus sparepart');
      }
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      accessor: 'kodeDivisi',
    },
    {
      header: 'Kode Barang',
      accessor: 'kodeBarang',
    },
    {
      header: 'Tanggal Masuk',
      accessor: 'tglMasuk',
      render: value => {
        if (!value) return '-';
        try {
          return new Date(value).toLocaleDateString('id-ID');
        } catch (error) {
          return value;
        }
      },
    },
    {
      header: 'Modal',
      accessor: 'modal',
      render: value => {
        if (!value && value !== 0) return '-';
        try {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(value);
        } catch (error) {
          return value;
        }
      },
    },
    {
      header: 'Stok',
      accessor: 'stok',
      render: value => {
        // Handle all falsy values except 0
        if (value === null || value === undefined || value === '') return '-';
        // Convert to number and display
        return Number(value).toString();
      },
    },
    {
      header: 'ID',
      accessor: 'id',
    },
  ];

  return (
    <div>
      <DataTable
        title="Daftar Sparepart"
        data={spareparts || []}
        columns={columns}
        loading={loading}
        error={error}
        onRefresh={loadData}
        onEdit={onEdit}
        onDelete={handleDelete}
        searchable={true}
        searchFields={['kodeDivisi', 'kodeBarang', 'tglMasuk']}
        keyField="id"
      />

      {/* Pagination Controls */}
      {(totalPages > 1 || totalCount > perPage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Menampilkan {(currentPage - 1) * perPage + 1} -{' '}
            {Math.min(currentPage * perPage, totalCount)} dari {totalCount} data
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 1 ? '#e9ecef' : '#007bff',
                color: currentPage === 1 ? '#6c757d' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              ← Sebelumnya
            </button>

            {/* Quick page navigation */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(1)}
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#fff',
                  color: '#007bff',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                1
              </button>
            )}

            <span
              style={{
                margin: '0 1rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#495057',
              }}
            >
              Halaman {currentPage} dari {totalPages}
            </span>

            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#fff',
                  color: '#007bff',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === totalPages ? '#e9ecef' : '#007bff',
                color: currentPage === totalPages ? '#6c757d' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SparepartList;
