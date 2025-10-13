import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { customersAPI } from '../../../services/api';
import {
  ensureArray,
  generateUniqueKey,
  safeGet,
  standardizeApiResponse,
  handleApiError,
  createLoadingState,
  safeFilter,
} from '../../../utils/apiResponseHandler';
import { standardizeCustomer, mapField, customerFieldMap } from '../../../utils/fieldMapping';
import { withErrorBoundary } from '../../../components/ErrorBoundary/MasterDataErrorBoundary';

const MasterCustomers = () => {
  const [appState, setAppState] = useState(createLoadingState());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nama: '',
    kode_customer: '',
    alamat: '',
    telepon: '',
    email: '',
    status: 'aktif',
  });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }));

      const response = await customersAPI.getAll();

      // Langsung akses response.data karena Laravel sudah mengembalikan struktur yang benar
      const responseData = response.data;

      if (responseData && responseData.success && responseData.data) {
        // Standardize semua customer data
        const standardizedCustomers = responseData.data
          .map(customer => standardizeCustomer(customer))
          .filter(customer => customer !== null);

        setAppState({
          loading: false,
          error: null,
          data: standardizedCustomers,
          total: standardizedCustomers.length,
        });
      } else {
        throw new Error(responseData?.message || 'No data received');
      }
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      const errorResponse = handleApiError(error, 'MasterCustomers');
      setAppState({
        loading: false,
        error: errorResponse.message,
        data: [],
        total: 0,
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Transform form data untuk API sesuai dengan ekspektasi backend
      const apiData = {
        nama: formData.nama,
        kodeCustomer: formData.kode_customer, // Backend expect kodeCustomer
        alamat: formData.alamat,
        telepon: formData.telepon,
        email: formData.email,
        status: formData.status,
      };

      if (editingId) {
        await customersAPI.update(editingId, apiData);
      } else {
        await customersAPI.create(apiData);
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = customer => {
    setFormData({
      nama: customer.namacust || customer.nama,
      kode_customer: customer.kodecust || customer.kode_customer,
      alamat: customer.alamat,
      telepon: customer.telp || customer.telepon,
      email: customer.email || '',
      status: customer.status === true ? 'aktif' : 'nonaktif',
    });
    setEditingId(customer.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      try {
        await customersAPI.delete(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
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
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Filter and pagination dengan safe operations
  const searchFields = ['nama', 'kode', 'alamat', 'telepon', 'email'];
  const filteredCustomers = safeFilter(appState.data, searchTerm, searchFields);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
            currentPage === i
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel - Left */}
        <div className="lg:col-span-1">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              {editingId ? '✏️ Edit Customer' : '➕ Tambah Customer Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Kode Customer *
                </label>
                <input
                  type="text"
                  name="kode_customer"
                  value={formData.kode_customer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium"
                  placeholder="Contoh: CUST001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Customer *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium"
                  placeholder="Nama lengkap customer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Alamat</label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium"
                  placeholder="Alamat lengkap customer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telepon</label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium"
                  placeholder="Nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium"
                  placeholder="Email customer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non Aktif</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {editingId ? '📝 Update Customer' : '💾 Simpan Customer'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    ❌ Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table Panel - Right */}
        <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Search */}
            <div className="flex justify-end items-center mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari customer..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white shadow-sm font-medium w-64"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border-2 border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-200">
                      Kode
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-200">
                      Nama Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-200">
                      Kontak
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-200">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-200">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appState.loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <span className="mt-2 text-gray-600">Memuat data...</span>
                      </td>
                    </tr>
                  ) : appState.error ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="text-red-600 font-semibold mb-2">⚠️ {appState.error}</div>
                          <button
                            onClick={fetchCustomers}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            🔄 Coba Lagi
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        {searchTerm
                          ? 'Tidak ada customer yang sesuai dengan pencarian'
                          : 'Belum ada data customer'}
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer, index) => (
                      <tr
                        key={generateUniqueKey(customer, index, 'customer')}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 border-b border-gray-100">
                          {customer.kode || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-100">
                          <div>
                            <div className="font-semibold">
                              {customer.nama || 'Nama tidak tersedia'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {customer.alamat || 'Alamat tidak tersedia'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-100">
                          <div>
                            <div className="font-medium">
                              {customer.telepon || 'Telepon tidak tersedia'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {customer.email || 'Email tidak tersedia'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm border-b border-gray-100">
                          <span
                            className={`px-3 py-2 rounded-xl text-xs font-bold ${
                              customer.status === 'aktif'
                                ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300'
                                : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                            }`}
                          >
                            {customer.status === 'aktif' ? '✅ Aktif' : '⏸️ Non Aktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm border-b border-gray-100">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(customer)}
                              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Edit Customer"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(safeGet(customer, 'id'))}
                              className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="Delete Customer"
                            >
                              <TrashIcon className="w-5 h-5" />
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
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">{renderPagination()}</div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(MasterCustomers);
