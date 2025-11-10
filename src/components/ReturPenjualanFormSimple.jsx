import React, { useState } from 'react';
import { Search, Calendar, User, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

const ModernReturPenjualanFormSimple = () => {
  const [formData, setFormData] = useState({
    kodeCustomer: '',
    namaCustomer: '',
    keterangan: ''
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected items for return
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sample customers data - should come from API
  const customers = [
    { kode: 'CUST001', nama: 'PT. Customer Utama' },
    { kode: 'CUST002', nama: 'CV. Pelanggan Setia' },
    { kode: 'CUST003', nama: 'UD. Mitra Dagang' }
  ];

  // Sample invoice data - sorted by latest date
  const invoices = [
    { 
      id: 1,
      no: 'INV-2025-003', 
      tglFaktur: '2025-08-30', 
      namaSales: 'John Doe',
      kodeBarang: 'BRG003', 
      namaBarang: 'Ban Motor Tubeless',
      qtySupply: 5, 
      qtyClaim: 1, 
      qty: 4 
    },
    { 
      id: 2,
      no: 'INV-2025-002', 
      tglFaktur: '2025-08-28', 
      namaSales: 'Jane Smith',
      kodeBarang: 'BRG002', 
      namaBarang: 'Filter Oli Premium',
      qtySupply: 10, 
      qtyClaim: 2, 
      qty: 8 
    },
    { 
      id: 3,
      no: 'INV-2025-001', 
      tglFaktur: '2025-08-25', 
      namaSales: 'Bob Wilson',
      kodeBarang: 'BRG001', 
      namaBarang: 'Sparepart Engine A100',
      qtySupply: 3, 
      qtyClaim: 0, 
      qty: 3 
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-fill nama customer when kode customer changes
    if (field === 'kodeCustomer') {
      const selectedCustomer = customers.find(c => c.kode === value);
      setFormData(prev => ({
        ...prev,
        kodeCustomer: value,
        namaCustomer: selectedCustomer ? selectedCustomer.nama : ''
      }));
    }
  };

  const selectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      kodeCustomer: customer.kode,
      namaCustomer: customer.nama
    }));
    setShowCustomerModal(false);
  };

  // Handle item selection for return
  const handleItemSelection = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Handle confirmation
  const handleConfirmReturn = () => {
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu item untuk diretur');
      return;
    }
    setShowConfirmation(true);
  };

  // Process return
  const processReturn = () => {
    const selectedInvoiceItems = invoices.filter(invoice => selectedItems.includes(invoice.id));
    console.log('Processing return for items:', selectedInvoiceItems);
    console.log('Return details:', formData);
    
    // Here you would typically call API to process the return
    alert(`Retur berhasil diproses untuk ${selectedItems.length} item`);
    
    // Reset form
    setSelectedItems([]);
    setShowConfirmation(false);
    setFormData({
      kodeCustomer: '',
      namaCustomer: '',
      keterangan: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Form - Simple Customer Selection */}
        <div className="bg-white shadow-sm border border-l-4 border-orange-500 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Customer</label>
              <div className="flex space-x-2">
                <select
                  value={formData.kodeCustomer}
                  onChange={(e) => handleInputChange('kodeCustomer', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Pilih Customer</option>
                  {customers.map(customer => (
                    <option key={customer.kode} value={customer.kode}>
                      {customer.kode}
                    </option>
                  ))}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Customer</label>
              <input
                type="text"
                value={formData.namaCustomer}
                readOnly
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                placeholder="Akan terisi otomatis"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <input
                type="text"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                placeholder="Masukkan keterangan..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Invoice Table - Automatically shows when customer is selected */}
        {formData.kodeCustomer && (
          <div className="bg-white shadow-sm border">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Daftar Invoice Customer</h3>
              <p className="text-xs text-gray-600 mt-1">Diurutkan berdasarkan tanggal terbaru</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === invoices.length && invoices.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(invoices.map(invoice => invoice.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No Invoice</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tgl Faktur</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Sales</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Supply</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Claim</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice, index) => (
                    <tr key={index} className={`hover:bg-gray-50 ${selectedItems.includes(invoice.id) ? 'bg-orange-50' : ''}`}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(invoice.id)}
                          onChange={(e) => handleItemSelection(invoice.id, e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm font-mono text-blue-600">{invoice.no}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        {new Date(invoice.tglFaktur).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{invoice.namaSales}</td>
                      <td className="px-3 py-2 text-sm font-mono text-gray-900">{invoice.kodeBarang}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{invoice.namaBarang}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-center">{invoice.qtySupply}</td>
                      <td className="px-3 py-2 text-sm text-orange-600 text-center font-medium">{invoice.qtyClaim}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-center font-medium">{invoice.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Action Buttons */}
            <div className="p-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedItems.length > 0 && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {selectedItems.length} item dipilih untuk retur
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setSelectedItems([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Reset Pilihan
                </button>
                <button 
                  onClick={handleConfirmReturn}
                  disabled={selectedItems.length === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedItems.length === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Konfirmasi Retur ({selectedItems.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold">Konfirmasi Retur Penjualan</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Anda akan memproses retur untuk <strong>{selectedItems.length} item</strong> dari customer:
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">{formData.namaCustomer}</p>
                  <p className="text-sm text-gray-600">Kode: {formData.kodeCustomer}</p>
                  {formData.keterangan && (
                    <p className="text-sm text-gray-600 mt-1">Keterangan: {formData.keterangan}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Item yang akan diretur:</h4>
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {invoices
                    .filter(invoice => selectedItems.includes(invoice.id))
                    .map((invoice, index) => (
                      <div key={index} className="p-3 border-b last:border-b-0 bg-orange-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{invoice.namaBarang}</p>
                            <p className="text-xs text-gray-600">
                              {invoice.no} • {invoice.kodeBarang} • Qty: {invoice.qty}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={processReturn}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Ya, Proses Retur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State when no customer selected */}
        {!formData.kodeCustomer && (
          <div className="bg-white shadow-sm border p-6 text-center">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Customer</h3>
            <p className="text-gray-600">Silahkan pilih customer untuk melihat daftar invoice</p>
          </div>
        )}

        {/* Customer Selection Modal */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Pilih Customer</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Kode Customer</th>
                      <th className="px-3 py-2 text-left">Nama Customer</th>
                      <th className="px-3 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr key={customer.kode} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono">{customer.kode}</td>
                        <td className="px-3 py-2">{customer.nama}</td>
                        <td className="px-3 py-2">
                          <button 
                            onClick={() => selectCustomer(customer)}
                            className="px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
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
                  onClick={() => setShowCustomerModal(false)}
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

export default ModernReturPenjualanFormSimple;
