import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Save, RefreshCw, User, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const PiutangReturFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    kodeCustomer: '',
    namaCustomer: '',
    noRetur: '',
    tanggalResi: new Date().toISOString().split('T')[0],
    sisaRetur: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [returSuggestions, setReturSuggestions] = useState([]);
  const [showReturSuggestions, setShowReturSuggestions] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);

  // Data dummy untuk customers
  const allCustomers = [
    { kode: 'C001', nama: 'PT. Maju Jaya Sejahtera' },
    { kode: 'C002', nama: 'CV. Berkah Mandiri' },
    { kode: 'C003', nama: 'PT. Sukses Bersama' },
    { kode: 'C004', nama: 'UD. Sumber Rejeki' },
    { kode: 'C005', nama: 'PT. Cahaya Terang' },
    { kode: 'C006', nama: 'CV. Karya Utama' },
    { kode: 'C007', nama: 'PT. Bintang Timur' },
    { kode: 'C008', nama: 'UD. Harapan Jaya' }
  ];

  // Data dummy untuk retur
  const allReturs = [
    { no: 'RTR-2025-001', customer: 'C001', tanggal: '2025-01-15' },
    { no: 'RTR-2025-002', customer: 'C001', tanggal: '2025-01-18' },
    { no: 'RTR-2025-003', customer: 'C002', tanggal: '2025-01-20' },
    { no: 'RTR-2025-004', customer: 'C003', tanggal: '2025-01-22' }
  ];

  // Data dummy untuk invoice
  const dummyInvoices = [
    {
      no: 1,
      nomInvoice: 'INV-2025-001',
      tglInvoice: '2025-01-15',
      tglJatuhTempo: '2025-01-30',
      jumlahInvoice: 5000000,
      sisaInvoice: 2500000,
      coverGiro: 1500000,
      jumlahBayar: 0,
      jumlahDispensasi: 0,
      jumlahTotal: 0
    },
    {
      no: 2,
      nomInvoice: 'INV-2025-002',
      tglInvoice: '2025-01-18',
      tglJatuhTempo: '2025-02-02',
      jumlahInvoice: 7500000,
      sisaInvoice: 3750000,
      coverGiro: 2250000,
      jumlahBayar: 0,
      jumlahDispensasi: 0,
      jumlahTotal: 0
    },
    {
      no: 3,
      nomInvoice: 'INV-2025-003',
      tglInvoice: '2025-01-20',
      tglJatuhTempo: '2025-02-05',
      jumlahInvoice: 3000000,
      sisaInvoice: 1500000,
      coverGiro: 900000,
      jumlahBayar: 0,
      jumlahDispensasi: 0,
      jumlahTotal: 0
    }
  ];

  useEffect(() => {
    if (isEdit) {
      loadPiutangReturData();
    }
  }, [id, isEdit]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.customer-autocomplete')) {
        setShowCustomerSuggestions(false);
      }
      if (!event.target.closest('.retur-autocomplete')) {
        setShowReturSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadPiutangReturData = () => {
    // Dummy data untuk edit
    setFormData({
      kodeCustomer: 'C001',
      namaCustomer: 'PT. Maju Jaya Sejahtera',
      noRetur: 'RTR-2025-001',
      tanggalResi: '2025-01-20',
      sisaRetur: '7750000'
    });
    setInvoiceList(dummyInvoices);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Customer search handlers
  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      kodeCustomer: value,
      namaCustomer: '' // Clear name when kode changes
    }));

    if (value.length > 0) {
      const filtered = allCustomers.filter(customer =>
        customer.kode.toLowerCase().includes(value.toLowerCase()) ||
        customer.nama.toLowerCase().includes(value.toLowerCase())
      );
      setCustomerSuggestions(filtered);
      setShowCustomerSuggestions(true);
    } else {
      setShowCustomerSuggestions(false);
    }
  };

  const handleSelectCustomer = (customer) => {
    setFormData(prev => ({ 
      ...prev, 
      kodeCustomer: customer.kode,
      namaCustomer: customer.nama,
      noRetur: '', // Clear retur when customer changes
    }));
    setShowCustomerSuggestions(false);
    setInvoiceList([]); // Clear invoice list
  };

  // Retur search handlers
  const handleReturInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      noRetur: value
    }));

    if (value.length > 0 && formData.kodeCustomer) {
      const filtered = allReturs.filter(retur =>
        retur.customer === formData.kodeCustomer &&
        retur.no.toLowerCase().includes(value.toLowerCase())
      );
      setReturSuggestions(filtered);
      setShowReturSuggestions(true);
    } else {
      setShowReturSuggestions(false);
    }
  };

  const handleSelectRetur = (retur) => {
    setFormData(prev => ({ 
      ...prev, 
      noRetur: retur.no,
      tanggalResi: retur.tanggal
    }));
    setShowReturSuggestions(false);
  };

  // Generate invoice list based on customer and retur
  const handleGenerate = () => {
    if (!formData.kodeCustomer || !formData.noRetur) {
      toast.error('Mohon pilih customer dan nomor retur terlebih dahulu!');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInvoiceList(dummyInvoices);
      
      // Calculate sisa retur
      const totalSisaInvoice = dummyInvoices.reduce((sum, invoice) => sum + invoice.sisaInvoice, 0);
      setFormData(prev => ({ 
        ...prev, 
        sisaRetur: totalSisaInvoice.toString()
      }));
      
      setLoading(false);
      toast.success('Data invoice berhasil dimuat!');
    }, 1500);
  };

  // Handle invoice payment input changes
  const handleInvoiceChange = (index, field, value) => {
    const numericValue = parseFloat(value.replace(/\D/g, '')) || 0;
    
    setInvoiceList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: numericValue };
      
      // Calculate jumlah total for this row
      const bayar = updated[index].jumlahBayar || 0;
      const dispensasi = updated[index].jumlahDispensasi || 0;
      updated[index].jumlahTotal = bayar + dispensasi;
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.kodeCustomer || !formData.noRetur) {
      toast.error('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = {
        ...formData,
        invoiceList: invoiceList,
        totalBayar: invoiceList.reduce((sum, inv) => sum + (inv.jumlahTotal || 0), 0)
      };

      console.log('Data Piutang Retur:', data);
      
      toast.success(`Piutang retur berhasil ${isEdit ? 'diperbarui' : 'disimpan'}!`);
      navigate('/finance/piutang-retur');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menyimpan data piutang retur!');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const number = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const formatCurrencyInput = (value) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const totalBayar = invoiceList.reduce((sum, invoice) => sum + (invoice.jumlahTotal || 0), 0);

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
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Piutang Retur' : 'Tambah Piutang Retur'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Perbarui informasi piutang retur' : 'Buat piutang retur baru'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informasi Piutang Retur
          </h2>
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
            {/* Kode Customer */}
            <div className="customer-autocomplete">
              <label htmlFor="kodeCustomer" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Customer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="kodeCustomer"
                  name="kodeCustomer"
                  value={formData.kodeCustomer}
                  onChange={handleCustomerInputChange}
                  onFocus={() => {
                    if (formData.kodeCustomer.length > 0) {
                      setShowCustomerSuggestions(true);
                    }
                  }}
                  placeholder="Ketik kode customer..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                
                {/* Customer Suggestions Dropdown */}
                {showCustomerSuggestions && customerSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {customerSuggestions.map((customer, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectCustomer(customer)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{customer.kode}</div>
                        <div className="text-sm text-gray-500">{customer.nama}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formData.namaCustomer && (
                <div className="mt-1 text-xs text-gray-500">
                  Customer: {formData.namaCustomer}
                </div>
              )}
            </div>

            {/* No Retur */}
            <div className="retur-autocomplete">
              <label htmlFor="noRetur" className="block text-sm font-medium text-gray-700 mb-2">
                No Retur <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noRetur"
                  name="noRetur"
                  value={formData.noRetur}
                  onChange={handleReturInputChange}
                  onFocus={() => {
                    if (formData.noRetur.length > 0 && formData.kodeCustomer) {
                      setShowReturSuggestions(true);
                    }
                  }}
                  placeholder="Ketik nomor retur..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                
                {/* Retur Suggestions Dropdown */}
                {showReturSuggestions && returSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {returSuggestions.map((retur, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectRetur(retur)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{retur.no}</div>
                        <div className="text-sm text-gray-500">{new Date(retur.tanggal).toLocaleDateString('id-ID')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tanggal Resi */}
            <div>
              <label htmlFor="tanggalResi" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Resi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="tanggalResi"
                  name="tanggalResi"
                  value={formData.tanggalResi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                <Calendar className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Generate Button */}
            <div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!formData.kodeCustomer || !formData.noRetur || loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generate...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sisa Retur Display */}
          {formData.sisaRetur && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800">Sisa Retur:</span>
                <span className="text-lg font-bold text-blue-900">
                  Rp {formatCurrency(formData.sisaRetur)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Table */}
        {invoiceList.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Daftar Invoice
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
                  {invoiceList.map((invoice, index) => (
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
                        Rp {formatCurrency(invoice.jumlahInvoice)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                        Rp {formatCurrency(invoice.sisaInvoice)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                        Rp {formatCurrency(invoice.coverGiro)}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={formatCurrencyInput(invoice.jumlahBayar?.toString() || '0')}
                          onChange={(e) => handleInvoiceChange(index, 'jumlahBayar', e.target.value)}
                          className="w-24 px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={formatCurrencyInput(invoice.jumlahDispensasi?.toString() || '0')}
                          onChange={(e) => handleInvoiceChange(index, 'jumlahDispensasi', e.target.value)}
                          className="w-24 px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                        Rp {formatCurrency(invoice.jumlahTotal || 0)}
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
                      Rp {formatCurrency(totalBayar)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/finance/piutang-retur')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || invoiceList.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Perbarui Piutang Retur' : 'Simpan Piutang Retur'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PiutangReturFormPage;