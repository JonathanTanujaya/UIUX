import React, { useState } from 'react';
import { Plus, Search, Package, Calendar, FileText, Building, DollarSign, RotateCcw } from 'lucide-react';

const ModernReturPembelianForm = () => {
  const [formData, setFormData] = useState({
    tglRetur: '',
    supplier: '',
    noFakturAsli: '',
    alasanRetur: '',
    catatan: '',
    items: []
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showOriginalPurchaseModal, setShowOriginalPurchaseModal] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    // Logic to add new item
    console.log('Add return item');
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Document Information Card */}
        <div className="bg-white rounded-xl border-l-4 border-red-500 shadow-sm">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <RotateCcw className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Return Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  TGL RETUR
                </label>
                <input
                  type="date"
                  value={formData.tglRetur}
                  onChange={(e) => handleInputChange('tglRetur', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  NO FAKTUR ASLI
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={formData.noFakturAsli}
                    onChange={(e) => handleInputChange('noFakturAsli', e.target.value)}
                    placeholder="Pilih dari pembelian"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    readOnly
                  />
                  <button 
                    onClick={() => setShowOriginalPurchaseModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Pilih</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ALASAN RETUR
                </label>
                <select
                  value={formData.alasanRetur}
                  onChange={(e) => handleInputChange('alasanRetur', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Pilih Alasan</option>
                  <option value="rusak">Barang Rusak</option>
                  <option value="salah">Salah Kirim</option>
                  <option value="expired">Expired</option>
                  <option value="kualitas">Kualitas Tidak Sesuai</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Information Card */}
        <div className="bg-white rounded-xl border-l-4 border-orange-500 shadow-sm">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Supplier Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SUPPLIER
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={formData.supplier}
                    placeholder="Akan terisi otomatis dari pembelian"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 transition-all duration-200 placeholder-gray-400"
                    readOnly
                  />
                  <button 
                    onClick={() => setShowSupplierModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Cari</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CATATAN RETUR
                </label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => handleInputChange('catatan', e.target.value)}
                  placeholder="Jelaskan detail alasan retur..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table Card */}
        <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Return Items</h3>
              </div>
              <button 
                onClick={addItem}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Return Item</span>
              </button>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Asli</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Retur</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Retur</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <RotateCcw className="w-12 h-12 mb-3 text-gray-300" />
                          <p className="text-sm font-medium">Belum ada item retur</p>
                          <p className="text-xs mt-1">Pilih pembelian asli terlebih dahulu untuk melihat item yang bisa diretur</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    formData.items.map((item, index) => (
                      <tr key={index} className={`hover:bg-red-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">{item.kode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.nama}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.qtyAsli}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          <input
                            type="number"
                            value={item.qtyRetur}
                            onChange={(e) => {
                              const newItems = [...formData.items];
                              newItems[index].qtyRetur = parseInt(e.target.value) || 0;
                              setFormData(prev => ({ ...prev, items: newItems }));
                            }}
                            max={item.qtyAsli}
                            min="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.satuan}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.harga)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold text-red-600">{formatCurrency(item.qtyRetur * item.harga)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-150"
                              title="Hapus item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        {formData.items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Retur</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Item Diretur:</span>
                  <span className="font-medium">{formData.items.reduce((sum, item) => sum + (item.qtyRetur || 0), 0)} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Nilai Retur:</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(formData.items.reduce((sum, item) => sum + ((item.qtyRetur || 0) * (item.harga || 0)), 0))}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Retur:</span>
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(formData.items.reduce((sum, item) => sum + ((item.qtyRetur || 0) * (item.harga || 0)), 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200">
            Cancel
          </button>
          <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200">
            Save as Draft
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-sm">
            Process Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernReturPembelianForm;
