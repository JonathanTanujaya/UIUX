import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faCalendarAlt,
  faPiggyBank,
} from '@fortawesome/free-solid-svg-icons';

const PenambahanSaldo = () => {
  const [saldoData, setSaldoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    noTransaksi: '',
    akun: '',
    jenisTransaksi: '',
    nominal: '',
    tglTransaksi: '',
    referensi: '',
    keterangan: '',
    status: 'Pending',
  });

  // Sample data
  const sampleData = [
    {
      id: 1,
      noTransaksi: 'SA-001-2024',
      akun: 'Bank BCA - 1234567890',
      jenisTransaksi: 'Setoran Tunai',
      nominal: 5000000,
      tglTransaksi: '2024-01-15',
      referensi: 'DEP-001',
      keterangan: 'Setoran modal awal',
      status: 'Approved',
    },
    {
      id: 2,
      noTransaksi: 'SA-002-2024',
      akun: 'Bank Mandiri - 9876543210',
      jenisTransaksi: 'Transfer Masuk',
      nominal: 3500000,
      tglTransaksi: '2024-01-20',
      referensi: 'TRF-002',
      keterangan: 'Pembayaran dari customer PT ABC',
      status: 'Approved',
    },
    {
      id: 3,
      noTransaksi: 'SA-003-2024',
      akun: 'Bank BRI - 5555666677',
      jenisTransaksi: 'Pinjaman',
      nominal: 10000000,
      tglTransaksi: '2024-01-25',
      referensi: 'LOAN-003',
      keterangan: 'Pinjaman modal kerja',
      status: 'Pending',
    },
    {
      id: 4,
      noTransaksi: 'SA-004-2024',
      akun: 'Bank BNI - 1111222233',
      jenisTransaksi: 'Bunga Bank',
      nominal: 150000,
      tglTransaksi: '2024-02-01',
      referensi: 'INT-004',
      keterangan: 'Bunga deposito bulan Januari',
      status: 'Approved',
    },
  ];

  useEffect(() => {
    setSaldoData(sampleData);
    setFilteredData(sampleData);
  }, []);

  useEffect(() => {
    let filtered = saldoData;

    // Filter berdasarkan pencarian
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.noTransaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.akun.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.jenisTransaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.referensi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan rentang tanggal
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tglTransaksi);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDateRange, saldoData]);

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      setSaldoData(prev =>
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
      setSaldoData(prev => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEdit = item => {
    setFormData({
      noTransaksi: item.noTransaksi,
      akun: item.akun,
      jenisTransaksi: item.jenisTransaksi,
      nominal: item.nominal.toString(),
      tglTransaksi: item.tglTransaksi,
      referensi: item.referensi,
      keterangan: item.keterangan,
      status: item.status,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = id => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setSaldoData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleApproval = (id, newStatus) => {
    setSaldoData(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const resetForm = () => {
    setFormData({
      noTransaksi: '',
      akun: '',
      jenisTransaksi: '',
      nominal: '',
      tglTransaksi: '',
      referensi: '',
      keterangan: '',
      status: 'Pending',
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
      case 'Approved':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTotalSaldo = () => {
    return filteredData
      .filter(item => item.status === 'Approved')
      .reduce((total, item) => total + item.nominal, 0);
  };

  const getStatusCount = status => {
    return filteredData.filter(item => item.status === status).length;
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Saldo Masuk</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(getTotalSaldo())}</p>
            </div>
            <FontAwesomeIcon icon={faPiggyBank} className="text-green-500 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('Pending')}</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('Approved')}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('Rejected')}</p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
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
              placeholder="Cari no transaksi, akun, jenis..."
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
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tambah Saldo
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Penambahan Saldo' : 'Tambah Penambahan Saldo'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No Transaksi
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.noTransaksi}
                    onChange={e => setFormData(prev => ({ ...prev, noTransaksi: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Akun Bank</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.akun}
                    onChange={e => setFormData(prev => ({ ...prev, akun: e.target.value }))}
                  >
                    <option value="">Pilih Akun Bank</option>
                    <option value="Bank BCA - 1234567890">Bank BCA - 1234567890</option>
                    <option value="Bank Mandiri - 9876543210">Bank Mandiri - 9876543210</option>
                    <option value="Bank BRI - 5555666677">Bank BRI - 5555666677</option>
                    <option value="Bank BNI - 1111222233">Bank BNI - 1111222233</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Transaksi
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.jenisTransaksi}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, jenisTransaksi: e.target.value }))
                    }
                  >
                    <option value="">Pilih Jenis Transaksi</option>
                    <option value="Setoran Tunai">Setoran Tunai</option>
                    <option value="Transfer Masuk">Transfer Masuk</option>
                    <option value="Pinjaman">Pinjaman</option>
                    <option value="Bunga Bank">Bunga Bank</option>
                    <option value="Modal Tambahan">Modal Tambahan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
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
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.tglTransaksi}
                    onChange={e => setFormData(prev => ({ ...prev, tglTransaksi: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referensi</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.referensi}
                    onChange={e => setFormData(prev => ({ ...prev, referensi: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
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
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
                  No Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akun Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referensi
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
                    {item.noTransaksi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.akun}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.jenisTransaksi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold text-green-600">
                    +{formatCurrency(item.nominal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglTransaksi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.referensi}
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
                      {item.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(item.id, 'Approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleApproval(item.id, 'Rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            ✗
                          </button>
                        </>
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

export default PenambahanSaldo;
