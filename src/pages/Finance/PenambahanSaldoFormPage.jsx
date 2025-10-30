import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Save, TrendingUp, Building2, User } from 'lucide-react';
import { toast } from 'react-toastify';

const PenambahanSaldoFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    noRekening: '',
    namaBank: '',
    atasNama: '',
    keterangan: '',
    nominal: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [bankSuggestions, setBankSuggestions] = useState([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);

  // Data dummy untuk banks dengan rekening
  const allBanks = [
    { 
      kode: 'BCA', 
      nama: 'Bank Central Asia', 
      rekening: [
        { no: '1234567890', atasNama: 'PT. Maju Jaya Sejahtera' },
        { no: '1234567891', atasNama: 'PT. Sukses Bersama' },
        { no: '1234567892', atasNama: 'CV. Berkah Mandiri' }
      ]
    },
    { 
      kode: 'MDR', 
      nama: 'Bank Mandiri', 
      rekening: [
        { no: '0987654321', atasNama: 'PT. Cahaya Terang' },
        { no: '0987654322', atasNama: 'UD. Sumber Rejeki' },
        { no: '0987654323', atasNama: 'CV. Karya Utama' }
      ]
    },
    { 
      kode: 'BRI', 
      nama: 'Bank Rakyat Indonesia', 
      rekening: [
        { no: '5678901234', atasNama: 'PT. Bintang Timur' },
        { no: '5678901235', atasNama: 'UD. Harapan Jaya' },
        { no: '5678901236', atasNama: 'PT. Global Mandiri' }
      ]
    },
    { 
      kode: 'BNI', 
      nama: 'Bank Negara Indonesia', 
      rekening: [
        { no: '3456789012', atasNama: 'CV. Wijaya Kusuma' },
        { no: '3456789013', atasNama: 'PT. Nusantara Jaya' },
        { no: '3456789014', atasNama: 'UD. Sentosa Abadi' }
      ]
    }
  ];

  // Flatten all bank accounts for search
  const allAccounts = allBanks.flatMap(bank => 
    bank.rekening.map(rek => ({
      noRekening: rek.no,
      namaBank: bank.nama,
      atasNama: rek.atasNama,
      kodeBank: bank.kode
    }))
  );

  useEffect(() => {
    if (isEdit) {
      loadPenambahanSaldoData();
    }
  }, [id, isEdit]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.bank-autocomplete')) {
        setShowBankSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadPenambahanSaldoData = () => {
    // Dummy data untuk edit
    setFormData({
      noRekening: '1234567890',
      namaBank: 'Bank Central Asia',
      atasNama: 'PT. Maju Jaya Sejahtera',
      keterangan: 'Penambahan saldo untuk operasional bulan Februari 2025 termasuk pembayaran gaji karyawan dan biaya operasional kantor.',
      nominal: '50000000'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Bank/Rekening search handlers
  const handleRekeningInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      noRekening: value,
      namaBank: '', // Clear related fields when rekening changes
      atasNama: ''
    }));

    if (value.length > 0) {
      const filtered = allAccounts.filter(account =>
        account.noRekening.includes(value) ||
        account.namaBank.toLowerCase().includes(value.toLowerCase()) ||
        account.atasNama.toLowerCase().includes(value.toLowerCase())
      );
      setBankSuggestions(filtered);
      setShowBankSuggestions(true);
    } else {
      setShowBankSuggestions(false);
    }
  };

  const handleSelectAccount = (account) => {
    setFormData(prev => ({ 
      ...prev, 
      noRekening: account.noRekening,
      namaBank: account.namaBank,
      atasNama: account.atasNama
    }));
    setShowBankSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.noRekening || !formData.namaBank || !formData.atasNama || !formData.nominal) {
      toast.error('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    if (parseFloat(formData.nominal.replace(/\D/g, '')) <= 0) {
      toast.error('Nominal harus lebih besar dari 0!');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = {
        ...formData,
        nominal: parseFloat(formData.nominal.replace(/\D/g, '')),
        id: isEdit ? id : `PS${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      console.log('Data Penambahan Saldo:', data);
      
      toast.success(`Penambahan saldo berhasil ${isEdit ? 'diperbarui' : 'diajukan'}!`);
      navigate('/finance/penambahan-saldo');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menyimpan data penambahan saldo!');
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
            onClick={() => navigate('/finance/penambahan-saldo')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Penambahan Saldo' : 'Tambah Penambahan Saldo'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Perbarui informasi penambahan saldo' : 'Ajukan penambahan saldo baru'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            Informasi Rekening
          </h2>
          
          {/* Row 1: No Rekening dan Nama Bank */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* No Rekening */}
            <div className="bank-autocomplete">
              <label htmlFor="noRekening" className="block text-sm font-medium text-gray-700 mb-2">
                No Rekening <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="noRekening"
                  name="noRekening"
                  value={formData.noRekening}
                  onChange={handleRekeningInputChange}
                  onFocus={() => {
                    if (formData.noRekening.length > 0) {
                      setShowBankSuggestions(true);
                    }
                  }}
                  placeholder="Ketik nomor rekening atau nama bank..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  required
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                
                {/* Bank Suggestions Dropdown */}
                {showBankSuggestions && bankSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {bankSuggestions.map((account, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectAccount(account)}
                        className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{account.namaBank}</div>
                        <div className="text-sm text-gray-500">{account.noRekening}</div>
                        <div className="text-sm text-blue-600">{account.atasNama}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Nama Bank */}
            <div>
              <label htmlFor="namaBank" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Bank <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaBank"
                name="namaBank"
                value={formData.namaBank}
                onChange={handleInputChange}
                placeholder="Nama bank akan terisi otomatis"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm bg-gray-50"
                required
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Atas Nama */}
          <div className="mb-6">
            <label htmlFor="atasNama" className="block text-sm font-medium text-gray-700 mb-2">
              Atas Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="atasNama"
              name="atasNama"
              value={formData.atasNama}
              onChange={handleInputChange}
              placeholder="Nama pemilik rekening akan terisi otomatis"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm bg-gray-50"
              required
              readOnly
            />
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
              rows={5}
              placeholder="Masukkan keterangan atau tujuan penambahan saldo..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm resize-none"
            />
            <div className="mt-1 text-xs text-gray-500">
              Jelaskan tujuan dan alasan penambahan saldo untuk keperluan approval
            </div>
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
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  required
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Masukkan jumlah saldo yang ingin ditambahkan
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Informasi Penting</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Pengajuan penambahan saldo akan diverifikasi terlebih dahulu oleh tim finance</p>
                <p>• Pastikan nomor rekening dan nama bank sudah benar</p>
                <p>• Saldo akan ditambahkan setelah mendapat persetujuan dari manager</p>
                <p>• Keterangan yang jelas akan mempercepat proses approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/finance/penambahan-saldo')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Perbarui Penambahan Saldo' : 'Ajukan Penambahan Saldo'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PenambahanSaldoFormPage;