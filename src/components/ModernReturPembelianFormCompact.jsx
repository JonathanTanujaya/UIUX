import React, { useState } from 'react';
import { Search, Calendar, Building, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

const ModernReturPembelianFormCompact = () => {
  const [formData, setFormData] = useState({
    kodeSupplier: '',
    namaSupplier: '',
    keterangan: ''
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected items for return
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sample suppliers data - should come from API
  const suppliers = [
    { kode: 'SUPP001', nama: 'PT. Supplier Utama' },
    { kode: 'SUPP002', nama: 'CV. Mitra Supplier' },
    { kode: 'SUPP003', nama: 'UD. Sumber Sparepart' }
  ];

  // Sample purchase invoice data - sorted by latest date
  const purchases = [
    { 
      id: 1,
      no: 'PO-2025-003', 
      tglFaktur: '2025-08-30', 
      namaPurchaser: 'Admin Pembelian',
      kodeBarang: 'BRG003', 
      namaBarang: 'Ban Motor Tubeless',
      qtySupply: 10, 
      qtyClaim: 2, 
      qty: 8 
    },
    { 
      id: 2,
      no: 'PO-2025-002', 
      tglFaktur: '2025-08-28', 
      namaPurchaser: 'Admin Pembelian',
      kodeBarang: 'BRG002', 
      namaBarang: 'Filter Oli Premium',
      qtySupply: 20, 
      qtyClaim: 1, 
      qty: 19 
    },
    { 
      id: 3,
      no: 'PO-2025-001', 
      tglFaktur: '2025-08-25', 
      namaPurchaser: 'Admin Pembelian',
      kodeBarang: 'BRG001', 
      namaBarang: 'Sparepart Engine A100',
      qtySupply: 15, 
      qtyClaim: 0, 
      qty: 15 
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-fill nama supplier when kode supplier changes
    if (field === 'kodeSupplier') {
      const selectedSupplier = suppliers.find(s => s.kode === value);
      setFormData(prev => ({
        ...prev,
        kodeSupplier: value,
        namaSupplier: selectedSupplier ? selectedSupplier.nama : ''
      }));
    }
  };

  const selectSupplier = (supplier) => {
    setFormData(prev => ({
      ...prev,
      kodeSupplier: supplier.kode,
      namaSupplier: supplier.nama
    }));
    setShowSupplierModal(false);
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
    const selectedPurchaseItems = purchases.filter(purchase => selectedItems.includes(purchase.id));
    console.log('Processing return for items:', selectedPurchaseItems);
    console.log('Return details:', formData);
    
    // Here you would typically call API to process the return
    alert(`Retur berhasil diproses untuk ${selectedItems.length} item`);
    
    // Reset form
    setSelectedItems([]);
    setShowConfirmation(false);
    setFormData({
      kodeSupplier: '',
      namaSupplier: '',
      keterangan: ''
    });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Form - Simple Supplier Selection */}
        <div className="bg-white shadow-sm border border-l-4 border-blue-500 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode Supplier</label>
              <div className="flex space-x-2">
                <select
                  value={formData.kodeSupplier}
                  onChange={(e) => handleInputChange('kodeSupplier', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.kode} value={supplier.kode}>
                      {supplier.kode}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowSupplierModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Supplier</label>
              <input
                type="text"
                value={formData.namaSupplier}
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
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Purchase Invoice Table - Automatically shows when supplier is selected */}
        {formData.kodeSupplier && (
          <div className="bg-white shadow-sm border">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Daftar Purchase Order Supplier</h3>
              <p className="text-xs text-gray-600 mt-1">Diurutkan berdasarkan tanggal terbaru</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === purchases.length && purchases.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(purchases.map(purchase => purchase.id));
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No PO</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tgl Faktur</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purchaser</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Supply</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty Claim</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase, index) => (
                    <tr key={index} className={`hover:bg-gray-50 ${selectedItems.includes(purchase.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(purchase.id)}
                          onChange={(e) => handleItemSelection(purchase.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm font-mono text-blue-600">{purchase.no}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">
                        {new Date(purchase.tglFaktur).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{purchase.namaPurchaser}</td>
                      <td className="px-3 py-2 text-sm font-mono text-gray-900">{purchase.kodeBarang}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{purchase.namaBarang}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-center">{purchase.qtySupply}</td>
                      <td className="px-3 py-2 text-sm text-blue-600 text-center font-medium">{purchase.qtyClaim}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-center font-medium">{purchase.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Action Buttons */}
            <div className="p-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedItems.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
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
                      : 'bg-blue-600 text-white hover:bg-blue-700'
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
                <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Konfirmasi Retur Pembelian</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Anda akan memproses retur untuk <strong>{selectedItems.length} item</strong> dari supplier:
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">{formData.namaSupplier}</p>
                  <p className="text-sm text-gray-600">Kode: {formData.kodeSupplier}</p>
                  {formData.keterangan && (
                    <p className="text-sm text-gray-600 mt-1">Keterangan: {formData.keterangan}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Item yang akan diretur:</h4>
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {purchases
                    .filter(purchase => selectedItems.includes(purchase.id))
                    .map((purchase, index) => (
                      <div key={index} className="p-3 border-b last:border-b-0 bg-blue-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{purchase.namaBarang}</p>
                            <p className="text-xs text-gray-600">
                              {purchase.no} • {purchase.kodeBarang} • Qty: {purchase.qty}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Ya, Proses Retur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State when no supplier selected */}
        {!formData.kodeSupplier && (
          <div className="bg-white shadow-sm border p-6 text-center">
            <Building className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Supplier</h3>
            <p className="text-gray-600">Silahkan pilih supplier untuk melihat daftar purchase order</p>
          </div>
        )}

        {/* Supplier Selection Modal */}
        {showSupplierModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Pilih Supplier</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Kode Supplier</th>
                      <th className="px-3 py-2 text-left">Nama Supplier</th>
                      <th className="px-3 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(supplier => (
                      <tr key={supplier.kode} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono">{supplier.kode}</td>
                        <td className="px-3 py-2">{supplier.nama}</td>
                        <td className="px-3 py-2">
                          <button 
                            onClick={() => selectSupplier(supplier)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
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
                  onClick={() => setShowSupplierModal(false)}
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

export default ModernReturPembelianFormCompact;
