import React, { useState } from 'react';
import BarangTable from '../../../components/Tables/BarangTable';
import BarangForm from '../../../components/BarangForm';
import BarangDetailView from '../../../components/BarangDetailView';

// Mock data untuk master barang
import React, { useState, useMemo } from 'react';
import BarangDetailView from '../../../components/BarangDetailView';
import BarangForm from '../../../components/BarangForm';

// Mock data untuk barang
const mockBarangData = [
  {
    id: 1,
    kode_barang: 'BRG001',
    nama_barang: 'Laptop Dell Latitude 5420',
    kategori: 'Elektronik',
    merk: 'Dell',
    satuan: 'unit',
    lokasi: 'Rak A1',
    harga_jual: 15000000,
    stok_min: 2,
    total_stok: 15
  },
  {
    id: 2,
    kode_barang: 'BRG002',
    nama_barang: 'Mouse Logitech MX Master 3',
    kategori: 'Elektronik',
    merk: 'Logitech',
    satuan: 'pcs',
    lokasi: 'Rak A2',
    harga_jual: 1200000,
    stok_min: 5,
    total_stok: 23
  },
  {
    id: 3,
    kode_barang: 'BRG003',
    nama_barang: 'Ban Michelin 225/60R16',
    kategori: 'Otomotif',
    merk: 'Michelin',
    satuan: 'pcs',
    lokasi: 'Gudang B',
    harga_jual: 800000,
    stok_min: 4,
    total_stok: 12
  },
  {
    id: 4,
    kode_barang: 'BRG004',
    nama_barang: 'Kemeja Formal Oxford',
    kategori: 'Fashion',
    merk: 'Arrow',
    satuan: 'pcs',
    lokasi: 'Rak C1',
    harga_jual: 350000,
    stok_min: 10,
    total_stok: 8
  },
  {
    id: 5,
    kode_barang: 'BRG005',
    nama_barang: 'Suplemen Vitamin D3',
    kategori: 'Kesehatan',
    merk: 'Nature Made',
    satuan: 'box',
    lokasi: 'Rak D2',
    harga_jual: 120000,
    stok_min: 15,
    total_stok: 45
  }
];

const MasterBarang = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'form'
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [barangData, setBarangData] = useState(mockBarangData);
  const [showForm, setShowForm] = useState(false);
  const [editingBarang, setEditingBarang] = useState(null);

  // Filter dan search logic
  const filteredBarang = useMemo(() => {
    return barangData.filter(barang => {
      const matchesSearch = 
        barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barang.kode_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barang.merk.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesKategori = !selectedKategori || barang.kategori === selectedKategori;
      
      return matchesSearch && matchesKategori;
    });
  }, [barangData, searchTerm, selectedKategori]);

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(barangData.map(barang => barang.kategori))];
  }, [barangData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (currentStock, minStock) => {
    if (currentStock <= minStock) {
      return { label: 'Stok Rendah', color: 'bg-red-100 text-red-800' };
    } else if (currentStock <= minStock * 1.5) {
      return { label: 'Stok Sedang', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'Stok Cukup', color: 'bg-green-100 text-green-800' };
    }
  };

  const handleRowClick = (barang) => {
    setSelectedBarang(barang);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBarang(null);
  };

  const handleEditBarang = (barang = null) => {
    setEditingBarang(barang);
    setShowForm(true);
    if (barang) {
      setCurrentView('list'); // Kembali ke list jika dari detail view
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingBarang) {
      // Update existing barang
      setBarangData(prev => prev.map(item => 
        item.id === editingBarang.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Add new barang
      const newBarang = {
        id: Math.max(...barangData.map(b => b.id)) + 1,
        ...formData,
        total_stok: 0 // New barang starts with 0 stock
      };
      setBarangData(prev => [...prev, newBarang]);
    }
    
    setShowForm(false);
    setEditingBarang(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBarang(null);
  };

  // Render berdasarkan view yang aktif
  if (currentView === 'detail' && selectedBarang) {
    return (
      <BarangDetailView
        barang={selectedBarang}
        onBack={handleBackToList}
        onEdit={() => handleEditBarang(selectedBarang)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📦 Master Barang</h1>
            <p className="text-gray-600">Kelola data master barang dan stok gudang</p>
          </div>
          <button
            onClick={() => handleEditBarang()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Barang
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <p className="text-sm font-medium text-gray-500">Total Barang</p>
              <p className="text-2xl font-bold text-gray-900">{barangData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Stok Cukup</p>
              <p className="text-2xl font-bold text-gray-900">
                {barangData.filter(b => b.total_stok > b.stok_min * 1.5).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Perlu Restock</p>
              <p className="text-2xl font-bold text-gray-900">
                {barangData.filter(b => b.total_stok <= b.stok_min * 1.5 && b.total_stok > b.stok_min).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Stok Habis</p>
              <p className="text-2xl font-bold text-gray-900">
                {barangData.filter(b => b.total_stok <= b.stok_min).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Barang
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, kode, atau merk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Kategori
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map(kategori => (
                <option key={kategori} value={kategori}>{kategori}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barang
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Jual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBarang.map((barang) => {
                const stockStatus = getStockStatus(barang.total_stok, barang.stok_min);
                return (
                  <tr 
                    key={barang.id} 
                    onClick={() => handleRowClick(barang)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {barang.kode_barang.slice(-2)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {barang.nama_barang}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            {barang.kode_barang} • {barang.merk}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {barang.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">{barang.total_stok}</span> {barang.satuan}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {barang.stok_min} {barang.satuan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      📍 {barang.lokasi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(barang.harga_jual)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredBarang.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1M4 13v-1a1 1 0 011-1h1m0 0V9a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2.08" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada barang ditemukan</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedKategori 
                  ? 'Coba ubah kata kunci atau filter kategori.'
                  : 'Mulai dengan menambahkan barang pertama.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <BarangForm
        isOpen={showForm}
        onClose={handleFormClose}
        barang={editingBarang}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default MasterBarang;

const MasterBarang = () => {
  const [data, setData] = useState(mockBarangData);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data berdasarkan search term
  const filteredData = data.filter(item =>
    item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.merk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${item.nama_barang}?`)) {
      setData(prev => prev.filter(d => d.id !== item.id));
      if (selectedBarang && selectedBarang.id === item.id) {
        setSelectedBarang(null);
      }
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      // Update existing item
      setData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Math.max(...data.map(d => d.id)) + 1,
        status: true
      };
      setData(prev => [...prev, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleRowClick = (item) => {
    setSelectedBarang(item);
  };

  const handleBackToList = () => {
    setSelectedBarang(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📦 Master Barang</h1>
              <p className="text-gray-600 mt-1">Kelola data master barang dan detail stok</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Barang Baru
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {!selectedBarang && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nama barang, kode barang, atau merk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedBarang ? (
          // Detail View
          <BarangDetailView 
            barang={selectedBarang} 
            onBack={handleBackToList}
            onEdit={() => handleEdit(selectedBarang)}
          />
        ) : (
          // Table View
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Master Barang</h2>
                <span className="text-sm text-gray-500">
                  Menampilkan {filteredData.length} dari {data.length} barang
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode Barang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Barang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga Jual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr 
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900">
                          {item.kode_barang}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.nama_barang}</div>
                          <div className="text-sm text-gray-500">{item.satuan}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(item.harga_jual)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.merk}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1M4 13v-1a1 1 0 011-1h1m0 0V9a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2.08" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data barang</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Tidak ditemukan barang yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan barang baru.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <BarangForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
};

export default MasterBarang;
