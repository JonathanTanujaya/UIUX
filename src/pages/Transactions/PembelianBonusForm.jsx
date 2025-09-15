import React, { useState } from 'react';
import { Calendar, Building, Package, Plus, Trash2 } from 'lucide-react';

const PembelianBonusForm = () => {
  const [formData, setFormData] = useState({
    tanggalPenerimaan: new Date().toISOString().split('T')[0], // Default hari ini
    jatuhTempo: new Date().toISOString().split('T')[0], // Default hari ini
    kodeSupplier: '',
    namaSupplier: '',
    noFaktur: '',
    items: [
      { id: 1, kodeBarang: '', namaBarang: '', qty: 0 }
    ]
  });

  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [supplierActiveIndex, setSupplierActiveIndex] = useState(-1);
  
  const [barangSuggestions, setBarangSuggestions] = useState([]);
  const [showBarangSuggestions, setShowBarangSuggestions] = useState(false);
  const [barangActiveIndex, setBarangActiveIndex] = useState(-1);
  const [activeBarangIndex, setActiveBarangIndex] = useState(-1);

  // Sample suppliers data
  const suppliers = [
    { kode: 'SUPP001', nama: 'PT. Supplier Utama' },
    { kode: 'SUPP002', nama: 'CV. Mitra Supplier' },
    { kode: 'SUPP003', nama: 'UD. Sumber Sparepart' }
  ];

  // Sample barang data
  const barangList = [
    { kode: 'BRG001', nama: 'Sparepart Engine A100' },
    { kode: 'BRG002', nama: 'Filter Oli Premium' },
    { kode: 'BRG003', nama: 'Ban Motor Tubeless' },
    { kode: 'WB12H', nama: 'WIPER BLADE 12" HELLA' },
    { kode: 'WB14H', nama: 'WIPER BLADE 14" HELLA' }
  ];

  const handleSupplierInputChange = (value) => {
    setFormData(prev => ({ ...prev, namaSupplier: value }));
    
    if (value.length > 0) {
      const filtered = suppliers
        .filter(s =>
          s.nama.toLowerCase().includes(value.toLowerCase()) ||
          s.kode.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStartsWith = a.nama.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.nama.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });
      
      setSupplierSuggestions(filtered);
      setShowSupplierSuggestions(filtered.length > 0);
      setSupplierActiveIndex(0); // Auto-select first item
    } else {
      setShowSupplierSuggestions(false);
      setSupplierActiveIndex(-1);
      setFormData(prev => ({ ...prev, kodeSupplier: '' }));
    }
  };

  const selectSupplier = (supplier) => {
    setFormData(prev => ({
      ...prev,
      kodeSupplier: supplier.kode,
      namaSupplier: supplier.nama
    }));
    setShowSupplierSuggestions(false);
    setSupplierActiveIndex(-1);
  };

  const handleSupplierKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showSupplierSuggestions && supplierSuggestions.length > 0) {
        setShowSupplierSuggestions(true);
        setSupplierActiveIndex(0);
      } else if (showSupplierSuggestions) {
        setSupplierActiveIndex(prev => 
          prev < supplierSuggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSupplierSuggestions) {
        setSupplierActiveIndex(prev => 
          prev > 0 ? prev - 1 : supplierSuggestions.length - 1
        );
      }
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (showSupplierSuggestions && supplierActiveIndex >= 0 && supplierSuggestions[supplierActiveIndex]) {
        e.preventDefault();
        selectSupplier(supplierSuggestions[supplierActiveIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSupplierSuggestions(false);
      setSupplierActiveIndex(-1);
    }
  };

  const handleBarangInputChange = (index, value) => {
    updateItemField(index, 'namaBarang', value);
    
    if (value.length > 0) {
      const filtered = barangList
        .filter(b =>
          b.nama.toLowerCase().includes(value.toLowerCase()) ||
          b.kode.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aStartsWith = a.nama.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.nama.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });
      
      setBarangSuggestions(filtered);
      setShowBarangSuggestions(filtered.length > 0);
      setActiveBarangIndex(index);
      setBarangActiveIndex(0); // Auto-select first item
    } else {
      setShowBarangSuggestions(false);
      setBarangActiveIndex(-1);
      setActiveBarangIndex(-1);
      updateItemField(index, 'kodeBarang', '');
    }
  };

  const selectBarang = (barang) => {
    updateItemField(activeBarangIndex, 'kodeBarang', barang.kode);
    updateItemField(activeBarangIndex, 'namaBarang', barang.nama);
    setShowBarangSuggestions(false);
    setBarangActiveIndex(-1);
    setActiveBarangIndex(-1);
  };

  const handleBarangKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showBarangSuggestions && barangSuggestions.length > 0) {
        setShowBarangSuggestions(true);
        setActiveBarangIndex(index);
        setBarangActiveIndex(0);
      } else if (showBarangSuggestions && activeBarangIndex === index) {
        setBarangActiveIndex(prev => 
          prev < barangSuggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showBarangSuggestions && activeBarangIndex === index) {
        setBarangActiveIndex(prev => 
          prev > 0 ? prev - 1 : barangSuggestions.length - 1
        );
      }
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (showBarangSuggestions && activeBarangIndex === index && barangActiveIndex >= 0 && barangSuggestions[barangActiveIndex]) {
        e.preventDefault();
        selectBarang(barangSuggestions[barangActiveIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowBarangSuggestions(false);
      setBarangActiveIndex(-1);
      setActiveBarangIndex(-1);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateItemField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      kodeBarang: '',
      namaBarang: '',
      qty: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    alert('Pembelian bonus berhasil disimpan!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Form */}
          <div className="bg-white shadow-sm border border-l-4 border-green-500 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tanggal Penerimaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tanggal Penerimaan
                </label>
                <input
                  type="date"
                  value={formData.tanggalPenerimaan}
                  onChange={(e) => handleInputChange('tanggalPenerimaan', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Jatuh Tempo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={formData.jatuhTempo}
                  onChange={(e) => handleInputChange('jatuhTempo', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* No Faktur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Faktur</label>
                <input
                  type="text"
                  value={formData.noFaktur}
                  onChange={(e) => handleInputChange('noFaktur', e.target.value)}
                  placeholder="Masukkan no faktur..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Supplier Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.namaSupplier}
                  onChange={(e) => handleSupplierInputChange(e.target.value)}
                  onKeyDown={handleSupplierKeyDown}
                  onBlur={() => setTimeout(() => setShowSupplierSuggestions(false), 150)}
                  onFocus={(e) => handleSupplierInputChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent peer placeholder-transparent"
                  placeholder="Supplier"
                  autoComplete="off"
                  required
                />
                <label className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 ${
                  formData.namaSupplier 
                    ? '-top-2 text-xs bg-white px-1 text-green-600' 
                    : 'top-2 text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:text-green-600'
                }`}>
                  <Building className="w-3 h-3 inline mr-1" />
                  Supplier
                </label>
                
                {/* Supplier Suggestions Dropdown */}
                {showSupplierSuggestions && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {supplierSuggestions.map((supplier, index) => (
                      <div
                        key={supplier.kode}
                        className={`px-3 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                          index === supplierActiveIndex 
                            ? 'bg-green-600 text-white' 
                            : 'hover:bg-green-50 text-gray-700'
                        }`}
                        onMouseDown={() => selectSupplier(supplier)}
                        onMouseEnter={() => setSupplierActiveIndex(index)}
                      >
                        <div className="font-medium" 
                             dangerouslySetInnerHTML={{
                               __html: highlightMatch(supplier.nama, formData.namaSupplier)
                             }} 
                        />
                        <div className={`text-xs ${index === supplierActiveIndex ? 'text-green-200' : 'text-gray-500'}`}>
                          {supplier.kode}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={formData.kodeSupplier}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600 peer placeholder-transparent"
                  placeholder="Kode Supplier"
                />
                <label className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 ${
                  formData.kodeSupplier 
                    ? '-top-2 text-xs bg-white px-1 text-gray-600' 
                    : 'top-2 text-sm'
                }`}>
                  Kode Supplier
                </label>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white shadow-sm border">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                <Package className="w-5 h-5 inline mr-2" />
                Items Bonus
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-3 py-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={item.namaBarang}
                            onChange={(e) => handleBarangInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleBarangKeyDown(e, index)}
                            onBlur={() => setTimeout(() => setShowBarangSuggestions(false), 150)}
                            onFocus={(e) => handleBarangInputChange(index, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent peer placeholder-transparent"
                            placeholder="Barang"
                            autoComplete="off"
                          />
                          <label className={`absolute left-2 transition-all duration-200 pointer-events-none text-gray-500 ${
                            item.namaBarang 
                              ? '-top-1.5 text-[10px] bg-white px-1 text-green-600' 
                              : 'top-1 text-xs peer-focus:-top-1.5 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-green-600'
                          }`}>
                            Barang
                          </label>
                          
                          {/* Barang Suggestions Dropdown */}
                          {showBarangSuggestions && activeBarangIndex === index && (
                            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
                              {barangSuggestions.map((barang, suggIndex) => (
                                <div
                                  key={barang.kode}
                                  className={`px-2 py-1 cursor-pointer text-xs border-b border-gray-100 last:border-b-0 ${
                                    suggIndex === barangActiveIndex 
                                      ? 'bg-green-600 text-white' 
                                      : 'hover:bg-green-50 text-gray-700'
                                  }`}
                                  onMouseDown={() => selectBarang(barang)}
                                  onMouseEnter={() => setBarangActiveIndex(suggIndex)}
                                >
                                  <div className="font-medium" 
                                       dangerouslySetInnerHTML={{
                                         __html: highlightMatch(barang.nama, item.namaBarang)
                                       }} 
                                  />
                                  <div className={`text-[10px] ${suggIndex === barangActiveIndex ? 'text-green-200' : 'text-gray-500'}`}>
                                    {barang.kode}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={item.kodeBarang}
                          readOnly
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50 text-gray-600 text-center"
                          placeholder="Auto"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItemField(index, 'qty', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-green-500 text-center"
                          min="0"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          disabled={formData.items.length === 1}
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 flex items-center"
            >
              <Package className="w-4 h-4 mr-2" />
              Simpan Pembelian Bonus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PembelianBonusForm;
