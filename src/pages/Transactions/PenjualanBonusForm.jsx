import React, { useState } from 'react';
import { Calendar, Building, Package, Plus, Trash2, User, ShoppingCart } from 'lucide-react';

const PenjualanBonusForm = () => {
  const [formData, setFormData] = useState({
    tanggalPenjualan: new Date().toISOString().split('T')[0], // Default hari ini
    jatuhTempo: new Date().toISOString().split('T')[0], // Default hari ini
    kodeCustomer: '',
    namaCustomer: '',
    noFaktur: '',
    items: [
      { id: 1, kodeBarang: '', namaBarang: '', qty: 0 }
    ]
  });

  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [customerActiveIndex, setCustomerActiveIndex] = useState(-1);
  
  const [barangSuggestions, setBarangSuggestions] = useState([]);
  const [showBarangSuggestions, setShowBarangSuggestions] = useState(false);
  const [barangActiveIndex, setBarangActiveIndex] = useState(-1);
  const [activeBarangIndex, setActiveBarangIndex] = useState(-1);

  // Sample customers data
  const customers = [
    { kode: 'CUST001', nama: 'PT. Customer Utama' },
    { kode: 'CUST002', nama: 'CV. Pelanggan Setia' },
    { kode: 'CUST003', nama: 'UD. Mitra Dagang' }
  ];

  // Sample barang data
  const barangList = [
    { kode: 'BRG001', nama: 'Sparepart Engine A100' },
    { kode: 'BRG002', nama: 'Filter Oli Premium' },
    { kode: 'BRG003', nama: 'Ban Motor Tubeless' },
    { kode: 'WB12H', nama: 'WIPER BLADE 12" HELLA' },
    { kode: 'WB14H', nama: 'WIPER BLADE 14" HELLA' }
  ];

  const handleCustomerInputChange = (value) => {
    setFormData(prev => ({ ...prev, namaCustomer: value }));
    
    if (value.length > 0) {
      const filtered = customers
        .filter(c =>
          c.nama.toLowerCase().includes(value.toLowerCase()) ||
          c.kode.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => {
          const aMatch = a.nama.toLowerCase().indexOf(value.toLowerCase());
          const bMatch = b.nama.toLowerCase().indexOf(value.toLowerCase());
          return aMatch - bMatch;
        });
      
      setCustomerSuggestions(filtered);
      setShowCustomerSuggestions(true);
      setCustomerActiveIndex(-1);
    } else {
      setCustomerSuggestions([]);
      setShowCustomerSuggestions(false);
    }
  };

  const selectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      namaCustomer: customer.nama,
      kodeCustomer: customer.kode
    }));
    setShowCustomerSuggestions(false);
    setCustomerActiveIndex(-1);
  };

  const handleBarangInputChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'namaBarang' && value.length > 0) {
      const filtered = barangList
        .filter(item =>
          item.nama.toLowerCase().includes(value.toLowerCase()) ||
          item.kode.toLowerCase().includes(value.toLowerCase())
        );
      
      setBarangSuggestions(filtered);
      setShowBarangSuggestions(true);
      setActiveBarangIndex(index);
      setBarangActiveIndex(-1);
    } else if (field === 'namaBarang') {
      setBarangSuggestions([]);
      setShowBarangSuggestions(false);
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const selectBarang = (barang) => {
    const updatedItems = [...formData.items];
    updatedItems[activeBarangIndex] = {
      ...updatedItems[activeBarangIndex],
      kodeBarang: barang.kode,
      namaBarang: barang.nama
    };
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
    setShowBarangSuggestions(false);
    setBarangActiveIndex(-1);
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Data penjualan bonus berhasil disimpan!');
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? `<mark class="bg-yellow-200">${part}</mark>` 
        : part
    ).join('');
  };

  const handleCustomerKeyDown = (e) => {
    if (!showCustomerSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setCustomerActiveIndex(prev => 
          prev < customerSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setCustomerActiveIndex(prev => 
          prev > 0 ? prev - 1 : customerSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (customerActiveIndex >= 0) {
          selectCustomer(customerSuggestions[customerActiveIndex]);
        }
        break;
      case 'Escape':
        setShowCustomerSuggestions(false);
        setCustomerActiveIndex(-1);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Form */}
          <div className="bg-white shadow-sm border border-l-4 border-blue-500 p-4">
            {/* Single Row: All fields responsive to fill device width */}
            <div className="flex gap-2 w-full">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  TGL PENJUALAN
                </label>
                <input
                  type="date"
                  value={formData.tanggalPenjualan}
                  onChange={(e) => handleInputChange('tanggalPenjualan', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  JATUH TEMPO
                </label>
                <input
                  type="date"
                  value={formData.jatuhTempo}
                  onChange={(e) => handleInputChange('jatuhTempo', e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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
                  required
                />
              </div>
              <div className="flex-[1.5] min-w-[180px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">CUSTOMER</label>
                <div className="flex space-x-1 relative">
                  <input
                    type="text"
                    value={formData.namaCustomer}
                    onChange={(e) => handleCustomerInputChange(e.target.value)}
                    onKeyDown={(e) => handleCustomerKeyDown(e)}
                    onFocus={() => setShowCustomerSuggestions(true)}
                    placeholder="Cari customer..."
                    className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    className="px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <User className="w-3 h-3" />
                  </button>
                  
                  {/* Customer Suggestions Dropdown */}
                  {showCustomerSuggestions && customerSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-12 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {customerSuggestions.map((customer, index) => (
                        <div
                          key={customer.kode}
                          className={`px-3 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                            index === customerActiveIndex 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-blue-50 text-gray-700'
                          }`}
                          onMouseDown={() => selectCustomer(customer)}
                          onMouseEnter={() => setCustomerActiveIndex(index)}
                        >
                          <div className="font-medium" 
                               dangerouslySetInnerHTML={{
                                 __html: highlightMatch(customer.nama, formData.namaCustomer)
                               }} 
                          />
                          <div className={`text-xs ${index === customerActiveIndex ? 'text-blue-200' : 'text-gray-500'}`}>
                            {customer.kode}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white shadow-sm border">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                <Package className="w-5 h-5 inline mr-2" />
                Daftar Barang Bonus
              </h3>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      NO
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      KODE BARANG
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAMA BARANG
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      QTY
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.kodeBarang}
                          onChange={(e) => handleBarangInputChange(index, 'kodeBarang', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Kode"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={item.namaBarang}
                            onChange={(e) => handleBarangInputChange(index, 'namaBarang', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            placeholder="Nama barang..."
                          />
                          
                          {/* Barang Suggestions Dropdown */}
                          {showBarangSuggestions && activeBarangIndex === index && barangSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {barangSuggestions.map((barang, suggestionIndex) => (
                                <div
                                  key={barang.kode}
                                  className={`px-3 py-2 cursor-pointer text-sm border-b border-gray-100 last:border-b-0 ${
                                    suggestionIndex === barangActiveIndex 
                                      ? 'bg-blue-600 text-white' 
                                      : 'hover:bg-blue-50 text-gray-700'
                                  }`}
                                  onMouseDown={() => selectBarang(barang)}
                                  onMouseEnter={() => setBarangActiveIndex(suggestionIndex)}
                                >
                                  <div className="font-medium">{barang.nama}</div>
                                  <div className={`text-xs ${suggestionIndex === barangActiveIndex ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {barang.kode}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleBarangInputChange(index, 'qty', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-center"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={formData.items.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Belum ada item barang</p>
                      </td>
                    </tr>
                  )}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Simpan Penjualan Bonus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PenjualanBonusForm;
