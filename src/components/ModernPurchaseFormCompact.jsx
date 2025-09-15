import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Calendar, FileText, Building, DollarSign, Trash2 } from 'lucide-react';
import { useSuppliers, useMasterBarang, useCreatePurchase } from '../hooks/useApi';

const ModernPurchaseFormCompact = () => {
  const [formData, setFormData] = useState({
    tglTerima: new Date().toISOString().split('T')[0], // Default hari ini
    tglJatuhTempo: new Date().toISOString().split('T')[0], // Default hari ini  
    noFaktur: '',
    supplier: '',
    catatan: '',
    ppn: '11',
    diskonGlobal: '0',
    items: []
  });

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showBarangModal, setShowBarangModal] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete states
  const [supplierInput, setSupplierInput] = useState('');
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [supplierActiveIndex, setSupplierActiveIndex] = useState(-1);
  
  const [barangSuggestions, setBarangSuggestions] = useState([]);
  const [showBarangSuggestions, setShowBarangSuggestions] = useState(false);
  const [barangActiveIndex, setBarangActiveIndex] = useState(-1);
  const [activeBarangIndex, setActiveBarangIndex] = useState(-1);

  // State untuk form input barang baru
  const [newItemForm, setNewItemForm] = useState({
    kode: '',
    qty: '1',
    d1: '0',
    selectedBarang: null
  });
  const [showNewItemSuggestions, setShowNewItemSuggestions] = useState(false);
  const [newItemSuggestions, setNewItemSuggestions] = useState([]);
  const [newItemActiveIndex, setNewItemActiveIndex] = useState(0);

  // Fetch data from APIs
  const { data: suppliersData, loading: loadingSuppliers, error: errorSuppliers } = useSuppliers();
  const { data: barangData, loading: loadingBarang, error: errorBarang } = useMasterBarang();

  // Initialize supplier input when supplier is selected
  useEffect(() => {
    if (formData.supplier && suppliersData?.data) {
      const selectedSupplier = suppliersData.data.find(s => s.id === formData.supplier);
      if (selectedSupplier && supplierInput !== selectedSupplier.nama) {
        setSupplierInput(selectedSupplier.nama);
      }
    } else if (!formData.supplier) {
      setSupplierInput('');
    }
  }, [formData.supplier, suppliersData, supplierInput]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Supplier autocomplete handlers
  const handleSupplierInputChange = (value) => {
    setSupplierInput(value);
    
    if (value.length > 0 && suppliersData?.data) {
      const filtered = suppliersData.data
        .filter(s =>
          s.nama.toLowerCase().includes(value.toLowerCase()) ||
          s.kodeSupplier.toLowerCase().includes(value.toLowerCase())
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
      setSupplierActiveIndex(0);
    } else {
      setShowSupplierSuggestions(false);
      setSupplierActiveIndex(-1);
      setFormData(prev => ({ ...prev, supplier: '' }));
    }
  };

  const selectSupplier = (supplier) => {
    setFormData(prev => ({
      ...prev,
      supplier: supplier.id
    }));
    setSupplierInput(supplier.nama);
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

  // Barang autocomplete handlers
  const handleBarangInputChange = (index, field, value) => {
    handleItemChange(index, field, value);
    
    if ((field === 'nama' || field === 'kode') && value.length > 0 && barangData?.data) {
      const filtered = barangData.data
        .filter(b => {
          if (field === 'nama') {
            return (b.nama && b.nama.toLowerCase().includes(value.toLowerCase())) ||
                   (b.kode && b.kode.toLowerCase().includes(value.toLowerCase()));
          } else { // kode
            return (b.kode && b.kode.toLowerCase().includes(value.toLowerCase())) ||
                   (b.nama && b.nama.toLowerCase().includes(value.toLowerCase()));
          }
        })
        .sort((a, b) => {
          const searchField = field === 'nama' ? a.nama : a.kode;
          const aStartsWith = searchField && searchField.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWithField = field === 'nama' ? b.nama : b.kode;
          const bStartsWith = bStartsWithField && bStartsWithField.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });
      
      setBarangSuggestions(filtered);
      setShowBarangSuggestions(filtered.length > 0);
      setBarangActiveIndex(0);
      setActiveBarangIndex(index);
    } else if (field === 'nama' || field === 'kode') {
      setShowBarangSuggestions(false);
      setBarangActiveIndex(-1);
    }
  };

  const selectBarangFromSuggestion = (barang) => {
    if (activeBarangIndex !== -1) {
      handleItemChange(activeBarangIndex, 'kode', barang.kode || '');
      handleItemChange(activeBarangIndex, 'nama', barang.nama || '');
      handleItemChange(activeBarangIndex, 'satuan', barang.satuan || 'PCS');
    }
    setShowBarangSuggestions(false);
    setBarangActiveIndex(-1);
    setActiveBarangIndex(-1);
  };

  const handleBarangKeyDown = (e, index) => {
    if (activeBarangIndex === index && showBarangSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setBarangActiveIndex(prev => 
          prev < barangSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setBarangActiveIndex(prev => 
          prev > 0 ? prev - 1 : barangSuggestions.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (barangActiveIndex >= 0 && barangSuggestions[barangActiveIndex]) {
          e.preventDefault();
          selectBarangFromSuggestion(barangSuggestions[barangActiveIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowBarangSuggestions(false);
        setBarangActiveIndex(-1);
        setActiveBarangIndex(-1);
      }
    }
  };

  // Handlers untuk form input barang baru
  const handleNewItemInputChange = (field, value) => {
    setNewItemForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Autocomplete untuk kode barang
    if (field === 'kode' && value.length > 0 && barangData?.data) {
      const filtered = barangData.data
        .filter(b => {
          return (b.kode && b.kode.toLowerCase().includes(value.toLowerCase())) ||
                 (b.nama && b.nama.toLowerCase().includes(value.toLowerCase()));
        })
        .sort((a, b) => {
          const aStartsWith = a.kode && a.kode.toLowerCase().startsWith(value.toLowerCase());
          const bStartsWith = b.kode && b.kode.toLowerCase().startsWith(value.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });
      
      setNewItemSuggestions(filtered);
      setShowNewItemSuggestions(filtered.length > 0);
      setNewItemActiveIndex(0);
    } else if (field === 'kode' && value.length === 0) {
      setShowNewItemSuggestions(false);
      setNewItemForm(prev => ({ ...prev, selectedBarang: null }));
    }
  };

  const selectNewItemBarang = (barang) => {
    setNewItemForm(prev => ({
      ...prev,
      kode: barang.kode || '',
      selectedBarang: barang
    }));
    setShowNewItemSuggestions(false);
  };

  const handleNewItemKeyDown = (e) => {
    if (!showNewItemSuggestions || newItemSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setNewItemActiveIndex(prev => 
          prev < newItemSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setNewItemActiveIndex(prev => 
          prev > 0 ? prev - 1 : newItemSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (newItemSuggestions[newItemActiveIndex]) {
          selectNewItemBarang(newItemSuggestions[newItemActiveIndex]);
        }
        break;
      case 'Escape':
        setShowNewItemSuggestions(false);
        break;
    }
  };

  const addNewItemToTable = () => {
    if (!newItemForm.selectedBarang) return;

    const barang = newItemForm.selectedBarang;
    const qty = parseFloat(newItemForm.qty) || 0;
    const d1 = parseFloat(newItemForm.d1) || 0;
    const harga = parseFloat(barang.harga) || 0;
    
    const afterD1 = harga * (1 - d1/100);
    const hargaNet = afterD1; // Assuming d2 is 0 for this simplified form
    const subtotal = qty * hargaNet;

    const newItem = {
      id: Date.now(),
      kode: barang.kode || '',
      nama: barang.nama || '',
      qty: qty,
      satuan: barang.satuan || 'PCS',
      harga: harga,
      d1: d1,
      d2: 0, // Default 0 untuk form sederhana
      hargaNet: hargaNet,
      subtotal: subtotal
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // Reset form
    setNewItemForm({
      kode: '',
      qty: '1',
      d1: '0',
      selectedBarang: null
    });
    setShowNewItemSuggestions(false);
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };

      // Auto calculate when price, qty, or discounts change
      if (['qty', 'harga', 'd1', 'd2'].includes(field)) {
        const item = newItems[index];
        const qty = parseFloat(item.qty) || 0;
        const harga = parseFloat(item.harga) || 0;
        const d1 = parseFloat(item.d1) || 0;
        const d2 = parseFloat(item.d2) || 0;
        
        const afterD1 = harga * (1 - d1/100);
        const hargaNet = afterD1 * (1 - d2/100);
        const subtotal = qty * hargaNet;

        newItems[index] = {
          ...newItems[index],
          hargaNet: hargaNet,
          subtotal: subtotal
        };
      }

      return {
        ...prev,
        items: newItems
      };
    });
  };

  const selectBarang = (barang) => {
    if (selectedItemIndex !== null) {
      handleItemChange(selectedItemIndex, 'kode', barang.kode || '');
      handleItemChange(selectedItemIndex, 'nama', barang.nama || '');
      handleItemChange(selectedItemIndex, 'satuan', barang.satuan || 'PCS');
      setSelectedItemIndex(null);
    }
    setShowBarangModal(false);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      kode: '',
      nama: '',
      qty: 1,
      satuan: 'PCS',
      harga: 0,
      d1: 0,
      d2: 0,
      hargaNet: 0,
      subtotal: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const openBarangModal = (index) => {
    setSelectedItemIndex(index);
    setShowBarangModal(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepare data for backend
      const purchaseData = {
        tgl_terima: formData.tglTerima,
        tgl_jatuh_tempo: formData.tglJatuhTempo,
        no_faktur: formData.noFaktur,
        supplier_id: formData.supplier,
        catatan: formData.catatan,
        ppn: parseFloat(formData.ppn),
        diskon_global: parseFloat(formData.diskonGlobal),
        items: formData.items.map(item => ({
          kode_barang: item.kode,
          nama_barang: item.nama,
          qty: parseFloat(item.qty),
          satuan: item.satuan,
          harga: parseFloat(item.harga),
          d1: parseFloat(item.d1),
          d2: parseFloat(item.d2),
          harga_net: item.hargaNet,
          subtotal: item.subtotal
        }))
      };

      await createPurchase.mutateAsync(purchaseData);
      
      alert('Transaksi berhasil disimpan!');
      // Reset form
      setFormData({
        tglTerima: '',
        tglJatuhTempo: '',
          noFaktur: '',
          supplier: '',
          catatan: '',
          ppn: '11',
          diskonGlobal: '0',
          items: []
        });
    } catch (error) {
      console.error('Error submitting purchase:', error);
      alert('Gagal menyimpan transaksi: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
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
    const diskon = parseFloat(formData.diskonGlobal) || 0;
    const dpp = subtotal - diskon;
    const ppn = dpp * (parseFloat(formData.ppn) / 100);
    const total = dpp + ppn;
    
    return { subtotal, diskon, dpp, ppn, total };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Form - Redesigned 2 Rows */}
        <div className="bg-white shadow-sm border p-4">
          {/* Baris 1: TGL TERIMA, TGL JATUH TEMPO, NO FAKTUR, SUPPLIER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TGL TERIMA</label>
              <input
                type="date"
                value={formData.tglTerima}
                onChange={(e) => handleInputChange('tglTerima', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TGL JATUH TEMPO</label>
              <input
                type="date"
                value={formData.tglJatuhTempo}
                onChange={(e) => handleInputChange('tglJatuhTempo', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NO FAKTUR</label>
              <input
                type="text"
                value={formData.noFaktur}
                onChange={(e) => handleInputChange('noFaktur', e.target.value)}
                placeholder="Masukkan nomor faktur"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SUPPLIER</label>
              <div className="flex space-x-2 relative">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={supplierInput}
                    onChange={(e) => handleSupplierInputChange(e.target.value)}
                    onKeyDown={handleSupplierKeyDown}
                    placeholder={loadingSuppliers ? 'Loading suppliers...' : 'Ketik nama atau kode supplier...'}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingSuppliers}
                    autoComplete="off"
                  />
                  
                  {/* Supplier Suggestions Dropdown */}
                  {showSupplierSuggestions && supplierSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {supplierSuggestions.map((supplier, index) => (
                        <div
                          key={supplier.id}
                          className={`px-3 py-2 cursor-pointer text-sm ${
                            index === supplierActiveIndex
                              ? 'bg-blue-100 text-blue-900'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => selectSupplier(supplier)}
                        >
                          <div className="font-medium">{supplier.nama}</div>
                          <div className="text-gray-500 text-xs">Kode: {supplier.kodeSupplier}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowSupplierModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  disabled={loadingSuppliers}
                  title="Cari Supplier"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {errorSuppliers && (
                <p className="mt-1 text-sm text-red-600">Error loading suppliers: {errorSuppliers}</p>
              )}
            </div>
          </div>

          {/* Baris 2: KODE BARANG, NAMA BARANG, QTY, DISC1%, CATATAN, TOMBOL ADD */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Input Kode Barang dengan Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">KODE BARANG</label>
              <input
                type="text"
                value={newItemForm.kode}
                onChange={(e) => handleNewItemInputChange('kode', e.target.value)}
                onKeyDown={handleNewItemKeyDown}
                onFocus={() => setShowNewItemSuggestions(true)}
                onBlur={() => setTimeout(() => setShowNewItemSuggestions(false), 200)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan kode barang"
                autoComplete="off"
              />
              
              {/* Dropdown Suggestions untuk New Item */}
              {showNewItemSuggestions && newItemSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {newItemSuggestions.map((barang, suggestionIndex) => (
                    <div
                      key={suggestionIndex}
                      className={`px-3 py-2 cursor-pointer text-sm ${
                        suggestionIndex === newItemActiveIndex
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => selectNewItemBarang(barang)}
                    >
                      <div className="font-medium">{barang.kode || ''}</div>
                      <div className="text-gray-500 text-xs truncate">{barang.nama || ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display Nama Barang - Auto dari kode barang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NAMA BARANG</label>
              <div className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                {newItemForm.selectedBarang?.nama || 'Pilih kode barang'}
              </div>
            </div>

            {/* Input Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QTY</label>
              <input
                type="number"
                value={newItemForm.qty}
                onChange={(e) => handleNewItemInputChange('qty', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            {/* Input Disc1% */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DISC1 %</label>
              <input
                type="number"
                value={newItemForm.d1}
                onChange={(e) => handleNewItemInputChange('d1', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CATATAN</label>
              <input
                type="text"
                value={formData.catatan}
                onChange={(e) => handleInputChange('catatan', e.target.value)}
                placeholder="Catatan..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tombol Add */}
            <div className="flex items-end">
              <button 
                onClick={addNewItemToTable}
                disabled={!newItemForm.kode || !newItemForm.selectedBarang}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>



        {/* Main Content - Table dan Summary dalam satu row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Items Table - 3/4 width */}
          <div className="lg:col-span-3 bg-white shadow-sm border">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Daftar Barang</h3>
              <p className="text-sm text-gray-600 mt-1">Daftar barang yang akan dibeli dalam transaksi ini</p>
            </div>
            
            {/* Compact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">D1%</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">D2%</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-3 py-2 text-sm font-mono text-gray-900">{item.kode}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 max-w-48 truncate">{item.nama}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.qty}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{item.satuan}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.harga)}</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.d1}%</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right">{item.d2}%</td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right font-medium">{formatCurrency(item.subtotal)}</td>
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
                      <td colSpan="10" className="px-3 py-8 text-center text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Belum ada item. Gunakan form di atas untuk menambah barang.</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h3>
              
              {/* PPN & Diskon */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PPN %</label>
                  <input
                    type="number"
                    value={formData.ppn}
                    onChange={(e) => handleInputChange('ppn', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diskon Global</label>
                  <input
                    type="number"
                    value={formData.diskonGlobal}
                    onChange={(e) => handleInputChange('diskonGlobal', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                  <span className="text-gray-600">Diskon:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(totals.diskon)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">DPP:</span>
                  <span className="font-medium">{formatCurrency(totals.dpp)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">PPN ({formData.ppn}%):</span>
                  <span className="font-medium">{formatCurrency(totals.ppn)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || formData.items.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                  Simpan Draft
                </button>
                <button 
                  onClick={() => setFormData({
                    tglTerima: '',
                    tglJatuhTempo: '',
                    noFaktur: '',
                    supplier: '',
                    catatan: '',
                    ppn: '11',
                    diskonGlobal: '0',
                    items: []
                  })}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barang Selection Modal */}
      {showBarangModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pilih Barang</h3>
              <button
                onClick={() => setShowBarangModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {loadingBarang && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading barang...</p>
              </div>
            )}

            {errorBarang && (
              <div className="text-center py-8">
                <p className="text-red-600">Error: {errorBarang}</p>
              </div>
            )}

            {barangData?.data && (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Kode</th>
                      <th className="px-3 py-2 text-left">Nama Barang</th>
                      <th className="px-3 py-2 text-left">Satuan</th>
                      <th className="px-3 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barangData.data.map((barang, index) => (
                      <tr key={index} className="hover:bg-gray-50 border-b">
                        <td className="px-3 py-2 font-mono">{barang.kode || ''}</td>
                        <td className="px-3 py-2">{barang.nama || ''}</td>
                        <td className="px-3 py-2">{barang.satuan || ''}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => selectBarang(barang)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Pilih
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {barangData?.data?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada data barang</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernPurchaseFormCompact;
