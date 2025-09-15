import React, { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { customersAPI } from '../../../services/api';

const MasterCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortKey, setSortKey] = useState('nama');
  const [sortDir, setSortDir] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kode_customer: '',
    alamat: '',
    telepon: '',
    email: '',
    status: 'aktif',
  });
  const [editingId, setEditingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      const response = await customersAPI.getAll();
      
      // Try different data access patterns
      let customersData = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        customersData = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        customersData = response.data;
      } else if (Array.isArray(response)) {
        customersData = response;
      }
      
      setCustomers(customersData);
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      console.error('❌ Error details:', error.message, error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await customersAPI.update(editingId, formData);
      } else {
        await customersAPI.create(formData);
      }
      fetchCustomers();
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = customer => {
    setFormData({
      nama: customer.nama || '',
      kode_customer: customer.kodeCustomer || customer.kode_customer || '',  // Support both API format
      alamat: customer.alamat || '',
      telepon: customer.telepon || '',
      email: customer.email || '',
      status: customer.status || 'aktif',
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Yakin ingin menghapus customer ini?')) {
      try {
        await customersAPI.delete(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleInputChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      kode_customer: '',
      alamat: '',
      telepon: '',
      email: '',
      status: 'aktif',
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Filter
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch) {
      return customers;
    }
    const q = debouncedSearch.toLowerCase();
    const filtered = customers.filter(
      c =>
        c.nama?.toLowerCase().includes(q) ||
        c.kodeCustomer?.toLowerCase().includes(q) ||  // Fix: API uses kodeCustomer not kode_customer
        c.kode_customer?.toLowerCase().includes(q) ||  // Keep both for compatibility
        c.alamat?.toLowerCase().includes(q) ||
        c.telepon?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
    return filtered;
  }, [customers, debouncedSearch]);

  // Sorting
  const sortedCustomers = useMemo(() => {
    const data = [...filteredCustomers];
    data.sort((a, b) => {
      const va = (a[sortKey] ?? '').toString().toLowerCase();
      const vb = (b[sortKey] ?? '').toString().toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredCustomers, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const result = sortedCustomers.slice(start, start + pageSize);
    return result;
  }, [sortedCustomers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, pageSize, sortKey, sortDir]);

  const toggleSort = key => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const highlight = text => {
    if (!debouncedSearch) return text || '-';
    const safe = (text || '').toString();
    const idx = safe.toLowerCase().indexOf(debouncedSearch.toLowerCase());
    if (idx === -1) return safe || '-';
    const before = safe.slice(0, idx);
    const match = safe.slice(idx, idx + debouncedSearch.length);
    const after = safe.slice(idx + debouncedSearch.length);
    return (
      <span>
        {before}
        <mark className="hl-match">{match}</mark>
        {after}
      </span>
    );
  };

  const toggleStatusInline = async customer => {
    const newStatus =
      customer.status === 'aktif' || customer.status === true ? 'nonaktif' : 'aktif';
    setCustomers(prev => prev.map(c => (c.id === customer.id ? { ...c, status: newStatus } : c)));
    setUpdatingId(customer.id);
    try {
      await customersAPI.update(customer.id, { ...customer, status: newStatus });
    } catch (e) {
      setCustomers(prev =>
        prev.map(c => (c.id === customer.id ? { ...c, status: customer.status } : c))
      );
      console.error('Gagal toggle status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 pb-8">
        {/* Enhanced Content Header */}
        <div className="content-header">
          <div className="content-title-section">
            <h2>Daftar Customer</h2>
            <p>Total {filteredCustomers.length} customer tersedia</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Enhanced Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Cari customer..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <MagnifyingGlassIcon className="search-icon" />
            </div>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[10, 15, 25, 50].map(s => (
                <option key={s} value={s}>
                  {s}/hal
                </option>
              ))}
            </select>

            {/* Enhanced Add Button */}
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="btn-primary"
            >
              <PlusIcon className="btn-icon" />
              Tambah Customer
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{editingId ? 'Edit Customer' : 'Tambah Customer'}</h3>
                <button onClick={resetForm} className="modal-close">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Kode Customer *</label>
                    <input
                      type="text"
                      name="kode_customer"
                      value={formData.kode_customer}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="CUST001"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nama Customer *</label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nama customer"
                      required
                    />
                  </div>

                  <div className="form-group col-span-2">
                    <label className="form-label">Alamat</label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="2"
                      placeholder="Alamat customer"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telepon</label>
                    <input
                      type="text"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="08123456789"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-aktif</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Data Table */}
        <div className="data-table-container">
          {loading ? (
            <div className="table-wrapper">
              <table className="data-table customers-table">
                <colgroup>
                  <col className="col-code" />
                  <col className="col-name" />
                  <col className="col-address" />
                  <col className="col-phone" />
                  <col className="col-email" />
                  <col className="col-status" />
                  <col className="col-actions" />
                </colgroup>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="table-row skeleton-row">
                      <td>
                        <div className="sk-box w-16" />
                      </td>
                      <td>
                        <div className="sk-box w-40" />
                      </td>
                      <td>
                        <div className="sk-box w-56" />
                      </td>
                      <td>
                        <div className="sk-box w-20" />
                      </td>
                      <td>
                        <div className="sk-box w-32" />
                      </td>
                      <td>
                        <div className="sk-badge" />
                      </td>
                      <td>
                        <div className="sk-actions" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="data-table customers-table">
                  <colgroup>
                    <col className="col-code" />
                    <col className="col-name" />
                    <col className="col-address" />
                    <col className="col-phone" />
                    <col className="col-email" />
                    <col className="col-status" />
                    <col className="col-actions" />
                  </colgroup>
                  {/* Header dihapus sesuai permintaan */}
                  <tbody>
                    {paginatedCustomers.length > 0 && (
                      <tr className="pseudo-header-row">
                        <td
                          onClick={() => toggleSort('kode_customer')}
                          className="ph-cell clickable center"
                        >
                          Kode{' '}
                          {sortKey === 'kode_customer' && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </td>
                        <td onClick={() => toggleSort('nama')} className="ph-cell clickable">
                          Nama{' '}
                          {sortKey === 'nama' && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </td>
                        <td onClick={() => toggleSort('alamat')} className="ph-cell clickable">
                          Alamat{' '}
                          {sortKey === 'alamat' && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </td>
                        <td
                          onClick={() => toggleSort('telepon')}
                          className="ph-cell clickable center"
                        >
                          Telepon{' '}
                          {sortKey === 'telepon' && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </td>
                        <td
                          onClick={() => toggleSort('email')}
                          className="ph-cell clickable center"
                        >
                          Email{' '}
                          {sortKey === 'email' && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </td>
                        <td
                          onClick={() => toggleSort('status')}
                          className="ph-cell clickable center"
                        >
                          Status{' '}
                          {sortKey === 'status' && (
                            <span className="sort-indicator">{sortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </td>
                        <td className="ph-cell center">Aksi</td>
                      </tr>
                    )}
                    {paginatedCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-16">
                          <div className="flex flex-col items-center">
                            <div className="text-6xl mb-4 opacity-50">👥</div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                              {searchTerm
                                ? 'Tidak ada customer yang ditemukan'
                                : 'Belum ada data customer'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              {searchTerm
                                ? `Tidak ada customer yang cocok dengan "${searchTerm}"`
                                : 'Mulai dengan menambahkan customer baru untuk bisnis Anda'}
                            </p>
                            {!searchTerm && (
                              <button onClick={() => setShowForm(true)} className="btn-primary">
                                <PlusIcon className="btn-icon" />
                                Tambah Customer Pertama
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map((customer, index) => (
                        <tr key={customer.id} className="table-row">
                          <td className="col-code text-center font-mono font-semibold text-primary-600">
                            {highlight(customer.kodeCustomer || customer.kode_customer || customer.kodecust || '-')}
                          </td>
                          <td className="col-name font-semibold text-gray-900">
                            {highlight(customer.nama || customer.namacust || '-')}
                          </td>
                          <td className="col-address text-gray-600">
                            {highlight(customer.alamat || '-')}
                          </td>
                          <td className="col-phone text-center font-medium">
                            {highlight(customer.telepon || customer.telp || '-')}
                          </td>
                          <td className="col-email text-center text-sm">
                            {highlight(customer.email || customer.contact || '-')}
                          </td>
                          <td className="col-status text-center">
                            <button
                              type="button"
                              onClick={() => toggleStatusInline(customer)}
                              disabled={updatingId === customer.id}
                              className={`status-badge btn-status-toggle ${customer.status === 'aktif' || customer.status === true ? 'status-active' : 'status-inactive'} ${updatingId === customer.id ? 'is-loading' : ''}`}
                              title="Klik untuk toggle status"
                            >
                              {updatingId === customer.id
                                ? '...'
                                : customer.status === 'aktif' || customer.status === true
                                  ? 'AKTIF'
                                  : 'NONAKTIF'}
                            </button>
                          </td>
                          <td className="col-actions">
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEdit(customer)}
                                className="btn-icon-sm btn-edit"
                                title="Edit Customer"
                              >
                                <PencilIcon className="icon-sm" />
                              </button>
                              <button
                                onClick={() => handleDelete(customer.id)}
                                className="btn-icon-sm btn-delete"
                                title="Hapus Customer"
                              >
                                <TrashIcon className="icon-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Compact Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <span className="pagination-info">
                    {(() => {
                      const start = (currentPage - 1) * pageSize + 1;
                      const end = Math.min(currentPage * pageSize, filteredCustomers.length);
                      return `Menampilkan ${start}-${end} dari ${filteredCustomers.length} data | Halaman ${currentPage} / ${totalPages}`;
                    })()}
                  </span>
                  <div className="pagination-controls">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ‹ Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next ›
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterCustomers;
