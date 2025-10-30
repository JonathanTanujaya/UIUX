import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import BarangForm from '../../../components/BarangForm';

const mockBarangData = [
  {
    id: 1,
    kode: 'BRG001',
    nama: 'Bearing SKF 6205',
    kategori: 'Bearing',
    satuan: 'PCS',
    harga_jual: 150000,
    harga_beli: 120000,
    stok_min: 10,
    total_stok: 25
  },
  {
    id: 2,
    kode: 'BRG002',
    nama: 'V-Belt B50',
    kategori: 'Belt',
    satuan: 'PCS',
    harga_jual: 85000,
    harga_beli: 70000,
    stok_min: 5,
    total_stok: 12
  },
  {
    id: 3,
    kode: 'BRG003',
    nama: 'Oli SAE 40',
    kategori: 'Oli',
    satuan: 'LITER',
    harga_jual: 45000,
    harga_beli: 35000,
    stok_min: 20,
    total_stok: 50
  },
  {
    id: 4,
    kode: 'BRG004',
    nama: 'Pulley 4 inch',
    kategori: 'Pulley',
    satuan: 'PCS',
    harga_jual: 125000,
    harga_beli: 100000,
    stok_min: 8,
    total_stok: 15
  },
  {
    id: 5,
    kode: 'BRG005',
    nama: 'Gear Motor 1:50',
    kategori: 'Gear',
    satuan: 'PCS',
    harga_jual: 2500000,
    harga_beli: 2000000,
    stok_min: 2,
    total_stok: 5
  },
  {
    id: 6,
    kode: 'BRG006',
    nama: 'Coupling Flexible',
    kategori: 'Coupling',
    satuan: 'PCS',
    harga_jual: 350000,
    harga_beli: 280000,
    stok_min: 3,
    total_stok: 8
  },
  {
    id: 7,
    kode: 'BRG007',
    nama: 'Seal Ring 25mm',
    kategori: 'Seal',
    satuan: 'PCS',
    harga_jual: 15000,
    harga_beli: 12000,
    stok_min: 25,
    total_stok: 60
  },
  {
    id: 8,
    kode: 'BRG008',
    nama: 'Chain 16B-1',
    kategori: 'Chain',
    satuan: 'METER',
    harga_jual: 125000,
    harga_beli: 100000,
    stok_min: 10,
    total_stok: 30
  },
  {
    id: 9,
    kode: 'BRG009',
    nama: 'Sprocket 16T',
    kategori: 'Sprocket',
    satuan: 'PCS',
    harga_jual: 185000,
    harga_beli: 150000,
    stok_min: 5,
    total_stok: 18
  },
  {
    id: 10,
    kode: 'BRG010',
    nama: 'Pillow Block UCF205',
    kategori: 'Bearing',
    satuan: 'PCS',
    harga_jual: 275000,
    harga_beli: 220000,
    stok_min: 15,
    total_stok: 45
  }
];

const MasterBarang = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [currentView, setCurrentView] = useState('list');
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [barangData, setBarangData] = useState(mockBarangData);
  const [showForm, setShowForm] = useState(false);
  const [editingBarang, setEditingBarang] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleKategoriFilter = (kategori) => {
    setSelectedKategori(kategori);
  };

  const handleViewBarang = (barang) => {
    setSelectedBarang(barang);
    setCurrentView('detail');
  };

  const handleEditBarang = (barang) => {
    setEditingBarang(barang);
    setShowForm(true);
  };

  const handleDeleteBarang = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setBarangData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingBarang) {
      setBarangData(prev => prev.map(item => 
        item.id === editingBarang.id ? { ...item, ...formData } : item
      ));
    } else {
      const newBarang = {
        id: Date.now(),
        ...formData
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

  const filteredData = barangData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = selectedKategori === '' || item.kategori === selectedKategori;
    return matchesSearch && matchesKategori;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (stok, minStok) => {
    if (stok <= 0) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Habis</span>;
    } else if (stok <= minStok) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Rendah</span>;
    } else {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Normal</span>;
    }
  };

  if (currentView === 'detail' && selectedBarang) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentView('list')}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Kembali ke Daftar
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Detail Barang</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kode Barang</label>
                <p className="mt-1 text-lg font-mono">{selectedBarang.kode}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                <p className="mt-1 text-lg">{selectedBarang.nama}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <p className="mt-1 text-lg">{selectedBarang.kategori}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Satuan</label>
                <p className="mt-1 text-lg">{selectedBarang.satuan}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Harga Jual</label>
                <p className="mt-1 text-lg text-green-600 font-semibold">{formatCurrency(selectedBarang.harga_jual)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Harga Beli</label>
                <p className="mt-1 text-lg">{formatCurrency(selectedBarang.harga_beli)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Stok Minimum</label>
                <p className="mt-1 text-lg">{selectedBarang.stok_min}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Stok</label>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-lg font-semibold">{selectedBarang.total_stok}</p>
                  {getStatusBadge(selectedBarang.total_stok, selectedBarang.stok_min)}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => handleEditBarang(selectedBarang)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Barang
              </button>
              
              <button
                onClick={() => handleDeleteBarang(selectedBarang.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Barang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📦 Master Barang</h1>
              <p className="text-gray-600 mt-1">Kelola data barang dan inventory</p>
              <div className="mt-2 text-sm text-gray-500">
                Total: {filteredData.length} barang
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Barang
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari kode atau nama barang..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter Kategori</label>
              <select
                value={selectedKategori}
                onChange={(e) => handleKategoriFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                <option value="Bearing">Bearing</option>
                <option value="Belt">Belt</option>
                <option value="Oli">Oli</option>
                <option value="Pulley">Pulley</option>
                <option value="Gear">Gear</option>
                <option value="Coupling">Coupling</option>
                <option value="Seal">Seal</option>
                <option value="Chain">Chain</option>
                <option value="Sprocket">Sprocket</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Jual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {item.kode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.kategori}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.satuan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.harga_jual)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.total_stok}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.total_stok, item.stok_min)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewBarang(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="Lihat Detail"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditBarang(item)}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBarang(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Tidak ada data barang yang ditemukan</p>
                      {searchTerm && (
                        <p className="text-sm mt-2">
                          Coba ubah kata kunci pencarian atau filter kategori
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <BarangForm
            isOpen={showForm}
            onClose={handleFormClose}
            barang={editingBarang}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default MasterBarang;