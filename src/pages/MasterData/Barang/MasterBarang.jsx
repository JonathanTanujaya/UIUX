import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { barangAPI, categoriesAPI } from '../../../services/api';
import {
  ensureArray,
  generateUniqueKey,
  safeGet,
  standardizeApiResponse,
  handleApiError,
  createLoadingState,
  safeFilter,
} from '../../../utils/apiResponseHandler';
import { standardizeBarang } from '../../../utils/fieldMapping';
import { withErrorBoundary } from '../../../components/ErrorBoundary/MasterDataErrorBoundary';

const MasterBarang = () => {
  const [appState, setAppState] = useState(createLoadingState());
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    kode_barang: '',
    modal: '',
    stok: '',
    tanggal_masuk: '',
  });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchBarangs();
    fetchCategories();
  }, []);

  const fetchBarangs = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }));

      const response = await barangAPI.getAll();

      // Standardize API response
      const standardResponse = standardizeApiResponse(response.data);

      if (standardResponse.success) {
        // Data sudah dalam format yang benar dari API baru
        const barangsData = ensureArray(standardResponse.data);

        setAppState({
          loading: false,
          error: null,
          data: barangsData,
          total: standardResponse.total_count || barangsData.length,
        });
      } else {
        throw new Error(standardResponse.message);
      }
    } catch (error) {
      console.error('❌ Error fetching barangs:', error);
      const errorResponse = handleApiError(error, 'MasterBarang');
      setAppState({
        loading: false,
        error: errorResponse.message,
        data: [],
        total: 0,
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await barangAPI.update(editingId, formData);
      } else {
        await barangAPI.create(formData);
      }

      // Reset form
      setFormData({
        kode_barang: '',
        modal: '',
        stok: '',
        tanggal_masuk: '',
      });
      setEditingId(null);

      // Refresh data
      fetchBarangs();
    } catch (error) {
      console.error('Error saving barang:', error);
    }
  };

  const handleEdit = barang => {
    setFormData({
      kode_barang: barang.kode_barang,
      modal: barang.modal.toString(),
      stok: barang.stok.toString(),
      tanggal_masuk: barang.tanggal_masuk || '',
    });
    setEditingId(barang.kode_barang); // Use kode_barang as ID since we don't have 'id'
  };

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        await barangAPI.delete(id);
        fetchBarangs();
      } catch (error) {
        console.error('Error deleting barang:', error);
      }
    }
  };

  // Filter dan pagination dengan safe operations
  const searchFields = ['kode_barang'];
  const filteredBarangs = safeFilter(appState.data, searchTerm, searchFields);

  const totalPages = Math.ceil(filteredBarangs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBarangs = filteredBarangs.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {editingId ? 'Edit Barang' : 'Tambah Barang Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kode Barang *
              </label>
              <input
                type="text"
                required
                value={formData.kode_barang}
                onChange={e => setFormData({ ...formData, kode_barang: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan kode barang"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Modal (Rp) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.modal}
                onChange={e => setFormData({ ...formData, modal: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan modal barang"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Stok *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stok}
                onChange={e => setFormData({ ...formData, stok: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan jumlah stok"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tanggal Masuk
              </label>
              <input
                type="date"
                value={formData.tanggal_masuk}
                onChange={e => setFormData({ ...formData, tanggal_masuk: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
              >
                {editingId ? 'Update Barang' : 'Simpan Barang'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      kode_barang: '',
                      modal: '',
                      stok: '',
                      tanggal_masuk: '',
                    });
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-xl font-bold text-slate-800">Daftar Barang</h3>

              <div className="relative w-full sm:w-96">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari barang..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Kode Barang</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-700">Modal</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700">Stok</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Tanggal Masuk
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {appState.loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-slate-600">Loading...</p>
                    </td>
                  </tr>
                ) : appState.error ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="text-red-600 font-semibold mb-2">⚠️ {appState.error}</div>
                        <button
                          onClick={fetchBarangs}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          🔄 Coba Lagi
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : currentBarangs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500">
                      {searchTerm
                        ? 'Tidak ada barang yang sesuai dengan pencarian'
                        : 'Belum ada data barang'}
                    </td>
                  </tr>
                ) : (
                  currentBarangs.map((barang, index) => (
                    <tr
                      key={generateUniqueKey(barang, index, 'barang')}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-sm">{barang.kode_barang || 'N/A'}</td>
                      <td className="py-4 px-6 text-right font-mono">
                        {formatCurrency(barang.modal || 0)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            (barang.stok || 0) > 10
                              ? 'bg-green-100 text-green-700'
                              : (barang.stok || 0) > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {barang.stok || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">{barang.tanggal_masuk || '-'}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(barang)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(barang.kode_barang)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <p className="text-slate-600">
                  Menampilkan {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredBarangs.length)} dari{' '}
                  {filteredBarangs.length} barang
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">{currentPage}</span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(MasterBarang);
