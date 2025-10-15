import React, { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, Trash2, Check, X } from 'lucide-react';

const StokOpnamePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([
    {
      id: 1,
      kodeBarang: 'R12K4H',
      namaBarang: 'RELAY 12V KAKI 4 HELLA',
      merk: 'HELLA',
      stock: 0,
      modal: 0,
      qty: 0
    },
    {
      id: 2,
      kodeBarang: 'R12K4H',
      namaBarang: 'RELAY 12V KAKI 4 HELLA',
      merk: 'HELLA',
      stock: 0,
      modal: 18915,
      qty: 0
    },
    {
      id: 3,
      kodeBarang: 'WB12H',
      namaBarang: 'WIPER BLADE 12" HELLA',
      merk: 'HELLA',
      stock: 0,
      modal: 26190,
      qty: 0
    },
    {
      id: 4,
      kodeBarang: 'WB14H',
      namaBarang: 'WIPER BLADE 14" HELLA',
      merk: 'HELLA',
      stock: 0,
      modal: 26190,
      qty: 0
    },
    {
      id: 5,
      kodeBarang: 'WB14H',
      namaBarang: 'WIPER BLADE 14" HELLA',
      merk: 'HELLA',
      stock: 14,
      modal: 25404.3,
      qty: 14
    },
    {
      id: 6,
      kodeBarang: 'WB16H',
      namaBarang: 'WIPER BLADE 16" HELLA',
      merk: 'HELLA',
      stock: 0,
      modal: 0,
      qty: 0
    },
    {
      id: 7,
      kodeBarang: 'WB17H',
      namaBarang: 'WIPER BLADE 17" HELLA',
      merk: 'HELLA',
      stock: 100,
      modal: 27645,
      qty: 100
    },
    {
      id: 8,
      kodeBarang: 'WB18H',
      namaBarang: 'WIPER BLADE 18" HELLA',
      merk: 'HELLA',
      stock: 3,
      modal: 27645,
      qty: 3
    },
    {
      id: 9,
      kodeBarang: 'WB19H',
      namaBarang: 'WIPER BLADE 19" HELLA',
      merk: 'HELLA',
      stock: 10,
      modal: 29827.5,
      qty: 10
    },
    {
      id: 10,
      kodeBarang: 'WB20H',
      namaBarang: 'WIPER BLADE 20" HELLA',
      merk: 'HELLA',
      stock: 0,
      modal: 29827.5,
      qty: 0
    }
  ]);

  // Filter items berdasarkan search term
  const filteredItems = items.filter(item => 
    item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle checkbox selection
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  // Handle suspend/delete selected items
  const handleSuspendItems = () => {
    if (selectedItems.length === 0) return;
    
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin suspend ${selectedItems.length} item yang dipilih?`
    );
    
    if (confirmDelete) {
      setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari kode barang atau nama barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode Barang
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merk
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modal
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.kodeBarang}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.namaBarang}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {item.merk}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.stock}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(item.modal)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.qty}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.stock === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Empty
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tidak ada barang yang sesuai dengan pencarian.' : 'Belum ada data barang.'}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>
                Menampilkan {filteredItems.length} dari {items.length} item
              </span>
              {selectedItems.length > 0 && (
                <span className="font-medium text-blue-600">
                  {selectedItems.length} item dipilih
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StokOpnamePage;