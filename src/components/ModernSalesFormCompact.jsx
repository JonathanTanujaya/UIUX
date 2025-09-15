import React, { useState } from 'react';
import { Plus, Search, Package, Calendar, FileText, User, DollarSign, Trash2, ShoppingCart } from 'lucide-react';

const ModernSalesFormCompact = () => {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kodeCustomer: '',
    kodeSales: '',
    tipe: 'Cash',
    totalDiscountSemua: '0',
    pajakPersen: '11',
    items: [
      { 
        id: 1, 
        kodeBarang: 'BRG001', 
        namaBarang: 'Sparepart Engine A100', 
        harga: 180000, 
        qty: 2, 
        disc1: 5, 
        jenisItem: 'Regular',
        subtotal: 342000 
      }
    ]
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showBarangModal, setShowBarangModal] = useState(false);

  // Sample data - should come from API
  const customers = [
    { kode: 'CUST001', nama: 'PT. Customer Utama', alamat: 'Jakarta' },
    { kode: 'CUST002', nama: 'CV. Pelanggan Setia', alamat: 'Surabaya' },
    { kode: 'CUST003', nama: 'UD. Mitra Dagang', alamat: 'Bandung' }
  ];

  const salesPersons = [
    { kode: 'SALES001', nama: 'John Doe', area: 'Jakarta' },
    { kode: 'SALES002', nama: 'Jane Smith', area: 'Surabaya' },
    { kode: 'SALES003', nama: 'Bob Wilson', area: 'Bandung' }
  ];

  const barangs = [
    { kode: 'BRG001', nama: 'Sparepart Engine A100', harga: 180000, stok: 50 },
    { kode: 'BRG002', nama: 'Filter Oli Premium', harga: 45000, stok: 100 },
    { kode: 'BRG003', nama: 'Ban Motor Tubeless', harga: 250000, stok: 25 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate subtotal when qty or disc1 changes
    if (field === 'qty' || field === 'disc1') {
      const item = updatedItems[index];
      const discountAmount = (item.harga * item.disc1) / 100;
      const hargaSetelahDiskon = item.harga - discountAmount;
      updatedItems[index].subtotal = hargaSetelahDiskon * item.qty;
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      kodeBarang: '',
      namaBarang: '',
      harga: 0,
      qty: 1,
      disc1: 0,
      jenisItem: 'Regular',
      subtotal: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const selectBarang = (item, index) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      kodeBarang: item.kode,
      namaBarang: item.nama,
      harga: item.harga,
      subtotal: item.harga * updatedItems[index].qty
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    setShowBarangModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = parseFloat(formData.totalDiscountSemua) || 0;
    const dpp = subtotal - totalDiscount;
    const pajak = dpp * (parseFloat(formData.pajakPersen) / 100);
    const grandTotal = dpp + pajak;
    
    return { subtotal, totalDiscount, dpp, pajak, grandTotal };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Form - Compact */}
        <div className="bg-white shadow-sm border p-3 border-l-4 border-green-500">
          {/* Row 1: Tanggal, Customer, Sales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TANGGAL</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange('tanggal', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KODE CUSTOMER</label>
              <div className="flex space-x-2">
                <select
                  value={formData.kodeCustomer}
                  onChange={(e) => handleInputChange('kodeCustomer', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih Customer</option>
                  {customers.map(customer => (
                    <option key={customer.kode} value={customer.kode}>
                      {customer.kode} - {customer.nama}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowCustomerModal(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KODE SALES</label>
              <div className="flex space-x-2">
                <select
                  value={formData.kodeSales}
                  onChange={(e) => handleInputChange('kodeSales', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Pilih Sales</option>
                  {salesPersons.map(sales => (
                    <option key={sales.kode} value={sales.kode}>
                      {sales.kode} - {sales.nama}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowSalesModal(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Tipe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TIPE</label>
              <select
                value={formData.tipe}
                onChange={(e) => handleInputChange('tipe', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
                <option value="Transfer">Transfer</option>
                <option value="Giro">Giro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content - Table dan Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Items Table - 3/4 width */}
          <div className="lg:col-span-3 bg-white shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Barang</h3>
                <button 
                  onClick={addItem}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center space-x-1"
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
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Disc1%</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jenis Item</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex space-x-1">
                          <input
                            type="text"
                            value={item.kodeBarang}
                            onChange={(e) => handleItemChange(index, 'kodeBarang', e.target.value)}
                            placeholder="Kode"
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                          />
                          <button 
                            onClick={() => setShowBarangModal(true)}
                            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          >
                            <Search className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 max-w-40 truncate">{item.namaBarang}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.harga)}</td>
                      <td className="px-3 py-2 text-sm">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <input
                          type="number"
                          value={item.disc1}
                          onChange={(e) => handleItemChange(index, 'disc1', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <select
                          value={item.jenisItem}
                          onChange={(e) => handleItemChange(index, 'jenisItem', e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Promo">Promo</option>
                          <option value="Bonus">Bonus</option>
                          <option value="Sample">Sample</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right font-medium">{formatCurrency(item.subtotal)}</td>
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
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-3 py-8 text-center text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Belum ada item</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Penjualan</h3>
              
              {/* Customer Info */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <User className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-700">Customer</span>
                </div>
                <div className="text-sm text-green-600">
                  <div>{customers.find(c => c.kode === formData.kodeCustomer)?.nama || 'Belum dipilih'}</div>
                  <div className="text-xs text-green-500 mt-1">
                    Sales: {salesPersons.find(s => s.kode === formData.kodeSales)?.nama || 'Belum dipilih'}
                  </div>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Discount Semua</label>
                  <input
                    type="number"
                    value={formData.totalDiscountSemua}
                    onChange={(e) => handleInputChange('totalDiscountSemua', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pajak %</label>
                  <input
                    type="number"
                    value={formData.pajakPersen}
                    onChange={(e) => handleInputChange('pajakPersen', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Discount:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(totals.totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">DPP:</span>
                  <span className="font-medium">{formatCurrency(totals.dpp)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pajak ({formData.pajakPersen}%):</span>
                  <span className="font-medium">{formatCurrency(totals.pajak)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Grand Total:</span>
                    <span className="font-bold text-green-600">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                  Simpan Penjualan
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

        {/* Barang Selection Modal */}
        {showBarangModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Pilih Barang</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Kode</th>
                      <th className="px-3 py-2 text-left">Nama Barang</th>
                      <th className="px-3 py-2 text-left">Harga</th>
                      <th className="px-3 py-2 text-left">Stok</th>
                      <th className="px-3 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barangs.map(barang => (
                      <tr key={barang.kode} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono">{barang.kode}</td>
                        <td className="px-3 py-2">{barang.nama}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(barang.harga)}</td>
                        <td className="px-3 py-2 text-right">{barang.stok}</td>
                        <td className="px-3 py-2">
                          <button 
                            onClick={() => selectBarang(barang, 0)}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                          >
                            Pilih
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setShowBarangModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSalesFormCompact;
