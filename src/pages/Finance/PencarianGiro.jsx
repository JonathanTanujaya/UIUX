import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faCalendarAlt,
  faMoneyBill,
  faEye,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

const PencarianGiro = () => {
  const [giroData, setGiroData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    noGiro: '',
    bank: '',
    penerbit: '',
    status: '',
    startDate: '',
    endDate: '',
    minNominal: '',
    maxNominal: '',
  });
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  // Sample data
  const sampleData = [
    {
      id: 1,
      noGiro: 'GR-001-2024',
      bank: 'Bank BCA',
      penerbit: 'PT ABC Company',
      nominal: 5000000,
      tglTerima: '2024-01-15',
      tglJatuhTempo: '2024-02-15',
      status: 'Pending',
      keterangan: 'Pembayaran invoice INV-001',
    },
    {
      id: 2,
      noGiro: 'GR-002-2024',
      bank: 'Bank Mandiri',
      penerbit: 'CV XYZ Trading',
      nominal: 3500000,
      tglTerima: '2024-01-20',
      tglJatuhTempo: '2024-02-20',
      status: 'Cair',
      keterangan: 'Pembayaran invoice INV-002',
    },
    {
      id: 3,
      noGiro: 'GR-003-2024',
      bank: 'Bank BRI',
      penerbit: 'PT DEF Corporation',
      nominal: 7500000,
      tglTerima: '2024-01-25',
      tglJatuhTempo: '2024-02-25',
      status: 'Pending',
      keterangan: 'Pembayaran invoice INV-003',
    },
    {
      id: 4,
      noGiro: 'GR-004-2024',
      bank: 'Bank BNI',
      penerbit: 'PT GHI Industries',
      nominal: 2000000,
      tglTerima: '2024-01-30',
      tglJatuhTempo: '2024-03-01',
      status: 'Cair',
      keterangan: 'Pembayaran invoice INV-004',
    },
    {
      id: 5,
      noGiro: 'GR-005-2024',
      bank: 'Bank BCA',
      penerbit: 'CV JKL Trading',
      nominal: 4200000,
      tglTerima: '2024-02-05',
      tglJatuhTempo: '2024-03-05',
      status: 'Tolak',
      keterangan: 'Pembayaran invoice INV-005',
    },
  ];

  useEffect(() => {
    setGiroData(sampleData);
    setFilteredData(sampleData);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchFilters]);

  const applyFilters = () => {
    let filtered = giroData;

    // Filter berdasarkan no giro
    if (searchFilters.noGiro) {
      filtered = filtered.filter(item =>
        item.noGiro.toLowerCase().includes(searchFilters.noGiro.toLowerCase())
      );
    }

    // Filter berdasarkan bank
    if (searchFilters.bank) {
      filtered = filtered.filter(item =>
        item.bank.toLowerCase().includes(searchFilters.bank.toLowerCase())
      );
    }

    // Filter berdasarkan penerbit
    if (searchFilters.penerbit) {
      filtered = filtered.filter(item =>
        item.penerbit.toLowerCase().includes(searchFilters.penerbit.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (searchFilters.status) {
      filtered = filtered.filter(item => item.status === searchFilters.status);
    }

    // Filter berdasarkan rentang tanggal
    if (searchFilters.startDate && searchFilters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.tglTerima);
        const startDate = new Date(searchFilters.startDate);
        const endDate = new Date(searchFilters.endDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filter berdasarkan nominal
    if (searchFilters.minNominal) {
      filtered = filtered.filter(item => item.nominal >= parseFloat(searchFilters.minNominal));
    }
    if (searchFilters.maxNominal) {
      filtered = filtered.filter(item => item.nominal <= parseFloat(searchFilters.maxNominal));
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      noGiro: '',
      bank: '',
      penerbit: '',
      status: '',
      startDate: '',
      endDate: '',
      minNominal: '',
      maxNominal: '',
    });
  };

  const exportToExcel = () => {
    // Implementasi export ke Excel
    alert('Fitur export akan segera tersedia');
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Cair':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Tolak':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusCount = status => {
    return filteredData.filter(item => item.status === status).length;
  };

  const getTotalNominal = () => {
    return filteredData.reduce((total, item) => total + item.nominal, 0);
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Giro</p>
              <p className="text-2xl font-bold text-blue-600">{filteredData.length}</p>
            </div>
            <FontAwesomeIcon icon={faMoneyBill} className="text-blue-500 text-2xl" />
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
              <p className="text-sm text-gray-600">Cair</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('Cair')}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Nominal</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(getTotalNominal())}</p>
            </div>
            <FontAwesomeIcon icon={faMoneyBill} className="text-blue-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filter Pencarian</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilter} />
              {showAdvancedFilter ? 'Filter Sederhana' : 'Filter Lanjutan'}
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Giro</label>
            <input
              type="text"
              placeholder="Cari berdasarkan no giro..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchFilters.noGiro}
              onChange={e => handleFilterChange('noGiro', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <input
              type="text"
              placeholder="Cari berdasarkan bank..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchFilters.bank}
              onChange={e => handleFilterChange('bank', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchFilters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Cair">Cair</option>
              <option value="Tolak">Tolak</option>
            </select>
          </div>
        </div>

        {showAdvancedFilter && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
              <input
                type="text"
                placeholder="Cari berdasarkan penerbit..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.penerbit}
                onChange={e => handleFilterChange('penerbit', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.startDate}
                onChange={e => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.endDate}
                onChange={e => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Min</label>
              <input
                type="number"
                placeholder="Nominal minimum..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.minNominal}
                onChange={e => handleFilterChange('minNominal', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Max</label>
              <input
                type="number"
                placeholder="Nominal maksimum..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchFilters.maxNominal}
                onChange={e => handleFilterChange('maxNominal', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredData.length} dari {giroData.length} data
          </p>
          <button onClick={clearFilters} className="text-gray-600 hover:text-gray-800 text-sm">
            Bersihkan Filter
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No Giro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penerbit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tgl Terima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
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
                    {item.noGiro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.bank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.penerbit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(item.nominal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglTerima}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.tglJatuhTempo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900" title="Lihat Detail">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data yang sesuai dengan kriteria pencarian
          </div>
        )}
      </div>
    </div>
  );
};

export default PencarianGiro;
