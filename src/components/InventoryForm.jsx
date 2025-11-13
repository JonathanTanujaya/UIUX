import React, { useState } from 'react';
import { Plus, Package, Trash2 } from 'lucide-react';

const ModernInventoryForm = () => {
  // Data dummy sparepart dari SparepartListPage
  const dummySpareparts = [
    {
      kode_barang: 'SPR001',
      nama_barang: 'Filter Oli Mesin',
      kode_kategori: 'FILTER',
      satuan: 'pcs',
      harga_beli: 35000,
      harga_jual: 50000
    },
    {
      kode_barang: 'SPR002',
      nama_barang: 'Brake Pad Depan',
      kode_kategori: 'BRAKE',
      satuan: 'set',
      harga_beli: 120000,
      harga_jual: 180000
    },
    {
      kode_barang: 'SPR003',
      nama_barang: 'Spark Plug NGK',
      kode_kategori: 'ENGINE',
      satuan: 'pcs',
      harga_beli: 25000,
      harga_jual: 40000
    },
    {
      kode_barang: 'SPR004',
      nama_barang: 'Timing Belt',
      kode_kategori: 'ENGINE',
      satuan: 'pcs',
      harga_beli: 85000,
      harga_jual: 125000
    },
    {
      kode_barang: 'SPR005',
      nama_barang: 'Air Filter',
      kode_kategori: 'FILTER',
      satuan: 'pcs',
      harga_beli: 45000,
      harga_jual: 65000
    },
    {
      kode_barang: 'SPR006',
      nama_barang: 'Radiator Coolant',
      kode_kategori: 'COOLANT',
      satuan: 'liter',
      harga_beli: 28000,
      harga_jual: 42000
    },
    {
      kode_barang: 'SPR007',
      nama_barang: 'Disc Brake Rotor',
      kode_kategori: 'BRAKE',
      satuan: 'pcs',
      harga_beli: 350000,
      harga_jual: 480000
    },
    {
      kode_barang: 'SPR008',
      nama_barang: 'Engine Oil 5W-30',
      kode_kategori: 'OIL',
      satuan: 'liter',
      harga_beli: 75000,
      harga_jual: 95000
    }
  ];
  const [formData, setFormData] = useState({
    tglTerima: new Date().toISOString().split('T')[0],
    tglJatuhTempo: '',
    noFaktur: 'PO-2025-001',
    supplier: 'supplier1',
    catatan: '',
    ppn: '11',
    diskonGlobal: '0',
    items: []
  });

  // State untuk add item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchInput(value);
    
    if (value.length > 0) {
      const filtered = dummySpareparts
        .filter(item =>
          item.nama_barang.toLowerCase().includes(value.toLowerCase()) ||
          item.kode_barang.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStartsWith = a.kode_barang.toLowerCase().startsWith(value.toLowerCase()) || a.nama_barang.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.kode_barang.toLowerCase().startsWith(value.toLowerCase()) || b.nama_barang.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        })
        .slice(0, 8); // Limit to 8 suggestions
      
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveIndex(0);
    } else {
      setShowSuggestions(false);
      setActiveIndex(0);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (sparepart) => {
    const newItem = {
      id: Date.now(),
      kode: sparepart.kode_barang,
      nama: sparepart.nama_barang,
      qty: 1,
      satuan: sparepart.satuan.toUpperCase(),
      harga: sparepart.harga_beli,
      disc1: 0,
      disc2: 0,
    };
    
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setSearchInput('');
    setShowSuggestions(false);
    setShowAddForm(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % searchSuggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev === 0 ? searchSuggestions.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (searchSuggestions[activeIndex]) {
          handleSelectSuggestion(searchSuggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSearchInput('');
        break;
    }
  };

  const addItem = () => {
    setShowAddForm(true);
    setSearchInput('');
    setShowSuggestions(false);
  };

  const cancelAddItem = () => {
    setShowAddForm(false);
    setSearchInput('');
    setShowSuggestions(false);
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
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
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="w-full mx-auto flex-1 flex flex-col">
        {/* Container Utama - Grid 81% / 19% */}
        <div className="bg-white shadow-sm border flex-1">
          <div className="grid grid-cols-[80%_20%] gap-0 w-full">
            {/* Kolom Kiri: Supplier + Daftar Barang */}
            <div className="flex flex-col min-w-0">
              {/* Header Form - di puncak kolom kiri */}
              <div className="p-3 border-l-4 border-blue-500 border-b border-gray-200">
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
                  <div className="flex-[1.5] min-w-[220px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">SUPPLIER</label>
                    <div className="flex">
                      <select
                        value={formData.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Pilih Supplier</option>
                        <option value="supplier1">PT. Supplier Jaya</option>
                        <option value="supplier2">CV. Mitra Sejahtera</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table - Flexible width */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="p-3 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Daftar Barang</h3>
                  </div>

                  {/* Add Item Form */}
                  {showAddForm && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">Tambah Barang Baru</h4>
                        <button
                          onClick={cancelAddItem}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Batal
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ketik kode atau nama barang..."
                          className="w-full px-3 py-2 text-sm border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {searchSuggestions.map((item, index) => (
                              <div
                                key={item.kode_barang}
                                className={`px-3 py-2 cursor-pointer ${
                                  index === activeIndex ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleSelectSuggestion(item)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-blue-600">{item.kode_barang}</span>
                                    <span className="text-gray-600 ml-2">• {item.nama_barang}</span>
                                  </div>
                                  <div className="text-sm text-gray-500">Rp {formatCurrency(item.harga_beli)}</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{item.satuan.toUpperCase()} • {item.kode_kategori}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Table - Hidden Vertical Scroll */}
                <div className="overflow-auto flex-1">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ width: '40px' }}>No</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '120px' }}>Kode</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '180px' }}>Nama Barang</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ width: '70px' }}>Qty</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ width: '80px' }}>Satuan</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '100px' }}>Harga</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ width: '60px' }}>D1%</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ width: '60px' }}>D2%</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ minWidth: '110px' }}>Subtotal</th>
                        <th className="px-2 py-1.5 text-center text-xs font-medium text-gray-500 uppercase" style={{ width: '50px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-2 py-1.5 text-xs text-gray-900">{index + 1}</td>
                          <td className="px-2 py-1.5 text-xs"><span className="font-medium text-blue-600">{item.kode}</span></td>
                          <td className="px-2 py-1.5 text-xs"><span className="text-gray-900">{item.nama}</span></td>
                          <td className="px-2 py-1.5 text-xs">
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                              style={{ width: '60px' }}
                              min="1"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-xs">
                            <select
                              value={item.satuan}
                              onChange={(e) => handleItemChange(index, 'satuan', e.target.value)}
                              className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 bg-white"
                              style={{ width: '70px' }}
                            >
                              <option value="PCS">PCS</option>
                              <option value="SET">SET</option>
                              <option value="BOX">BOX</option>
                              <option value="UNIT">UNIT</option>
                              <option value="PACK">PACK</option>
                              <option value="LUSIN">LUSIN</option>
                              <option value="KARTON">KARTON</option>
                              <option value="LITER">LITER</option>
                            </select>
                          </td>
                          <td className="px-2 py-1.5 text-xs text-right"><span className="font-medium text-gray-900">Rp {formatCurrency(item.harga)}</span></td>
                          <td className="px-2 py-1.5 text-xs">
                            <input
                              type="number"
                              value={item.disc1}
                              onChange={(e) => handleItemChange(index, 'disc1', parseFloat(e.target.value) || 0)}
                              className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                              style={{ width: '50px' }}
                              min="0"
                              max="100"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-xs">
                            <input
                              type="number"
                              value={item.disc2}
                              onChange={(e) => handleItemChange(index, 'disc2', parseFloat(e.target.value) || 0)}
                              className="w-full px-1 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                              style={{ width: '50px' }}
                              min="0"
                              max="100"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-xs font-medium text-gray-900 text-right">Rp {formatCurrency(calculateItemSubtotal(item))}</td>
                          <td className="px-2 py-1.5 text-xs">
                            <button onClick={() => removeItem(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {formData.items.length === 0 && showAddForm && (
                        <tr>
                          <td colSpan="10" className="px-2 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Package className="w-8 h-8 mx-auto text-gray-300" />
                              <p className="text-xs text-gray-500">Ketik nama atau kode barang di atas untuk menambahkan item</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      {formData.items.length === 0 && !showAddForm && (
                        <tr>
                          <td colSpan="10" className="px-2 py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center space-y-4">
                              <Package className="w-12 h-12 mx-auto text-gray-300" />
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 mb-1">Belum ada item barang</p>
                                <p className="text-xs text-gray-500 mb-4">Klik tombol "Tambah" untuk menambahkan barang ke daftar pembelian</p>
                                <button onClick={addItem} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 space-x-2">
                                  <Plus className="w-4 h-4" />
                                  <span>Tambah Item Pertama</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Ringkasan */}
            <div className="bg-gray-50 border-l border-gray-200 p-3 flex flex-col min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Ringkasan</h3>

              {/* Input Keuangan */}
              <div className="space-y-3 mb-3">
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
                    rows={3}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Ringkasan Angka */}
              <div className="mt-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diskon Global:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(totals.diskonGlobal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">After Diskon:</span>
                    <span className="font-medium">{formatCurrency(totals.afterDiskon)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PPN ({formData.ppn}%):</span>
                    <span className="font-medium">{formatCurrency(totals.ppn)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 text-sm">Grand Total:</span>
                      <span className="font-bold text-blue-600 text-lg">{formatCurrency(totals.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="mt-3 space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">Simpan Pembelian</button>
                <button className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Simpan Draft</button>
                <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernInventoryForm;
