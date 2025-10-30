import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Save, CreditCard, Building2, User } from 'lucide-react';
import { toast } from 'react-toastify';

const PiutangResiFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    noResi: '',
    noRekeningTujuan: '',
    namaBank: '',
    tanggalBayar: new Date().toISOString().split('T')[0],
    kodeCust: '',
    namaCustomer: '',
    keterangan: '',
    nominal: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [bankSuggestions, setBankSuggestions] = useState([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);

  // Data dummy untuk banks
  const allBanks = [
    { kode: 'BCA', nama: 'Bank Central Asia', rekening: '1234567890' },
    { kode: 'MDR', nama: 'Bank Mandiri', rekening: '0987654321' },
    { kode: 'BRI', nama: 'Bank Rakyat Indonesia', rekening: '5678901234' },
    { kode: 'BNI', nama: 'Bank Negara Indonesia', rekening: '3456789012' },
    { kode: 'BTN', nama: 'Bank Tabungan Negara', rekening: '7890123456' },
    { kode: 'CIMB', nama: 'CIMB Niaga', rekening: '2345678901' },
  ];

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

  useEffect(() => {
    if (isEdit) {
      loadPiutangData();
    }
  }, [id, isEdit]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.bank-autocomplete')) {
        setShowBankSuggestions(false);
      }
      if (!event.target.closest('.customer-autocomplete')) {
        setShowCustomerSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadPiutangData = () => {
    // Dummy data untuk edit
    setFormData({
      noResi: 'RSI-2025-001',
      noRekeningTujuan: '1234567890',
      namaBank: 'Bank Central Asia',
      tanggalBayar: '2025-01-20',
      kodeCust: 'C001',
      namaCustomer: 'PT. Maju Jaya Sejahtera',
      keterangan: 'Pembayaran invoice bulan Desember 2024 untuk pengadaan spare parts mesin produksi utama',
      nominal: '15000000'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Bank search handlers
  const handleBankInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      namaBank: value,
      noRekeningTujuan: '' // Clear rekening when bank changes
    }));

    if (value.length > 0) {
      const filtered = allBanks.filter(bank =>
        bank.nama.toLowerCase().includes(value.toLowerCase()) ||
        bank.kode.toLowerCase().includes(value.toLowerCase())
      );
      setBankSuggestions(filtered);
      setShowBankSuggestions(true);
    } else {
      setShowBankSuggestions(false);
    }
  };

  const handleSelectBank = (bank) => {
    setFormData(prev => ({ 
      ...prev, 
      namaBank: bank.nama,
      noRekeningTujuan: bank.rekening
    }));
    setShowBankSuggestions(false);
  };

  // Customer search handlers
  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      namaCustomer: value,
      kodeCust: '' // Clear kode when name changes
    }));

    if (value.length > 0) {
      const filtered = allCustomers.filter(customer =>
        customer.nama.toLowerCase().includes(value.toLowerCase()) ||
        customer.kode.toLowerCase().includes(value.toLowerCase())
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
      namaCustomer: customer.nama,
      kodeCust: customer.kode
    }));
    setShowCustomerSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.namaBank || !formData.noRekeningTujuan || !formData.namaCustomer || !formData.nominal) {
      toast.error('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = {
        ...formData,
        nominal: parseFloat(formData.nominal.replace(/\D/g, '')),
        id: isEdit ? id : `PR${Date.now()}`
      };

      console.log('Data Piutang Resi:', data);
      
      toast.success(`Piutang resi berhasil ${isEdit ? 'diperbarui' : 'disimpan'}!`);
      navigate('/finance/piutang-resi');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menyimpan data piutang resi!');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const handleNominalChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, nominal: value }));
  };

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
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Piutang Resi' : 'Tambah Piutang Resi'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Perbarui informasi piutang resi' : 'Buat piutang resi baru'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Informasi Resi
          </h2>
          
          {/* Row 1: No Rekening Tujuan dan Nama Bank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* No Rekening Tujuan */}
            <div>
              <label htmlFor="noRekeningTujuan" className="block text-sm font-medium text-gray-700 mb-2">
                No Rekening Tujuan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noRekeningTujuan"
                  name="noRekeningTujuan"
                  value={formData.noRekeningTujuan}
                  onChange={handleInputChange}
                  placeholder="Masukkan nomor rekening tujuan"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Nama Bank */}
            <div className="bank-autocomplete">
              <label htmlFor="namaBank" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Bank <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaBank"
                  name="namaBank"
                  value={formData.namaBank}
                  onChange={handleBankInputChange}
                  onFocus={() => {
                    if (formData.namaBank.length > 0) {
                      setShowBankSuggestions(true);
                    }
                  }}
                  placeholder="Ketik nama bank..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                
                {/* Bank Suggestions Dropdown */}
                {showBankSuggestions && bankSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {bankSuggestions.map((bank, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectBank(bank)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{bank.nama}</div>
                        <div className="text-sm text-gray-500">{bank.kode} - {bank.rekening}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Tanggal Bayar dan Kode Customer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Tanggal Bayar */}
            <div>
              <label htmlFor="tanggalBayar" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Bayar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="tanggalBayar"
                  name="tanggalBayar"
                  value={formData.tanggalBayar}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                <Calendar className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Kode Customer */}
            <div className="customer-autocomplete">
              <label htmlFor="namaCustomer" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Customer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="namaCustomer"
                  name="namaCustomer"
                  value={formData.namaCustomer}
                  onChange={handleCustomerInputChange}
                  onFocus={() => {
                    if (formData.namaCustomer.length > 0) {
                      setShowCustomerSuggestions(true);
                    }
                  }}
                  placeholder="Ketik nama customer..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
                <User className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                
                {/* Customer Suggestions Dropdown */}
                {showCustomerSuggestions && customerSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {customerSuggestions.map((customer, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectCustomer(customer)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{customer.nama}</div>
                        <div className="text-sm text-gray-500">Kode: {customer.kode}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formData.kodeCust && (
                <div className="mt-1 text-xs text-gray-500">
                  Kode Customer: {formData.kodeCust}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Keterangan */}
          <div className="mb-6">
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
              rows={4}
              placeholder="Masukkan keterangan piutang resi..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm resize-none"
            />
          </div>

          {/* Row 4: Nominal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nominal" className="block text-sm font-medium text-gray-700 mb-2">
                Nominal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  id="nominal"
                  name="nominal"
                  value={formatCurrency(formData.nominal)}
                  onChange={handleNominalChange}
                  placeholder="0"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/finance/piutang-resi')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
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
                {isEdit ? 'Perbarui Piutang Resi' : 'Simpan Piutang Resi'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PiutangResiFormPage;