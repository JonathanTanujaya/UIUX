import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { categoriesAPI } from '../../../services/api';

const MasterCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    namaKategori: '',
    kodeKategori: '',
    deskripsi: '',
    status: 'Aktif',
  });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      const categoriesData = response.data?.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriesAPI.update(editingId, formData);
      } else {
        await categoriesAPI.create(formData);
      }

      setFormData({
        namaKategori: '',
        kodeKategori: '',
        deskripsi: '',
        status: 'Aktif',
      });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = category => {
    setFormData({
      namaKategori: category.kategori || category.namaKategori || '',
      kodeKategori: category.kodekategori || category.kodeKategori || '',
      deskripsi: category.deskripsi || '',
      status: category.status === true || category.status === 'Aktif' ? 'Aktif' : 'Nonaktif',
    });
    setEditingId(category.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await categoriesAPI.delete(id);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      namaKategori: '',
      kodeKategori: '',
      deskripsi: '',
      status: 'Aktif',
    });
    setEditingId(null);
  };

  const filteredCategories = categories.filter(
    category =>
      (category.kategori || category.namaKategori || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (category.kodekategori || category.kodeKategori || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span className="ml-3">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="content-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kategori
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Masukkan nama kategori"
                    value={formData.namaKategori}
                    onChange={e => setFormData({ ...formData, namaKategori: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Kategori
                  </label>
                  <input
                    type="text"
                    className={`input ${!editingId ? 'bg-gray-100' : ''}`}
                    placeholder="Auto generated"
                    value={formData.kodeKategori}
                    onChange={e => setFormData({ ...formData, kodeKategori: e.target.value })}
                    disabled={!editingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    className="input h-20 resize-none"
                    placeholder="Deskripsi kategori..."
                    value={formData.deskripsi}
                    onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="input"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                  <button type="button" onClick={handleReset} className="btn btn-secondary">
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Table Panel */}
          <div className="lg:col-span-2">
            <div className="table-container">
              <div className="table-header">
                <h2 className="table-title">Daftar Kategori</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      className="input pl-10 w-64"
                      placeholder="Cari kategori..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama Kategori</th>
                      <th>Deskripsi</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map(category => (
                        <tr key={category.id}>
                          <td className="font-medium">
                            {category.kodekategori || category.kodeKategori || '-'}
                          </td>
                          <td className="font-medium">
                            {category.kategori || category.namaKategori || '-'}
                          </td>
                          <td className="text-gray-600">{category.deskripsi || '-'}</td>
                          <td>
                            <span
                              className={`badge ${
                                (category.status || category.status_aktif) === 'Aktif' ||
                                (category.status || category.status_aktif) === 1 ||
                                (category.status || category.status_aktif) === true
                                  ? 'badge-success'
                                  : 'badge-neutral'
                              }`}
                            >
                              {(category.status || category.status_aktif) === 'Aktif' ||
                              (category.status || category.status_aktif) === 1 ||
                              (category.status || category.status_aktif) === true
                                ? 'Aktif'
                                : 'Tidak Aktif'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleEdit(category)}
                                className="btn btn-sm btn-ghost text-primary"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="btn btn-sm btn-ghost text-error"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8">
                          <div className="empty-state">
                            <p>Tidak ada data kategori</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages >= 1 && (
                <div className="flex justify-between items-center p-6 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    Menampilkan {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredCategories.length)} dari{' '}
                    {filteredCategories.length} data
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-sm btn-secondary"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-sm btn-secondary"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Kategori</h3>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kategori Aktif</h3>
            <p className="text-2xl font-bold text-success">
              {categories.filter(cat => cat.status === true || cat.status === 'Aktif').length}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kategori Nonaktif</h3>
            <p className="text-2xl font-bold text-gray-500">
              {categories.filter(cat => cat.status !== true && cat.status !== 'Aktif').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterCategories;
