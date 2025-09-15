import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReceipt,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

const PenerimaanResi = () => {
  const [resiData, setResiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    noResi: '',
    expedisi: '',
    pengirim: '',
    penerima: '',
    alamatPenerima: '',
    berat: '',
    ongkir: '',
    tglTerima: '',
    status: 'Diterima',
    keterangan: '',
  });

  // Sample data
  const sampleData = [
    {
      id: 1,
      noResi: 'RS-001-2024',
      expedisi: 'JNE',
      pengirim: 'PT ABC Company',
      penerima: 'CV XYZ Trading',
      alamatPenerima: 'Jl. Sudirman No. 123, Jakarta',
      berat: 2.5,
      ongkir: 25000,
      tglTerima: '2024-01-15',
      status: 'Diterima',
      keterangan: 'Paket dokumen penting',
    },
    {
      id: 2,
      noResi: 'RS-002-2024',
      expedisi: 'TIKI',
      pengirim: 'CV DEF Trading',
      penerima: 'PT GHI Industries',
      alamatPenerima: 'Jl. Gatot Subroto No. 456, Bandung',
      berat: 5.0,
      ongkir: 45000,
      tglTerima: '2024-01-20',
      status: 'Dalam Perjalanan',
      keterangan: 'Spare part mesin',
    },
    {
      id: 3,
      noResi: 'RS-003-2024',
      expedisi: 'POS Indonesia',
      pengirim: 'PT JKL Corporation',
      penerima: 'CV MNO Trading',
      alamatPenerima: 'Jl. Asia Afrika No. 789, Surabaya',
      berat: 1.2,
      ongkir: 15000,
      tglTerima: '2024-01-25',
      status: 'Diterima',
      keterangan: 'Sample produk',
    },
  ];

  useEffect(() => {
    setResiData(sampleData);
    setFilteredData(sampleData);
  }, []);

  useEffect(() => {
    let filtered = resiData;

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.noResi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.expedisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.penerima.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan rentang tanggal
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tglTerima);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDateRange, resiData]);

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      setResiData(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...formData,
                id: editingId,
                berat: parseFloat(formData.berat),
                ongkir: parseFloat(formData.ongkir),
              }
            : item
        )
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        berat: parseFloat(formData.berat),
        ongkir: parseFloat(formData.ongkir),
      };
      setResiData(prev => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEdit = item => {
    setFormData({
      noResi: item.noResi,
      expedisi: item.expedisi,
      pengirim: item.pengirim,
      penerima: item.penerima,
      alamatPenerima: item.alamatPenerima,
      berat: item.berat.toString(),
      ongkir: item.ongkir.toString(),
      tglTerima: item.tglTerima,
      status: item.status,
      keterangan: item.keterangan,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = id => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setResiData(prev => prev.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      noResi: '',
      expedisi: '',
      pengirim: '',
      penerima: '',
      alamatPenerima: '',
      berat: '',
      ongkir: '',
      tglTerima: '',
      status: 'Diterima',
      keterangan: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Diterima':
        return 'text-green-600 bg-green-100';
      case 'Dalam Perjalanan':
        return 'text-blue-600 bg-blue-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Dikembalikan':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari no resi, expedisi, pengirim..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDateRange.start}
              onChange={e => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDateRange.end}
              onChange={e => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tambah Resi
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Data Resi' : 'Tambah Data Resi'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No Resi</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.noResi}
                    onChange={e => setFormData(prev => ({ ...prev, noResi: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expedisi</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.expedisi}
                    onChange={e => setFormData(prev => ({ ...prev, expedisi: e.target.value }))}
                  >
                    <option value="">Pilih Expedisi</option>
                    <option value="JNE">JNE</option>
                    <option value="TIKI">TIKI</option>
                    <option value="POS Indonesia">POS Indonesia</option>
                    <option value="J&T Express">J&T Express</option>
                    <option value="SiCepat">SiCepat</option>
                    <option value="Wahana">Wahana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pengirim</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.pengirim}
                    onChange={e => setFormData(prev => ({ ...prev, pengirim: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penerima</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.penerima}
                    onChange={e => setFormData(prev => ({ ...prev, penerima: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Penerima
                  </label>
                  <textarea
                    rows="2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.alamatPenerima}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, alamatPenerima: e.target.value }))
                    }
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.berat}
                    onChange={e => setFormData(prev => ({ ...prev, berat: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ongkos Kirim
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.ongkir}
                    onChange={e => setFormData(prev => ({ ...prev, ongkir: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Terima
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tglTerima}
                    onChange={e => setFormData(prev => ({ ...prev, tglTerima: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Diterima">Diterima</option>
                    <option value="Dalam Perjalanan">Dalam Perjalanan</option>
                    <option value="Pending">Pending</option>
                    <option value="Dikembalikan">Dikembalikan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.keterangan}
                  onChange={e => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No Resi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expedisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengirim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penerima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Berat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ongkir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tgl Terima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.noResi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.expedisi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.pengirim}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.penerima}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.berat} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(item.ongkir)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglTerima}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">Tidak ada data yang ditemukan</div>
        )}
      </div>
    </div>
  );
};

export default PenerimaanResi;
