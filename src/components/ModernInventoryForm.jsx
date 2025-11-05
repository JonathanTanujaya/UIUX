import React, { useState } from 'react';
import { Plus, Search, Package, Trash2 } from 'lucide-react';

const ModernInventoryForm = () => {
  const [formData, setFormData] = useState({
    tglTerima: new Date().toISOString().split('T')[0],
    tglJatuhTempo: '',
    noFaktur: 'PO-2025-001',
    supplier: 'supplier1',
    catatan: '',
    ppn: '11',
    diskonGlobal: '0',
    items: [
      {
        id: 1,
        kode: 'BRG001',
        nama: 'Bearing SKF 6205',
        qty: 10,
        satuan: 'PCS',
        harga: 150000,
        disc1: 5,
        disc2: 2,
      },
      {
        id: 2,
        kode: 'BRG002',
        nama: 'V-Belt B50',
        qty: 5,
        satuan: 'PCS',
        harga: 85000,
        disc1: 3,
        disc2: 0,
      },
    ]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      kode: '',
      nama: '',
      qty: 1,
      satuan: 'PCS',
      harga: 0,
      disc1: 0,
      disc2: 0,
    };
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateItemSubtotal = (item) => {
    const hargaAfterD1 = item.harga * (1 - item.disc1 / 100);
    const hargaNet = hargaAfterD1 * (1 - item.disc2 / 100);
    return hargaNet * item.qty;
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
    const diskonGlobal = parseFloat(formData.diskonGlobal) || 0;
    const afterDiskon = subtotal - diskonGlobal;
    const ppn = afterDiskon * (parseFloat(formData.ppn) / 100);
    const grandTotal = afterDiskon + ppn;
    
    return { subtotal, diskonGlobal, afterDiskon, ppn, grandTotal };
  };

  const totals = calculateTotals();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="max-w-full mx-auto flex-1 flex flex-col">
        
        {/* Container Utama - Semua Menyatu */}
        <div className="bg-white shadow-sm border flex-1 flex flex-col">
          {/* Header Form - Responsive Full Width */}
          <div className="p-3 border-l-4 border-blue-500 border-b border-gray-200 flex-shrink-0">
            {/* Single Row: 4 fields (Tanggal Terima sampai Supplier) */}
            <div className="flex gap-2 w-full">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">TGL TERIMA</label>
                <input
                  type="date"
                  value={formData.tglTerima}
                  onChange={(e) => handleInputChange('tglTerima', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">TGL JATUH TEMPO</label>
                <input
                  type="date"
                  value={formData.tglJatuhTempo}
                  onChange={(e) => handleInputChange('tglJatuhTempo', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">NO FAKTUR</label>
                <input
                  type="text"
                  value={formData.noFaktur}
                  onChange={(e) => handleInputChange('noFaktur', e.target.value)}
                  placeholder="No Faktur"
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-[1.5] min-w-[180px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">SUPPLIER</label>
                <div className="flex space-x-1">
                  <select
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Supplier</option>
                    <option value="supplier1">PT. Supplier Jaya</option>
                    <option value="supplier2">CV. Mitra Sejahtera</option>
                  </select>
                  <button className="px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <Search className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Table dan Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-4 flex-1">
          
            {/* Items Table - 3/4 width */}
            <div className="lg:col-span-3 border-r border-gray-200 flex flex-col">
              <div className="p-3 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Daftar Barang</h3>
                  <button 
                    onClick={addItem}
                    className="px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            
              {/* Compact Table - Hidden Vertical Scroll */}
              <div className="overflow-auto flex-1">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '40px' }}>No</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '120px' }}>Kode</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '180px' }}>Nama Barang</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '70px' }}>Qty</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '80px' }}>Satuan</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '100px' }}>Harga</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '60px' }}>D1%</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '60px' }}>D2%</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '110px' }}>Subtotal</th>
                      <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase" style={{ width: '50px' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-2 py-1.5 text-xs text-gray-900">{index + 1}</td>
                        <td className="px-2 py-1.5 text-xs">
                          <div className="flex space-x-1">
                            <input
                              type="text"
                              value={item.kode}
                              onChange={(e) => handleItemChange(index, 'kode', e.target.value)}
                              placeholder="Kode"
                              className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              style={{ minWidth: '70px' }}
                            />
                            <button className="px-1 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex-shrink-0">
                              <Search className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <input
                            type="text"
                            value={item.nama}
                            onChange={(e) => handleItemChange(index, 'nama', e.target.value)}
                            placeholder="Nama barang"
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                            style={{ width: '60px' }}
                          />
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <select
                            value={item.satuan}
                            onChange={(e) => handleItemChange(index, 'satuan', e.target.value)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            style={{ width: '70px' }}
                          >
                            <option value="PCS">PCS</option>
                            <option value="SET">SET</option>
                            <option value="BOX">BOX</option>
                            <option value="UNIT">UNIT</option>
                          </select>
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <input
                            type="number"
                            value={item.harga}
                            onChange={(e) => handleItemChange(index, 'harga', parseFloat(e.target.value) || 0)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                            style={{ minWidth: '90px' }}
                          />
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <input
                            type="number"
                            value={item.disc1}
                            onChange={(e) => handleItemChange(index, 'disc1', parseFloat(e.target.value) || 0)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                            style={{ width: '50px' }}
                          />
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <input
                            type="number"
                            value={item.disc2}
                            onChange={(e) => handleItemChange(index, 'disc2', parseFloat(e.target.value) || 0)}
                            className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                            style={{ width: '50px' }}
                          />
                        </td>
                        <td className="px-2 py-1.5 text-xs font-medium text-gray-900 text-right">
                          {formatCurrency(calculateItemSubtotal(item))}
                        </td>
                        <td className="px-2 py-1.5 text-xs">
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.items.length === 0 && (
                      <tr>
                        <td colSpan="10" className="px-2 py-6 text-center text-gray-500">
                          <Package className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                          <p className="text-xs">Belum ada item</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sticky Summary Panel - 1/4 width */}
            <div className="lg:col-span-1 p-3 flex flex-col h-full">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Ringkasan</h3>
              
              {/* Financial Inputs */}
              <div className="space-y-2 mb-3 flex-shrink-0">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PPN %</label>
                  <input
                    type="number"
                    value={formData.ppn}
                    onChange={(e) => handleInputChange('ppn', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="11"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Diskon Global</label>
                  <input
                    type="number"
                    value={formData.diskonGlobal}
                    onChange={(e) => handleInputChange('diskonGlobal', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                  <textarea
                    value={formData.catatan}
                    onChange={(e) => handleInputChange('catatan', e.target.value)}
                    placeholder="Catatan pembelian..."
                    rows={2}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Spacer untuk mendorong summary ke bawah */}
              <div className="flex-1"></div>

              {/* Summary - Menempel di atas tombol */}
              <div className="border-t pt-3 space-y-1.5 flex-shrink-0">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Diskon Global:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(totals.diskonGlobal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">After Diskon:</span>
                  <span className="font-medium">{formatCurrency(totals.afterDiskon)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">PPN ({formData.ppn}%):</span>
                  <span className="font-medium">{formatCurrency(totals.ppn)}</span>
                </div>
                <div className="border-t pt-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 text-xs">Grand Total:</span>
                    <span className="font-bold text-blue-600 text-sm">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Langsung di bawah summary */}
              <div className="mt-3 space-y-1.5 flex-shrink-0">
                <button className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium">
                  Simpan Pembelian
                </button>
                <button className="w-full px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-xs">
                  Simpan Draft
                </button>
                <button className="w-full px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-xs">
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

export default ModernInventoryForm;
