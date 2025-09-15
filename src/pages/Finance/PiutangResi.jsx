import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

const PiutangResi = () => {
  const [piutangData, setPiutangData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    noResi: '',
    customer: '',
    alamat: '',
    nominal: '',
    tglJatuhTempo: '',
    tglBayar: '',
    status: 'Belum Lunas',
    keterangan: '',
  });

  // Sample data
  const sampleData = [
    {
      id: 1,
      noResi: 'PR-001-2024',
      customer: 'PT ABC Company',
      alamat: 'Jl. Sudirman No. 123, Jakarta',
      nominal: 150000,
      tglJatuhTempo: '2024-02-15',
      tglBayar: '',
      status: 'Belum Lunas',
      keterangan: 'Ongkir pengiriman barang',
    },
    {
      id: 2,
      noResi: 'PR-002-2024',
      customer: 'CV XYZ Trading',
      alamat: 'Jl. Gatot Subroto No. 456, Bandung',
      nominal: 275000,
      tglJatuhTempo: '2024-02-10',
      tglBayar: '2024-02-08',
      status: 'Lunas',
      keterangan: 'Ongkir pengiriman spare part',
    },
    {
      id: 3,
      noResi: 'PR-003-2024',
      customer: 'PT DEF Corporation',
      alamat: 'Jl. Asia Afrika No. 789, Surabaya',
      nominal: 320000,
      tglJatuhTempo: '2024-02-20',
      tglBayar: '',
      status: 'Jatuh Tempo',
      keterangan: 'Ongkir pengiriman produk jadi',
    },
    {
      id: 4,
      noResi: 'PR-004-2024',
      customer: 'CV GHI Trading',
      alamat: 'Jl. Diponegoro No. 321, Yogyakarta',
      nominal: 180000,
      tglJatuhTempo: '2024-02-25',
      tglBayar: '',
      status: 'Belum Lunas',
      keterangan: 'Ongkir pengiriman sample',
    },
  ];

  useEffect(() => {
    setPiutangData(sampleData);
    setFilteredData(sampleData);
  }, []);

  useEffect(() => {
    let filtered = piutangData;

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.noResi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan rentang tanggal
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tglJatuhTempo);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDateRange, piutangData]);

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      setPiutangData(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...formData,
                id: editingId,
                nominal: parseFloat(formData.nominal),
              }
            : item
        )
      );
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        nominal: parseFloat(formData.nominal),
      };
      setPiutangData(prev => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEdit = item => {
    setFormData({
      noResi: item.noResi,
      customer: item.customer,
      alamat: item.alamat,
      nominal: item.nominal.toString(),
      tglJatuhTempo: item.tglJatuhTempo,
      tglBayar: item.tglBayar,
      status: item.status,
      keterangan: item.keterangan,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = id => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setPiutangData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handlePayment = id => {
    const today = new Date().toISOString().split('T')[0];
    setPiutangData(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Lunas', tglBayar: today } : item))
    );
  };

  const resetForm = () => {
    setFormData({
      noResi: '',
      customer: '',
      alamat: '',
      nominal: '',
      tglJatuhTempo: '',
      tglBayar: '',
      status: 'Belum Lunas',
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
      case 'Lunas':
        return 'text-green-600 bg-green-100';
      case 'Belum Lunas':
        return 'text-yellow-600 bg-yellow-100';
      case 'Jatuh Tempo':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTotalPiutang = () => {
    return filteredData
      .filter(item => item.status !== 'Lunas')
      .reduce((total, item) => total + item.nominal, 0);
  };

  const getStatusCount = status => {
    return filteredData.filter(item => item.status === status).length;
  };

  const isOverdue = (tglJatuhTempo, status) => {
    if (status === 'Lunas') return false;
    const today = new Date();
    const dueDate = new Date(tglJatuhTempo);
    return dueDate < today;
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Piutang</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(getTotalPiutang())}</p>
            </div>
            <FontAwesomeIcon icon={faCreditCard} className="text-red-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Belum Lunas</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('Belum Lunas')}</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jatuh Tempo</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('Jatuh Tempo')}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lunas</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('Lunas')}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

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
              placeholder="Cari no resi, customer, alamat..."
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
            Tambah Piutang
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Data Piutang' : 'Tambah Data Piutang'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.customer}
                    onChange={e => setFormData(prev => ({ ...prev, customer: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    rows="2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.alamat}
                    onChange={e => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nominal}
                    onChange={e => setFormData(prev => ({ ...prev, nominal: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tglJatuhTempo}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, tglJatuhTempo: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Bayar
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tglBayar}
                    onChange={e => setFormData(prev => ({ ...prev, tglBayar: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Belum Lunas">Belum Lunas</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Jatuh Tempo">Jatuh Tempo</option>
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
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tgl Bayar
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
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${isOverdue(item.tglJatuhTempo, item.status) ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.noResi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.customer}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate"
                    title={item.alamat}
                  >
                    {item.alamat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(item.nominal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglJatuhTempo}
                    {isOverdue(item.tglJatuhTempo, item.status) && (
                      <span className="text-red-500 text-xs block">Terlambat</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglBayar || '-'}
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
                      {item.status !== 'Lunas' && (
                        <button
                          onClick={() => handlePayment(item.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Bayar"
                        >
                          <FontAwesomeIcon icon={faCreditCard} />
                        </button>
                      )}
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

export default PiutangResi;
