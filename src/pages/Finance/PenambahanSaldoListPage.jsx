import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Calendar, TrendingUp } from 'lucide-react';

const PenambahanSaldoListPage = () => {
  const navigate = useNavigate();
  const [penambahanSaldoData, setPenambahanSaldoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);

  // Dummy data untuk penambahan saldo
  const dummyPenambahanSaldoData = [
    {
      id: 'PS001',
      noRekening: '1234567890',
      namaBank: 'Bank Central Asia',
      atasNama: 'PT. Maju Jaya Sejahtera',
      nominal: 50000000,
      tanggal: '2025-01-20',
      keterangan: 'Penambahan saldo untuk operasional bulan Februari 2025',
      status: 'Disetujui',
      createdBy: 'Admin Finance'
    },
    {
      id: 'PS002',
      noRekening: '0987654321',
      namaBank: 'Bank Mandiri',
      atasNama: 'CV. Berkah Mandiri',
      nominal: 25000000,
      tanggal: '2025-01-18',
      keterangan: 'Top up saldo untuk pembayaran supplier',
      status: 'Pending',
      createdBy: 'Manager Keuangan'
    },
    {
      id: 'PS003',
      noRekening: '5678901234',
      namaBank: 'Bank BRI',
      atasNama: 'PT. Sukses Bersama',
      nominal: 75000000,
      tanggal: '2025-01-19',
      keterangan: 'Injeksi modal untuk ekspansi bisnis Q1 2025',
      status: 'Disetujui',
      createdBy: 'Direktur Keuangan'
    },
    {
      id: 'PS004',
      noRekening: '3456789012',
      namaBank: 'Bank BNI',
      atasNama: 'UD. Sumber Rejeki',
      nominal: 15000000,
      tanggal: '2025-01-17',
      keterangan: 'Penambahan saldo darurat untuk kebutuhan mendesak',
      status: 'Ditolak',
      createdBy: 'Staff Finance'
    }
  ];

  useEffect(() => {
    loadPenambahanSaldoData();
  }, []);

  const loadPenambahanSaldoData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPenambahanSaldoData(dummyPenambahanSaldoData);
      setFilteredData(dummyPenambahanSaldoData);
      setLoading(false);
    }, 1000);
  };

  // Filter data berdasarkan search term dan date range
  useEffect(() => {
    let filtered = penambahanSaldoData;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.noRekening.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.atasNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keterangan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tanggal);
        const startDate = new Date(selectedDateRange.start);
        const endDate = new Date(selectedDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedDateRange, penambahanSaldoData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Disetujui': 'bg-green-100 text-green-800 border-green-300',
      'Ditolak': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  const handleCreate = () => {
    navigate('/finance/penambahan-saldo/create');
  };

  const handleEdit = (id) => {
    navigate(`/finance/penambahan-saldo/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/finance/penambahan-saldo/view/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data penambahan saldo ini?')) {
      setPenambahanSaldoData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleApprove = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menyetujui penambahan saldo ini?')) {
      setPenambahanSaldoData(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: 'Disetujui' } : item
        )
      );
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menolak penambahan saldo ini?')) {
      setPenambahanSaldoData(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: 'Ditolak' } : item
        )
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-green-600" />
              Penambahan Saldo
            </h1>
            <p className="text-gray-600 mt-1">Kelola data penambahan saldo rekening</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Penambahan Saldo
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
                placeholder="Cari berdasarkan No. Rekening, Bank, Atas Nama, Keterangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <span className="text-gray-500">s/d</span>
            <input
              type="date"
              value={selectedDateRange.end}
              onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rekening & Bank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atas Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      {searchTerm || selectedDateRange.start || selectedDateRange.end 
                        ? 'Tidak ada data yang sesuai dengan filter'
                        : 'Belum ada data penambahan saldo'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.namaBank}</div>
                        <div className="text-sm text-gray-500 font-mono">{item.noRekening}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.atasNama}</div>
                        <div className="text-sm text-gray-500">ID: {item.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-green-600 text-lg">{formatCurrency(item.nominal)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{new Date(item.tanggal).toLocaleDateString('id-ID')}</div>
                        <div className="text-sm text-gray-500">oleh {item.createdBy}</div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900 max-w-xs truncate" title={item.keterangan}>
                          {item.keterangan}
                        </div>
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
                            disabled={item.status === 'Disetujui'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {item.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Setujui"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Tolak"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                            disabled={item.status === 'Disetujui'}
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
              <p className="text-sm font-medium text-gray-600">Total Penambahan</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredData.reduce((sum, item) => sum + item.nominal, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredData.filter(item => item.status === 'Disetujui').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
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
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredData.filter(item => item.status === 'Ditolak').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenambahanSaldoListPage;