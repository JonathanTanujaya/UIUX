import React, { useState } from 'react';
import { Plus, Search, Package, Calendar, FileText, Building, Calculator } from 'lucide-react';
import ModernDataTable from './ModernDataTable';

const ModernPurchaseForm = () => {
  const [formData, setFormData] = useState({
    tglTerima: '',
    tglJatuhTempo: '',
    noFaktur: '',
    supplier: '',
    catatan: '',
    ppn: '11',
    diskonGlobal: '0',
    items: []
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = () => {
    // Logic to add new item
    console.log('Add new item');
  };

  const editItem = (item) => {
    console.log('Edit item:', item);
  };

  const deleteItem = (item) => {
    console.log('Delete item:', item);
  };

  // Define columns for the items table
  const itemColumns = [
    { key: 'no', title: 'No', render: (_, item, index) => index + 1 },
    { key: 'kode', title: 'Kode' },
    { key: 'nama', title: 'Nama Barang' },
    { key: 'qty', title: 'Qty', type: 'number' },
    { key: 'satuan', title: 'Satuan' },
    { key: 'harga', title: 'Harga', type: 'currency' },
    { key: 'd1', title: 'D1%', render: (value) => `${value || 0}%` },
    { key: 'd2', title: 'D2%', render: (value) => `${value || 0}%` },
    { key: 'hargaNet', title: 'Harga Net', type: 'currency' },
    { key: 'subtotal', title: 'Subtotal', type: 'currency' }
  ];

  // Sample data for demonstration
  const sampleItems = [
    {
      id: 1,
      kode: 'BRG001',
      nama: 'Oli Mesin Mobil 1L',
      qty: 5,
      satuan: 'Botol',
      harga: 85000,
      d1: 5,
      d2: 2,
      hargaNet: 79050,
      subtotal: 395250
    },
    {
      id: 2,
      kode: 'BRG002',
      nama: 'Filter Udara Honda Jazz',
      qty: 3,
      satuan: 'Pcs',
      harga: 120000,
      d1: 10,
      d2: 0,
      hargaNet: 108000,
      subtotal: 324000
    }
  ];

  return (
    <div className=" bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Document Information Card */}
        <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Document Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  TGL TERIMA
                </label>
                <input
                  type="date"
                  value={formData.tglTerima}
                  onChange={(e) => handleInputChange('tglTerima', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  TGL JATUH TEMPO
                </label>
                <input
                  type="date"
                  value={formData.tglJatuhTempo}
                  onChange={(e) => handleInputChange('tglJatuhTempo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  NO FAKTUR
                </label>
                <input
                  type="text"
                  value={formData.noFaktur}
                  onChange={(e) => handleInputChange('noFaktur', e.target.value)}
                  placeholder="Masukkan nomor faktur"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Information Card */}
        <div className="bg-white rounded-xl border-l-4 border-green-500 shadow-sm">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Building className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Supplier Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SUPPLIER
                </label>
                <div className="flex space-x-3">
                  <select
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Pilih Supplier</option>
                    <option value="supplier1">PT. Supplier Utama</option>
                    <option value="supplier2">CV. Mitra Jaya</option>
                    <option value="supplier3">UD. Sumber Rezeki</option>
                  </select>
                  <button 
                    onClick={() => setShowSupplierModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Cari</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CATATAN
                </label>
                <textarea
                  value={formData.catatan}
                  onChange={(e) => handleInputChange('catatan', e.target.value)}
                  placeholder="Tambahkan catatan untuk transaksi ini..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information Card */}
        <div className="bg-white rounded-xl border-l-4 border-orange-500 shadow-sm">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PPN %
                </label>
                <input
                  type="number"
                  value={formData.ppn}
                  onChange={(e) => handleInputChange('ppn', e.target.value)}
                  placeholder="11"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DISKON GLOBAL
                </label>
                <input
                  type="number"
                  value={formData.diskonGlobal}
                  onChange={(e) => handleInputChange('diskonGlobal', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <ModernDataTable
          title="Daftar Barang"
          subtitle="Kelola item pembelian"
          columns={itemColumns}
          data={sampleItems}
          onAdd={addItem}
          onEdit={editItem}
          onDelete={deleteItem}
          borderColor="border-purple-500"
          addButtonText="Tambah Barang"
          emptyStateText="Belum ada barang"
          emptyStateSubtext="Klik 'Tambah Barang' untuk menambah item"
        />

        {/* Summary Card */}
        {formData.items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(150000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diskon Global:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(formData.diskonGlobal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DPP:</span>
                  <span className="font-medium">{formatCurrency(150000 - formData.diskonGlobal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PPN ({formData.ppn}%):</span>
                  <span className="font-medium">{formatCurrency((150000 - formData.diskonGlobal) * (formData.ppn / 100))}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency((150000 - formData.diskonGlobal) * (1 + formData.ppn / 100))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm">
            Cancel
          </button>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-sm">
            Save as Draft
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-sm">
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernPurchaseForm;
