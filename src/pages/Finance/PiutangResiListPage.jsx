import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Calendar, CreditCard } from 'lucide-react';

const PiutangResiListPage = () => {
  const navigate = useNavigate();
  const [piutangData, setPiutangData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);

  // Dummy data untuk piutang resi
  const dummyPiutangData = [
    {
      id: 'PR001',
      noResi: 'RSI-2025-001',
      customer: 'PT. Maju Jaya Sejahtera',
      kodeCustomer: 'C001',
      namaBank: 'Bank BCA',
      noRekening: '1234567890',
      nominal: 15000000,
      tanggalBayar: '2025-01-20',
      tanggalJatuhTempo: '2025-01-25',
      status: 'Pending',
      keterangan: 'Pembayaran invoice bulan Desember 2024'
    },
    {
      id: 'PR002',
      noResi: 'RSI-2025-002',
      customer: 'CV. Berkah Mandiri',
      kodeCustomer: 'C002',
      namaBank: 'Bank Mandiri',
      noRekening: '0987654321',
      nominal: 8500000,
      tanggalBayar: '2025-01-18',
      tanggalJatuhTempo: '2025-01-23',
      status: 'Lunas',
      keterangan: 'Pelunasan piutang periode November 2024'
    },
    {
      id: 'PR003',
      noResi: 'RSI-2025-003',
      customer: 'PT. Sukses Bersama',
      kodeCustomer: 'C003',
      namaBank: 'Bank BRI',
      noRekening: '5678901234',
      nominal: 22000000,
      tanggalBayar: '2025-01-19',
      tanggalJatuhTempo: '2025-01-30',
      status: 'Overdue',
      keterangan: 'Pembayaran invoice Q4 2024'
    }
  ];

  useEffect(() => {
    loadPiutangData();
  }, []);

  const loadPiutangData = () => {
    setLoading(true);
    // Load dummy data immediately
    setPiutangData(dummyPiutangData);
    setFilteredData(dummyPiutangData);
    setLoading(false);
  };

  // Filter data berdasarkan search term dan date range
  useEffect(() => {
    let filtered = piutangData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.noResi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodeCustomer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaBank.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggalBayar);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDateRange, piutangData]);

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
      'Overdue': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  const handleCreate = () => {
    navigate('/finance/piutang-resi/create');
  };

  const handleEdit = (id) => {
    navigate(`/finance/piutang-resi/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/finance/piutang-resi/view/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data piutang resi ini?')) {
      setPiutangData(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan No. Resi, Customer, atau Bank..."
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

          {/* Clear Filters and Add Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDateRange({ start: '', end: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Filter
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Piutang Resi
            </button>
          </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Resi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank & Rekening</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Bayar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
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
                        : 'Belum ada data piutang resi'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.noResi}</div>
                        <div className="text-sm text-gray-500">{item.kodeCustomer}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.customer}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.namaBank}</div>
                        <div className="text-sm text-gray-500">{item.noRekening}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{formatCurrency(item.nominal)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{new Date(item.tanggalBayar).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{new Date(item.tanggalJatuhTempo).toLocaleDateString('id-ID')}</div>
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

      {/* Summary Card */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Piutang</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredData.reduce((sum, item) => sum + item.nominal, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sudah Lunas</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredData.filter(item => item.status === 'Lunas').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredData.filter(item => item.status === 'Overdue').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiutangResiListPage;