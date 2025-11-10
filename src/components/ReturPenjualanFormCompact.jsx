import React, { useState } from 'react';
import { Plus, Search, Package, Calendar, FileText, User, RotateCcw, Trash2 } from 'lucide-react';

const ModernReturPenjualanFormCompact = () => {
  const [formData, setFormData] = useState({
    tglRetur: '',
    customer: '',
    noInvoiceAsli: '',
    alasanRetur: '',
    catatan: '',
    items: [
      { 
        id: 1, 
        kode: 'BRG001', 
        nama: 'Sparepart Engine A100', 
        qtyAsli: 3, 
        qtyRetur: 1, 
        satuan: 'PCS', 
        harga: 180000, 
        alasan: 'Komplain customer', 
        subtotal: 180000 
      }
    ]
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOriginalInvoiceModal, setShowOriginalInvoiceModal] = useState(false);

  const handleInputChange = (field, value) => {
    try {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } catch (error) {
      console.error('Error updating form data:', error);
    }
  };

  const addItem = () => {
    try {
      const newItem = {
        id: Date.now(),
        kode: '',
        nama: '',
        qtyAsli: 0,
        qtyRetur: 0,
        satuan: 'PCS',
        harga: 0,
        alasan: '',
        subtotal: 0
      };
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem]
      }));
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = (index) => {
    try {
      setFormData(prev => ({
        ...prev,
        items: (prev.items || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const formatCurrency = (amount) => {
    // Add null/undefined check to prevent primitive conversion errors
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(safeAmount);
  };

  const calculateTotals = () => {
    try {
      const items = formData.items || [];
      const totalQtyRetur = items.reduce((sum, item) => sum + (Number(item.qtyRetur) || 0), 0);
      const totalNilaiRetur = items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
      
      return { totalQtyRetur, totalNilaiRetur };
    } catch (error) {
      console.error('Error calculating totals:', error);
      return { totalQtyRetur: 0, totalNilaiRetur: 0 };
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Form - Compact 3 columns */}
        <div className="bg-white shadow-sm border p-3 border-l-4 border-orange-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TGL RETUR</label>
              <input
                type="date"
                value={formData.tglRetur}
                onChange={(e) => handleInputChange('tglRetur', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NO INVOICE ASLI</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.noInvoiceAsli}
                  onChange={(e) => handleInputChange('noInvoiceAsli', e.target.value)}
                  placeholder="Nomor invoice penjualan"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button 
                  onClick={() => setShowOriginalInvoiceModal(true)}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ALASAN RETUR</label>
              <select
                value={formData.alasanRetur}
                onChange={(e) => handleInputChange('alasanRetur', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Pilih Alasan</option>
                <option value="komplain">Komplain Customer</option>
                <option value="rusak">Barang Rusak</option>
                <option value="salah_kirim">Salah Kirim</option>
                <option value="kelebihan">Kelebihan Kirim</option>
                <option value="tukar_model">Tukar Model</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Customer & Catatan - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CUSTOMER</label>
              <div className="flex space-x-2">
                <select
                  value={formData.customer}
                  onChange={(e) => handleInputChange('customer', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Pilih Customer</option>
                  <option value="customer1">PT. Customer Utama</option>
                  <option value="customer2">CV. Pelanggan Setia</option>
                  <option value="customer3">UD. Mitra Dagang</option>
                </select>
                <button 
                  onClick={() => setShowCustomerModal(true)}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CATATAN</label>
              <input
                type="text"
                value={formData.catatan}
                onChange={(e) => handleInputChange('catatan', e.target.value)}
                placeholder="Catatan retur penjualan..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Main Content - Table dan Summary dalam satu row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Items Table - 3/4 width */}
          <div className="lg:col-span-3 bg-white shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Barang Retur</h3>
                <button 
                  onClick={addItem}
                  className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
            
            {/* Compact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Jual</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Retur</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alasan</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(formData.items || []).map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-3 py-2 text-sm font-mono text-gray-900">{item.kode || ''}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 max-w-48 truncate">{item.nama || ''}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.qtyAsli || 0}</td>
                      <td className="px-3 py-2 text-sm text-orange-600 text-right font-medium">{item.qtyRetur || 0}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{item.satuan || ''}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.harga)}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 max-w-24 truncate">{item.alasan || ''}</td>
                      <td className="px-3 py-2 text-sm text-orange-600 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        <button 
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(formData.items || []).length === 0 && (
                    <tr>
                      <td colSpan="10" className="px-3 py-8 text-center text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Belum ada item retur</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky Summary Panel - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm border p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Retur</h3>
              
              {/* Status Info */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <RotateCcw className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-700">Retur Penjualan</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Info Customer</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>PT. Customer Utama</div>
                  <div className="text-xs text-gray-500 mt-1">Invoice: INV-2024-001</div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Item:</span>
                  <span className="font-medium">{(formData.items || []).length} item</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Qty Retur:</span>
                  <span className="font-medium text-orange-600">{totals.totalQtyRetur} pcs</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total Nilai Retur:</span>
                    <span className="font-bold text-orange-600">{formatCurrency(totals.totalNilaiRetur)}</span>
                  </div>
                </div>
              </div>

              {/* Refund Method */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Metode Refund</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500">
                  <option value="">Pilih Metode</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="credit_note">Credit Note</option>
                  <option value="exchange">Tukar Barang</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium">
                  Proses Retur
                </button>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                  Simpan Draft
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernReturPenjualanFormCompact;
