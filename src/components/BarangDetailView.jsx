import React, { useState } from 'react';

// Mock data untuk detail barang (stok per batch)
const generateDetailData = (kodeBarang) => {
  const details = [
    {
      id: 1,
      tanggal_masuk: '2024-01-15',
      modal: 12000000,
      stok: 5,
      keterangan: 'Pembelian rutin'
    },
    {
      id: 2,
      tanggal_masuk: '2024-02-10',
      modal: 12500000,
      stok: 3,
      keterangan: 'Restock urgent'
    },
    {
      id: 3,
      tanggal_masuk: '2024-03-05',
      modal: 13000000,
      stok: 7,
      keterangan: 'Pembelian bulk'
    }
  ];
  
  return details.map(item => ({
    ...item,
    kode_barang: kodeBarang
  }));
};

const BarangDetailView = ({ barang, onBack, onEdit }) => {
  const [detailData, setDetailData] = useState(generateDetailData(barang.kode_barang));
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    tanggal_masuk: new Date().toISOString().split('T')[0],
    modal: '',
    stok: '',
    keterangan: ''
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const totalStok = detailData.reduce((sum, item) => sum + item.stok, 0);
  const avgModal = detailData.length > 0 
    ? detailData.reduce((sum, item) => sum + item.modal, 0) / detailData.length 
    : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDetail = (e) => {
    e.preventDefault();
    
    const newDetail = {
      id: Math.max(...detailData.map(d => d.id)) + 1,
      kode_barang: barang.kode_barang,
      tanggal_masuk: formData.tanggal_masuk,
      modal: parseFloat(formData.modal) || 0,
      stok: parseInt(formData.stok) || 0,
      keterangan: formData.keterangan || 'Tambah stok manual'
    };

    setDetailData(prev => [...prev, newDetail]);
    
    // Reset form
    setFormData({
      tanggal_masuk: new Date().toISOString().split('T')[0],
      modal: '',
      stok: '',
      keterangan: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteDetail = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus detail stok ini?')) {
      setDetailData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan tombol back */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📦 Detail Barang</h1>
              <p className="text-gray-600">Kelola detail stok per batch masuk</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Master Barang
          </button>
        </div>
      </div>

      {/* Info Master Barang */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Master Barang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">Kode Barang</label>
            <p className="mt-1 text-lg font-semibold text-gray-900 font-mono">{barang.kode_barang}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Nama Barang</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{barang.nama_barang}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Kategori</label>
            <p className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {barang.kategori}
              </span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Harga Jual</label>
            <p className="mt-1 text-lg font-semibold text-green-600">
              {formatCurrency(barang.harga_jual)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Merk</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{barang.merk}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Satuan</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{barang.satuan}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Lokasi</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{barang.lokasi}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Stok Minimum</label>
            <p className="mt-1 text-lg font-medium text-gray-900">{barang.stok_min} {barang.satuan}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Stok</p>
              <p className="text-2xl font-bold text-gray-900">{totalStok} {barang.satuan}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Modal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgModal)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a1 1 0 011-1h6a1 1 0 011 1v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Jumlah Batch</p>
              <p className="text-2xl font-bold text-gray-900">{detailData.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Stok Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Detail Stok per Batch</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showAddForm ? 'Batal' : 'Tambah Batch'}
            </button>
          </div>
        </div>

        {/* Form Tambah Detail */}
        {showAddForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <form onSubmit={handleAddDetail} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Masuk *
                </label>
                <input
                  type="date"
                  name="tanggal_masuk"
                  value={formData.tanggal_masuk}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modal per Unit *
                </label>
                <input
                  type="number"
                  name="modal"
                  value={formData.modal}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Stok *
                </label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keterangan
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    placeholder="Catatan optional"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Masuk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modal per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Modal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detailData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.tanggal_masuk)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.modal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.stok} {barang.satuan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(item.modal * item.stok)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.keterangan || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteDetail(item.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {detailData.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1M4 13v-1a1 1 0 011-1h1m0 0V9a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2.08" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada detail stok</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan batch stok pertama.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarangDetailView;
