import React, { useState, useEffect } from 'react';

// Mock data untuk kategori
const mockKategoriOptions = [
  { id: 1, nama: 'Elektronik' },
  { id: 2, nama: 'Otomotif' },
  { id: 3, nama: 'Fashion' },
  { id: 4, nama: 'Kesehatan' },
  { id: 5, nama: 'Makanan' },
  { id: 6, nama: 'Peralatan' }
];

const BarangForm = ({ 
  isOpen, 
  onClose, 
  barang = null, 
  onSubmit,
  title = "Tambah Barang Baru"
}) => {
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    kategori: '',
    merk: '',
    satuan: '',
    lokasi: '',
    harga_jual: '',
    stok_min: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form ketika modal dibuka/ditutup atau barang berubah
  useEffect(() => {
    if (isOpen) {
      if (barang) {
        // Mode edit - isi form dengan data barang
        setFormData({
          kode_barang: barang.kode_barang || '',
          nama_barang: barang.nama_barang || '',
          kategori: barang.kategori || '',
          merk: barang.merk || '',
          satuan: barang.satuan || '',
          lokasi: barang.lokasi || '',
          harga_jual: barang.harga_jual || '',
          stok_min: barang.stok_min || ''
        });
      } else {
        // Mode tambah - reset form
        setFormData({
          kode_barang: '',
          nama_barang: '',
          kategori: '',
          merk: '',
          satuan: '',
          lokasi: '',
          harga_jual: '',
          stok_min: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, barang]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.kode_barang.trim()) {
      newErrors.kode_barang = 'Kode barang wajib diisi';
    }

    if (!formData.nama_barang.trim()) {
      newErrors.nama_barang = 'Nama barang wajib diisi';
    }

    if (!formData.kategori.trim()) {
      newErrors.kategori = 'Kategori wajib dipilih';
    }

    if (!formData.merk.trim()) {
      newErrors.merk = 'Merk wajib diisi';
    }

    if (!formData.satuan.trim()) {
      newErrors.satuan = 'Satuan wajib diisi';
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi wajib diisi';
    }

    if (!formData.harga_jual || parseFloat(formData.harga_jual) <= 0) {
      newErrors.harga_jual = 'Harga jual harus lebih dari 0';
    }

    if (!formData.stok_min || parseInt(formData.stok_min) < 0) {
      newErrors.stok_min = 'Stok minimum harus 0 atau lebih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // In real app, you would call API here
      const submitData = {
        ...formData,
        harga_jual: parseFloat(formData.harga_jual),
        stok_min: parseInt(formData.stok_min)
      };

      onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error jika perlu
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {barang ? '✏️ Edit Barang' : '➕ Tambah Barang Baru'}
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kode Barang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Barang *
                  </label>
                  <input
                    type="text"
                    name="kode_barang"
                    value={formData.kode_barang}
                    onChange={handleInputChange}
                    placeholder="BRG001"
                    disabled={!!barang || isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.kode_barang ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.kode_barang && (
                    <p className="mt-1 text-sm text-red-600">{errors.kode_barang}</p>
                  )}
                </div>

                {/* Nama Barang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Barang *
                  </label>
                  <input
                    type="text"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama barang"
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.nama_barang ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.nama_barang && (
                    <p className="mt-1 text-sm text-red-600">{errors.nama_barang}</p>
                  )}
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.kategori ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih kategori</option>
                    {mockKategoriOptions.map(kategori => (
                      <option key={kategori.id} value={kategori.nama}>
                        {kategori.nama}
                      </option>
                    ))}
                  </select>
                  {errors.kategori && (
                    <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
                  )}
                </div>

                {/* Merk */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merk *
                  </label>
                  <input
                    type="text"
                    name="merk"
                    value={formData.merk}
                    onChange={handleInputChange}
                    placeholder="Masukkan merk"
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.merk ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.merk && (
                    <p className="mt-1 text-sm text-red-600">{errors.merk}</p>
                  )}
                </div>

                {/* Satuan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan *
                  </label>
                  <select
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.satuan ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih satuan</option>
                    <option value="pcs">PCS (Pieces)</option>
                    <option value="unit">Unit</option>
                    <option value="kg">Kilogram</option>
                    <option value="liter">Liter</option>
                    <option value="meter">Meter</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                  </select>
                  {errors.satuan && (
                    <p className="mt-1 text-sm text-red-600">{errors.satuan}</p>
                  )}
                </div>

                {/* Lokasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    placeholder="Rak A1, Gudang B, dll"
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.lokasi ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.lokasi && (
                    <p className="mt-1 text-sm text-red-600">{errors.lokasi}</p>
                  )}
                </div>

                {/* Harga Jual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Jual *
                  </label>
                  <input
                    type="number"
                    name="harga_jual"
                    value={formData.harga_jual}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.harga_jual ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.harga_jual && (
                    <p className="mt-1 text-sm text-red-600">{errors.harga_jual}</p>
                  )}
                </div>

                {/* Stok Minimum */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok Minimum *
                  </label>
                  <input
                    type="number"
                    name="stok_min"
                    value={formData.stok_min}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.stok_min ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.stok_min && (
                    <p className="mt-1 text-sm text-red-600">{errors.stok_min}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Menyimpan...' : (barang ? 'Update' : 'Simpan')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BarangForm;
