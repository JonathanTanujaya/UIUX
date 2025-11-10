import React, { useState } from 'react';
import { Search, ArrowLeft, Package, Building2, Plus, Trash2, X } from 'lucide-react';

const ModernReturPembelianForm = () => {
  const suppliers = [
    {
      id: 'SUP001',
      kodeSupplier: 'SUP001',
      nama: 'PT. Supplier Utama',
      alamat: 'Jl. Industri No. 123, Jakarta',
      telepon: '021-555-0123',
      email: 'purchase@supplierutama.com'
    },
    {
      id: 'SUP002',
      kodeSupplier: 'SUP002',
      nama: 'CV. Mitra Jaya',
      alamat: 'Jl. Perdagangan No. 456, Bandung',
      telepon: '022-555-0456',
      email: 'sales@mitrajaya.com'
    },
    {
      id: 'SUP003',
      kodeSupplier: 'SUP003',
      nama: 'UD. Sejahtera',
      alamat: 'Jl. Makmur No. 789, Surabaya',
      telepon: '031-555-0789',
      email: 'order@sejahtera.com'
    }
  ];

  const generateDummyBarang = () => {
    const baseItems = [
      { kode: 'SPR', nama: 'Bearing 6205', harga_beli: 45000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'V-Belt A-43', harga_beli: 85000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Oil Seal 35x52x7', harga_beli: 25000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Baut M12x50', harga_beli: 3500, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Pulley 5 Inch', harga_beli: 125000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Gear Motor 1HP', harga_beli: 1250000, satuan: 'UNIT' },
      { kode: 'SPR', nama: 'Chain 40-1', harga_beli: 185000, satuan: 'SET' },
      { kode: 'SPR', nama: 'Sprocket 15T', harga_beli: 95000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Coupling Flexible', harga_beli: 275000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Gasket Ring', harga_beli: 15000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Bolt M10x40', harga_beli: 2500, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Nut M10', harga_beli: 1500, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Washer M10', harga_beli: 800, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Shaft 25mm', harga_beli: 350000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Bushing Bronze', harga_beli: 125000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Rubber Seal', harga_beli: 35000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Spring Steel', harga_beli: 45000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Pin Dowel 8mm', harga_beli: 8500, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Key Parallel 8x7', harga_beli: 12000, satuan: 'PCS' },
      { kode: 'SPR', nama: 'Grease Tube', harga_beli: 55000, satuan: 'PCS' }
    ];

    const items = [];
    for (let i = 1; i <= 50; i++) {
      const baseItem = baseItems[i % baseItems.length];
      const paddedNum = String(i).padStart(3, '0');
      items.push({
         id: `SPR${paddedNum}`,
        kode: `SPR${paddedNum}`,
        nama: `${baseItem.nama} ${i > 20 ? 'Type ' + String.fromCharCode(65 + (i % 26)) : ''}`.trim(),
        harga_beli: baseItem.harga_beli + (i * 1000),
        stok: Math.floor(Math.random() * 200) + 50,
        satuan: baseItem.satuan
      });
    }
    return items;
  };

  const dummyBarang = generateDummyBarang();

  const [supplier, setSupplier] = useState(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [activeSupplierIndex, setActiveSupplierIndex] = useState(0);

  const [barangSearch, setBarangSearch] = useState('');
  const [barangSuggestions, setBarangSuggestions] = useState([]);
  const [showBarangSuggestions, setShowBarangSuggestions] = useState(false);
  const [activeBarangIndex, setActiveBarangIndex] = useState(0);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    noRetur: 'RTR-2025-001',
    noFakturAsli: '',
    alasanRetur: '',
    catatan: ''
  });

  const handleSupplierSearch = (value) => {
    setSupplierSearch(value);
    if (value.length > 0) {
      const filtered = suppliers
        .filter(s =>
          s.nama.toLowerCase().includes(value.toLowerCase()) ||
          s.kodeSupplier.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStartsWith = a.nama.toLowerCase().startsWith(value.toLowerCase()) || a.kodeSupplier.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.nama.toLowerCase().startsWith(value.toLowerCase()) || b.kodeSupplier.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });
      
      setSupplierSuggestions(filtered);
      setShowSupplierSuggestions(filtered.length > 0);
      setActiveSupplierIndex(0);
    } else {
      setShowSupplierSuggestions(false);
      setActiveSupplierIndex(0);
    }
  };

  const selectSupplier = (sup) => {
    setSupplier(sup);
    setSupplierSearch('');
    setShowSupplierSuggestions(false);
  };

  const resetSupplier = () => {
    setSupplier(null);
    setSupplierSearch('');
    setShowSupplierSuggestions(false);
    setItems([]);
  };

  const handleSupplierKeyDown = (e) => {
    if (!showSupplierSuggestions) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSupplierIndex(prev => (prev + 1) % supplierSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSupplierIndex(prev => prev === 0 ? supplierSuggestions.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (supplierSuggestions[activeSupplierIndex]) {
        selectSupplier(supplierSuggestions[activeSupplierIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSupplierSuggestions(false);
      setSupplierSearch('');
    }
  };

  const handleBarangSearch = (value) => {
    setBarangSearch(value);
    if (value.length > 0) {
      const filtered = dummyBarang
        .filter(b =>
          b.nama.toLowerCase().includes(value.toLowerCase()) ||
          b.kode.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStartsWith = a.nama.toLowerCase().startsWith(value.toLowerCase()) || a.kode.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.nama.toLowerCase().startsWith(value.toLowerCase()) || b.kode.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });
      
      setBarangSuggestions(filtered);
      setShowBarangSuggestions(filtered.length > 0);
      setActiveBarangIndex(0);
    } else {
      setShowBarangSuggestions(false);
      setActiveBarangIndex(0);
    }
  };

  const addBarang = (barang) => {
    const exists = items.find(item => item.id === barang.id);
    if (!exists) {
      setItems([...items, {
        ...barang,
        qty: 1,
        kondisi: 'rusak',
        keterangan: ''
      }]);
    }
    setBarangSearch('');
    setShowBarangSuggestions(false);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const formatRupiah = (amount) => {
    return 'Rp ' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.harga_beli * item.qty), 0);
  };

  const handleKeyDown = (e) => {
    // This function is no longer needed, removed
  };

  const handleBarangKeyDown = (e) => {
    if (!showBarangSuggestions) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveBarangIndex(prev => (prev + 1) % barangSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveBarangIndex(prev => prev === 0 ? barangSuggestions.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (barangSuggestions[activeBarangIndex]) {
        addBarang(barangSuggestions[activeBarangIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowBarangSuggestions(false);
      setBarangSearch('');
    }
  };

  const backToSearch = () => {
    // This function is no longer needed, removed
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="h-full flex flex-col">
        <div className="bg-white shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-l-4 border-orange-500 border-b border-gray-200 flex-shrink-0">
            <div className="min-w-[800px]">
              <div className="w-full">
                <div className="flex-1">
                  
                  {/* Supplier Search/Display and Catatan */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">KODE/NAMA SUPPLIER</label>
                      {!supplier ? (
                        <div className="relative">
                          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={supplierSearch}
                            onChange={(e) => handleSupplierSearch(e.target.value)}
                            onKeyDown={handleSupplierKeyDown}
                            placeholder="Ketik kode atau nama supplier..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            autoFocus
                          />
                          
                          {showSupplierSuggestions && (
                            <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {supplierSuggestions.map((sup, index) => (
                                <div
                                  key={sup.id}
                                  className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                    index === activeSupplierIndex ? 'bg-orange-50' : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => selectSupplier(sup)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium text-orange-600">{sup.kodeSupplier}</span>
                                    <span className="text-xs text-gray-600">•</span>
                                    <span className="text-xs text-gray-900">{sup.nama}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{sup.alamat}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-3 py-2 bg-orange-50 border border-orange-300 rounded-md flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-orange-600">{supplier.kodeSupplier}</span>
                              <span className="text-orange-400">•</span>
                              <span className="text-sm font-bold text-gray-900">{supplier.nama}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <span>{supplier.telepon}</span>
                              <span>•</span>
                              <span>{supplier.email}</span>
                            </div>
                          </div>
                          <button
                            onClick={resetSupplier}
                            className="ml-2 p-2 bg-red-50 text-red-600 border border-red-300 rounded-md hover:bg-red-100"
                            title="Reset Supplier"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">CATATAN</label>
                      <textarea
                        value={form.catatan}
                        onChange={(e) => setForm({...form, catatan: e.target.value})}
                        placeholder="Catatan retur pembelian..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {supplier ? (
              <div className="p-4">
            {/* Barang Table with Checkbox */}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b w-12">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Select all barang
                              const allItems = dummyBarang.map(brg => ({
                                ...brg,
                                qty: 1,
                                kondisi: 'Rusak',
                                keterangan: ''
                              }));
                              setItems(allItems);
                            } else {
                              // Deselect all
                              setItems([]);
                            }
                          }}
                          checked={items.length === dummyBarang.length && dummyBarang.length > 0}
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b">KODE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 border-b">NAMA BARANG</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">STOK</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 border-b">HARGA</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">QTY</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">KONDISI</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">KETERANGAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyBarang.map((brg) => {
                      const selectedItem = items.find(item => item.id === brg.id);
                      const isSelected = !!selectedItem;
                      return (
                        <tr key={brg.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-center border-b">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addBarang(brg);
                                } else {
                                  removeItem(brg.id);
                                }
                              }}
                              className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-3 py-2 border-b">
                            <span className="text-xs font-medium text-orange-600">{brg.kode}</span>
                          </td>
                          <td className="px-3 py-2 border-b">
                            <span className="text-xs text-gray-900">{brg.nama}</span>
                          </td>
                          <td className="px-3 py-2 text-center border-b">
                            <span className="text-xs text-gray-600">{brg.stok}</span>
                          </td>
                          <td className="px-3 py-2 text-right border-b">
                            <span className="text-xs text-gray-900">{formatRupiah(brg.harga_beli)}</span>
                          </td>
                          <td className="px-3 py-2 border-b">
                            {isSelected && (
                              <input
                                type="number"
                                min="1"
                                value={selectedItem.qty}
                                onChange={(e) => updateItem(brg.id, 'qty', parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                              />
                            )}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {isSelected && (
                              <select
                                value={selectedItem.kondisi}
                                onChange={(e) => updateItem(brg.id, 'kondisi', e.target.value)}
                                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                              >
                                <option value="Rusak">Rusak</option>
                                <option value="Cacat">Cacat</option>
                                <option value="Kadaluarsa">Kadaluarsa</option>
                                <option value="Salah Kirim">Salah Kirim</option>
                              </select>
                            )}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {isSelected && (
                              <input
                                type="text"
                                value={selectedItem.keterangan}
                                onChange={(e) => updateItem(brg.id, 'keterangan', e.target.value)}
                                placeholder="Keterangan..."
                                className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">KODE</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">NAMA BARANG</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">HARGA</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">QTY</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">SATUAN</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">KONDISI</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">SUBTOTAL</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">KETERANGAN</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 border-b">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center border-b">
                          <span className="text-sm text-gray-700">{item.kode}</span>
                        </td>
                        <td className="px-3 py-2 border-b">
                          <span className="text-sm text-gray-900">{item.nama}</span>
                        </td>
                        <td className="px-3 py-2 text-right border-b">
                          <span className="text-sm text-gray-700">{formatRupiah(item.harga_beli)}</span>
                        </td>
                        <td className="px-3 py-2 border-b">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                            className="w-20 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-3 py-2 text-center border-b">
                          <span className="text-sm text-gray-700">{item.satuan}</span>
                        </td>
                        <td className="px-3 py-2 border-b">
                          <select
                            value={item.kondisi}
                            onChange={(e) => updateItem(item.id, 'kondisi', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="rusak">Rusak</option>
                            <option value="cacat">Cacat</option>
                            <option value="expired">Expired</option>
                            <option value="salah_kirim">Salah Kirim</option>
                            <option value="tidak_sesuai">Tidak Sesuai</option>
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right border-b">
                          <span className="text-sm font-medium text-gray-900">{formatRupiah(item.harga_beli * item.qty)}</span>
                        </td>
                        <td className="px-3 py-2 border-b">
                          <input
                            type="text"
                            value={item.keterangan}
                            onChange={(e) => updateItem(item.id, 'keterangan', e.target.value)}
                            placeholder="Keterangan..."
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                          />
                        </td>
                        <td className="px-3 py-2 text-center border-b">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pilih Supplier Terlebih Dahulu</h3>
                <p className="text-gray-600">Silakan pilih supplier untuk memulai proses retur</p>
              </div>
            )}
          </div>

          {supplier && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-gray-600 mb-1">TOTAL NILAI RETUR</div>
                <div className="text-2xl font-bold text-orange-600">{formatRupiah(calculateTotal())}</div>
                <div className="text-xs text-gray-500 mt-1">{items.length} item</div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={resetSupplier}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Ganti Supplier
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium">
                  Simpan Draft
                </button>
                <button 
                  disabled={items.length === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    items.length === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  Proses Retur
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernReturPembelianForm;
