import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, RefreshCw, User, Calendar, DollarSign, FileText } from 'lucide-react';

const PiutangReturViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPiutangReturData();
  }, [id]);

  const loadPiutangReturData = () => {
    // Simulate API call with dummy data
    setTimeout(() => {
      const dummyData = {
        id: 'PRR001',
        kodeCustomer: 'C001',
        namaCustomer: 'PT. Maju Jaya Sejahtera',
        noRetur: 'RTR-2025-001',
        tanggalResi: '2025-01-20',
        sisaRetur: 7750000,
        totalInvoice: 15500000,
        totalBayar: 7750000,
        status: 'Partial',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-18T14:20:00Z',
        invoiceList: [
          {
            no: 1,
            nomInvoice: 'INV-2025-001',
            tglInvoice: '2025-01-15',
            tglJatuhTempo: '2025-01-30',
            jumlahInvoice: 5000000,
            sisaInvoice: 2500000,
            coverGiro: 1500000,
            jumlahBayar: 2000000,
            jumlahDispensasi: 500000,
            jumlahTotal: 2500000
          },
          {
            no: 2,
            nomInvoice: 'INV-2025-002',
            tglInvoice: '2025-01-18',
            tglJatuhTempo: '2025-02-02',
            jumlahInvoice: 7500000,
            sisaInvoice: 3750000,
            coverGiro: 2250000,
            jumlahBayar: 3000000,
            jumlahDispensasi: 750000,
            jumlahTotal: 3750000
          },
          {
            no: 3,
            nomInvoice: 'INV-2025-003',
            tglInvoice: '2025-01-20',
            tglJatuhTempo: '2025-02-05',
            jumlahInvoice: 3000000,
            sisaInvoice: 1500000,
            coverGiro: 900000,
            jumlahBayar: 1200000,
            jumlahDispensasi: 300000,
            jumlahTotal: 1500000
          }
        ]
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
      'Partial': 'bg-blue-100 text-blue-800 border-blue-300',
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
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <p className="text-gray-600 mb-4">Piutang retur yang Anda cari tidak dapat ditemukan.</p>
          <button
            onClick={() => navigate('/finance/piutang-retur')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Kembali ke Daftar Piutang Retur
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
            onClick={() => navigate('/finance/piutang-retur')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Piutang Retur</h1>
              <p className="text-gray-600">{data.noRetur}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge(data.status)}
            <button
              onClick={() => navigate(`/finance/piutang-retur/edit/${id}`)}
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
                <p className="text-gray-900 font-medium">{data.namaCustomer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Customer</label>
                <p className="text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded inline-block">{data.kodeCustomer}</p>
              </div>
            </div>
          </div>

          {/* Retur Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Informasi Retur
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Retur</label>
                <p className="text-gray-900 font-medium">{data.noRetur}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Resi</label>
                <p className="text-gray-900">{formatDate(data.tanggalResi)}</p>
              </div>
            </div>
          </div>

          {/* Invoice Details Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Detail Invoice
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom Invoice</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tgl Invoice</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tgl Jatuh Tempo</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Invoice</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sisa Invoice</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cover Giro</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Bayar</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Dispensasi</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.invoiceList.map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{invoice.no}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 font-medium">{invoice.nomInvoice}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        {new Date(invoice.tglInvoice).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        {new Date(invoice.tglJatuhTempo).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(invoice.jumlahInvoice)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(invoice.sisaInvoice)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(invoice.coverGiro)}
                      </td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right font-medium">
                        {formatCurrency(invoice.jumlahBayar)}
                      </td>
                      <td className="px-3 py-2 text-sm text-blue-600 text-right font-medium">
                        {formatCurrency(invoice.jumlahDispensasi)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right font-bold">
                        {formatCurrency(invoice.jumlahTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="7" className="px-3 py-3 text-sm font-medium text-gray-900 text-right">
                      Total Pembayaran:
                    </td>
                    <td colSpan="3" className="px-3 py-3 text-sm font-bold text-blue-600 text-right">
                      {formatCurrency(data.totalBayar)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Ringkasan Pembayaran
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Invoice</span>
                <span className="font-medium text-gray-900">{formatCurrency(data.totalInvoice)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bayar</span>
                <span className="font-medium text-green-600">{formatCurrency(data.totalBayar)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Sisa Retur</span>
                <span className={`font-bold text-lg ${data.sisaRetur > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(data.sisaRetur)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status Pembayaran</span>
                {getStatusBadge(data.status)}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Jumlah Invoice</span>
                <span className="font-medium text-gray-900">{data.invoiceList.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progress Pembayaran</span>
                <span className="font-medium text-blue-600">
                  {Math.round((data.totalBayar / data.totalInvoice) * 100)}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(data.totalBayar / data.totalInvoice) * 100}%` }}
                ></div>
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
                  ID Retur
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
                onClick={() => navigate(`/finance/piutang-retur/edit/${id}`)}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Piutang Retur
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Laporan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiutangReturViewPage;