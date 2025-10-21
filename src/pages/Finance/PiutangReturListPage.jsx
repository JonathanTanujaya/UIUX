import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Calendar, RefreshCw } from 'lucide-react';

const PiutangReturListPage = () => {
  const navigate = useNavigate();
  const [piutangReturData, setPiutangReturData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);

  // Dummy data untuk piutang retur
  const dummyPiutangReturData = [
    {
      id: 'PRR001',
      kodeCustomer: 'C001',
      namaCustomer: 'PT. Maju Jaya Sejahtera',
      noRetur: 'RTR-2025-001',
      tanggalResi: '2025-01-20',
      sisaRetur: 5500000,
      totalInvoice: 15000000,
      totalBayar: 9500000,
      status: 'Pending',
      jumlahInvoice: 3
    },
    {
      id: 'PRR002',
      kodeCustomer: 'C002',
      namaCustomer: 'CV. Berkah Mandiri',
      noRetur: 'RTR-2025-002',
      tanggalResi: '2025-01-18',
      sisaRetur: 0,
      totalInvoice: 8500000,
      totalBayar: 8500000,
      status: 'Lunas',
      jumlahInvoice: 2
    },
    {
      id: 'PRR003',
      kodeCustomer: 'C003',
      namaCustomer: 'PT. Sukses Bersama',
      noRetur: 'RTR-2025-003',
      tanggalResi: '2025-01-19',
      sisaRetur: 12000000,
      totalInvoice: 22000000,
      totalBayar: 10000000,
      status: 'Partial',
      jumlahInvoice: 4
    }
  ];

  useEffect(() => {
    loadPiutangReturData();
  }, []);

  const loadPiutangReturData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPiutangReturData(dummyPiutangReturData);
      setFilteredData(dummyPiutangReturData);
      setLoading(false);
    }, 1000);
  };

  // Filter data berdasarkan search term dan date range
  useEffect(() => {
    let filtered = piutangReturData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.noRetur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaCustomer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodeCustomer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggalResi);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDateRange, piutangReturData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Lunas': 'bg-green-100 text-green-800 border-green-300',
      'Partial': 'bg-blue-100 text-blue-800 border-blue-300',
      'Overdue': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  const handleCreate = () => {
    navigate('/finance/piutang-retur/create');
  };

  const handleEdit = (id) => {
    navigate(`/finance/piutang-retur/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/finance/piutang-retur/view/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data piutang retur ini?')) {
      setPiutangReturData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-7 h-7 text-blue-600" />
              Piutang Retur
            </h1>
            <p className="text-gray-600 mt-1">Kelola data piutang retur dan pembayaran customer</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Piutang Retur
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan No. Retur, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDateRange.start}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">s/d</span>
            <input
              type="date"
              value={selectedDateRange.end}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDateRange({ start: '', end: '' });
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Retur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Resi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bayar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sisa Retur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      {searchTerm || selectedDateRange.start || selectedDateRange.end 
                        ? 'Tidak ada data yang sesuai dengan filter'
                        : 'Belum ada data piutang retur'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.noRetur}</div>
                        <div className="text-sm text-gray-500">{item.jumlahInvoice} invoice</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.namaCustomer}</div>
                        <div className="text-sm text-gray-500">{item.kodeCustomer}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{new Date(item.tanggalResi).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{formatCurrency(item.totalInvoice)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-green-600">{formatCurrency(item.totalBayar)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`font-medium ${item.sisaRetur > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(item.sisaRetur)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleView(item.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Piutang Retur</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredData.reduce((sum, item) => sum + item.sisaRetur, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lunas</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredData.filter(item => item.status === 'Lunas').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Partial</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredData.filter(item => item.status === 'Partial').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredData.filter(item => item.status === 'Pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiutangReturListPage;