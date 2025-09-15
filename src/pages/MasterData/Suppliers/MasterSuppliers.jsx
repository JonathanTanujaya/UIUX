import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { suppliersAPI } from '../../../services/api';

const MasterSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nama: '',
    kode_supplier: '',
    alamat: '',
    telepon: '',
    email: '',
    kontak_person: '',
    status: 'aktif',
  });
  const [editingId, setEditingId] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      const response = await suppliersAPI.getAll();
      
      // Since suppliersAPI.getAll() returns Laravel response: {success: true, message: "...", data: [...]}
      // We need to access response.data to get the array
      const suppliersData = response.data || [];
      
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('❌ Error fetching suppliers:', error);
      console.error('❌ Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await suppliersAPI.update(editingId, formData);
      } else {
        await suppliersAPI.create(formData);
      }

      // Reset form
      setFormData({
        nama: '',
        kode_supplier: '',
        alamat: '',
        telepon: '',
        email: '',
        kontak_person: '',
        status: 'aktif',
      });
      setEditingId(null);

      // Refresh data
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = supplier => {
    setFormData({
      nama: supplier.nama || supplier.namasupplier || '',
      kode_supplier: supplier.kodeSupplier || supplier.kodesupplier || supplier.kode_supplier || '',
      alamat: supplier.alamat || '',
      telepon: supplier.telepon || supplier.telp || '',
      email: supplier.email || '',
      kontak_person: supplier.kontakPerson || supplier.kontak_person || supplier.contact || '',
      status: supplier.status === true ? 'aktif' : 'nonaktif',
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      try {
        await suppliersAPI.delete(id);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const filteredSuppliers = suppliers.filter(
    supplier =>
      (supplier.namasupplier || supplier.nama || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (supplier.kodesupplier || supplier.kode_supplier || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (supplier.alamat || supplier.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {editingId ? 'Edit Supplier' : 'Tambah Supplier Baru'}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Supplier *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan nama supplier"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kode Supplier *
              </label>
              <input
                type="text"
                required
                value={formData.kode_supplier}
                onChange={e => setFormData({ ...formData, kode_supplier: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan kode supplier"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Telepon</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={e => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kontak Person
              </label>
              <input
                type="text"
                value={formData.kontak_person}
                onChange={e => setFormData({ ...formData, kontak_person: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan nama kontak person"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="aktif">Aktif</option>
                <option value="tidak aktif">Tidak Aktif</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat</label>
              <textarea
                value={formData.alamat}
                onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Masukkan alamat lengkap"
                rows="3"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
              >
                {editingId ? 'Update Supplier' : 'Simpan Supplier'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      nama: '',
                      kode_supplier: '',
                      alamat: '',
                      telepon: '',
                      email: '',
                      kontak_person: '',
                      status: 'aktif',
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
              <h3 className="text-xl font-bold text-slate-800">Daftar Suppliers</h3>

              <div className="relative w-full sm:w-96">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari suppliers..."
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
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Kode</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">
                    Nama Supplier
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Alamat</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Telepon</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-slate-600">Loading...</p>
                    </td>
                  </tr>
                ) : currentSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500">
                      Belum ada data supplier
                    </td>
                  </tr>
                ) : (
                  currentSuppliers.map((supplier, index) => (
                    <tr
                      key={supplier.id || supplier.kodesupplier || index}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-sm">
                        {supplier.kodeSupplier || supplier.kodesupplier || supplier.kode_supplier || '-'}
                      </td>
                      <td className="py-4 px-6 font-medium">
                        {supplier.nama || supplier.namasupplier || '-'}
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div className="truncate" title={supplier.alamat || '-'}>
                          {supplier.alamat || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-6">{supplier.telepon || supplier.telp || '-'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            supplier.status === true || supplier.status === 'aktif'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {supplier.status === true || supplier.status === 'aktif'
                            ? 'Aktif'
                            : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier.id)}
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
                  {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} dari{' '}
                  {filteredSuppliers.length} suppliers
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

export default MasterSuppliers;
