import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, CreditCard, Building2, User, Calendar, DollarSign } from 'lucide-react';

const PiutangResiViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPiutangData();
  }, [id]);

  const loadPiutangData = () => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyData = {
        id: 'PR001',
        noResi: 'RSI-2025-001',
        customer: 'PT. Maju Jaya Sejahtera',
        kodeCustomer: 'C001',
        namaBank: 'Bank Central Asia',
        noRekening: '1234567890',
        nominal: 15000000,
        tanggalBayar: '2025-01-20',
        tanggalJatuhTempo: '2025-01-25',
        status: 'Pending',
        keterangan: 'Pembayaran invoice bulan Desember 2024 untuk pengadaan spare parts mesin produksi utama',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-18T14:20:00Z'
      };
      setData(dummyData);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Lunas': 'bg-green-100 text-green-800 border-green-300',
      'Overdue': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 h-full">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-gray-50 h-full">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Piutang resi yang Anda cari tidak dapat ditemukan.</p>
          <button
            onClick={() => navigate('/finance/piutang-resi')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Kembali ke Daftar Piutang Resi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/finance/piutang-resi')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Piutang Resi</h1>
              <p className="text-gray-600">{data.noResi}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge(data.status)}
            <button
              onClick={() => navigate(`/finance/piutang-resi/edit/${id}`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informasi Customer
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Customer</label>
                <p className="text-gray-900 font-medium">{data.customer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Customer</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded inline-block">{data.kodeCustomer}</p>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Informasi Bank
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                <p className="text-gray-900 font-medium">{data.namaBank}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening Tujuan</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded inline-block">{data.noRekening}</p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Detail Transaksi
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bayar</label>
                <p className="text-gray-900">{formatDate(data.tanggalBayar)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
                <p className="text-gray-900">{formatDate(data.tanggalJatuhTempo)}</p>
              </div>
            </div>

            {data.keterangan && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{data.keterangan}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Ringkasan Nominal
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Total Nominal</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(data.nominal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status Pembayaran</span>
                {getStatusBadge(data.status)}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Dibuat
                </label>
                <p className="text-sm text-gray-900">{formatDateTime(data.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Terakhir Diperbarui
                </label>
                <p className="text-sm text-gray-900">{formatDateTime(data.updatedAt)}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  ID Resi
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{data.id}</p>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/finance/piutang-resi/edit/${id}`)}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Piutang Resi
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Resi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiutangResiViewPage;