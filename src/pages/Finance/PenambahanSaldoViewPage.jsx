import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, TrendingUp, Building2, User, Calendar, DollarSign } from 'lucide-react';

const PenambahanSaldoViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPenambahanSaldoData();
  }, [id]);

  const loadPenambahanSaldoData = () => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyData = {
        id: 'PS001',
        noRekening: '1234567890',
        namaBank: 'Bank Central Asia',
        atasNama: 'PT. Maju Jaya Sejahtera',
        nominal: 50000000,
        tanggal: '2025-01-20',
        keterangan: 'Penambahan saldo untuk operasional bulan Februari 2025 termasuk pembayaran gaji karyawan, biaya operasional kantor, pembayaran supplier, dan kebutuhan operasional lainnya yang mendukung kelancaran bisnis perusahaan.',
        status: 'Disetujui',
        createdBy: 'Admin Finance',
        createdAt: '2025-01-20T10:30:00Z',
        updatedAt: '2025-01-20T14:20:00Z',
        approvedBy: 'Manager Keuangan',
        approvedAt: '2025-01-20T14:20:00Z',
        approvalNotes: 'Pengajuan disetujui. Nominal sesuai dengan kebutuhan operasional bulan Februari.'
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
      'Disetujui': 'bg-green-100 text-green-800 border-green-300',
      'Ditolak': 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Disetujui':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Ditolak':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Penambahan saldo yang Anda cari tidak dapat ditemukan.</p>
          <button
            onClick={() => navigate('/finance/penambahan-saldo')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Kembali ke Daftar Penambahan Saldo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/finance/penambahan-saldo')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Penambahan Saldo</h1>
              <p className="text-gray-600">ID: {data.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge(data.status)}
            {data.status !== 'Disetujui' && (
              <button
                onClick={() => navigate(`/finance/penambahan-saldo/edit/${id}`)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bank Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-600" />
              Informasi Rekening
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                <p className="text-gray-900 font-medium">{data.namaBank}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Rekening</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded inline-block">{data.noRekening}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama</label>
                <p className="text-gray-900 font-medium">{data.atasNama}</p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Detail Pengajuan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengajuan</label>
                <p className="text-gray-900">{formatDate(data.tanggal)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diajukan Oleh</label>
                <p className="text-gray-900">{data.createdBy}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{data.keterangan}</p>
              </div>
            </div>
          </div>

          {/* Approval Information */}
          {(data.status === 'Disetujui' || data.status === 'Ditolak') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {getStatusIcon(data.status)}
                Informasi {data.status === 'Disetujui' ? 'Persetujuan' : 'Penolakan'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {data.status === 'Disetujui' ? 'Disetujui Oleh' : 'Ditolak Oleh'}
                  </label>
                  <p className="text-gray-900 font-medium">{data.approvedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal {data.status === 'Disetujui' ? 'Persetujuan' : 'Penolakan'}
                  </label>
                  <p className="text-gray-900">{formatDateTime(data.approvedAt)}</p>
                </div>
              </div>

              {data.approvalNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                  <div className={`rounded-lg p-4 ${data.status === 'Disetujui' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`${data.status === 'Disetujui' ? 'text-green-800' : 'text-red-800'}`}>
                      {data.approvalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Nominal Pengajuan
            </h3>
            
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(data.nominal)}
              </div>
              <p className="text-gray-600">Jumlah penambahan saldo</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                {getStatusBadge(data.status)}
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900">Pengajuan Dibuat</p>
                  <p className="text-sm text-gray-500">{formatDateTime(data.createdAt)}</p>
                  <p className="text-sm text-gray-600">oleh {data.createdBy}</p>
                </div>
              </div>
              
              {(data.status === 'Disetujui' || data.status === 'Ditolak') && (
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    data.status === 'Disetujui' ? 'bg-green-600' : 'bg-red-600'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {data.status === 'Disetujui' ? 'Disetujui' : 'Ditolak'}
                    </p>
                    <p className="text-sm text-gray-500">{formatDateTime(data.approvedAt)}</p>
                    <p className="text-sm text-gray-600">oleh {data.approvedBy}</p>
                  </div>
                </div>
              )}
              
              {data.status === 'Pending' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div>
                    <p className="font-medium text-gray-900">Menunggu Persetujuan</p>
                    <p className="text-sm text-gray-500">Sedang diproses...</p>
                  </div>
                </div>
              )}
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
                  ID Pengajuan
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{data.id}</p>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi</h3>
            
            <div className="space-y-2">
              {data.status !== 'Disetujui' && (
                <button
                  onClick={() => navigate(`/finance/penambahan-saldo/edit/${id}`)}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Pengajuan
                </button>
              )}
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Bukti
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenambahanSaldoViewPage;