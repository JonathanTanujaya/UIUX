import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, CreditCard } from 'lucide-react';

const PenerimaanResi = ({ kodeDivisi }) => {
  const [formData, setFormData] = useState({
    namaCustomer: '',
    kodeCustomer: '', // auto-filled from customer selection
    noGiro: '',
    tanggalJatuhTempo: new Date().toISOString().split('T')[0],
    rekeningTujuan: '',
    jumlah: ''
  });

  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Data dummy customers untuk suggestion
  const allCustomers = [
    { kode: 'C001', nama: 'PT. Maju Jaya Sejahtera' },
    { kode: 'C002', nama: 'CV. Berkah Mandiri' },
    { kode: 'C003', nama: 'PT. Sukses Bersama' },
    { kode: 'C004', nama: 'UD. Sumber Rejeki' },
    { kode: 'C005', nama: 'PT. Cahaya Terang' },
    { kode: 'C006', nama: 'CV. Karya Utama' },
    { kode: 'C007', nama: 'PT. Bintang Timur' },
    { kode: 'C008', nama: 'UD. Harapan Jaya' }
  ];

  const [invoiceList, setInvoiceList] = useState([]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.customer-autocomplete')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Data dummy untuk invoice customer
  const dummyInvoices = [
    {
      no: 1,
      nomInvoice: 'INV-2025-001',
      tglInvoice: '2025-01-15',
      tglJatuhTempo: '2025-02-15',
      jumlahInvoice: 50000000,
      sisaInvoice: 50000000,
      coverGiro: 0,
      jumlahBayar: 0,
      jumlahDispensasi: 0,
      jumlahTotal: 0
    },
    {
      no: 2,
      nomInvoice: 'INV-2025-002',
      tglInvoice: '2025-01-20',
      tglJatuhTempo: '2025-02-20',
      jumlahInvoice: 35000000,
      sisaInvoice: 35000000,
      coverGiro: 0,
      jumlahBayar: 0,
      jumlahDispensasi: 0,
      jumlahTotal: 0
    },
    {
      no: 3,
      nomInvoice: 'INV-2025-003',
      tglInvoice: '2025-01-25',
      tglJatuhTempo: '2025-02-25',
      jumlahInvoice: 25000000,
      sisaInvoice: 25000000,
      coverGiro: 0,
      jumlahBayar: 0,
      jumlahDispensasi: 0,
      jumlahTotal: 0
    }
  ];

  const bankOptions = [
    'BCA',
    'Mandiri',
    'BNI',
    'BRI',
    'CIMB Niaga',
    'Permata',
    'Danamon',
    'OCBC NISP',
    'Bank Mega'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, namaCustomer: value }));
    
    if (value.length > 0) {
      // Filter customers berdasarkan input
      const filtered = allCustomers.filter(customer => 
        customer.nama.toLowerCase().includes(value.toLowerCase())
      );
      setCustomerSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setCustomerSuggestions([]);
    }
  };

  const handleSelectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      namaCustomer: customer.nama,
      kodeCustomer: customer.kode
    }));
    setShowSuggestions(false);
    setInvoiceList(dummyInvoices); // Load invoice untuk customer ini
  };

  const handleSearchCustomer = () => {
    // Simulasi pencarian customer manual
    if (formData.namaCustomer) {
      // Cari customer yang tepat match
      const foundCustomer = allCustomers.find(customer => 
        customer.nama.toLowerCase() === formData.namaCustomer.toLowerCase()
      );
      if (foundCustomer) {
        setFormData(prev => ({
          ...prev,
          kodeCustomer: foundCustomer.kode
        }));
        setInvoiceList(dummyInvoices);
      } else {
        alert('Customer tidak ditemukan');
      }
    }
  };

  const handleGenerate = () => {
    if (!formData.namaCustomer || !formData.jumlah) {
      alert('Mohon lengkapi Nama Customer dan Jumlah');
      return;
    }

    // Auto distribute jumlah ke invoice
    distributePayment();
  };

  const distributePayment = () => {
    let remainingAmount = parseFloat(formData.jumlah) || 0;
    const updated = invoiceList.map(inv => {
      if (remainingAmount > 0) {
        const payment = Math.min(remainingAmount, inv.sisaInvoice);
        remainingAmount -= payment;
        return {
          ...inv,
          coverGiro: payment,
          jumlahBayar: payment,
          jumlahTotal: payment
        };
      }
      return inv;
    });
    setInvoiceList(updated);
  };

  const handleInvoiceChange = (index, field, value) => {
    const updated = [...invoiceList];
    updated[index][field] = parseFloat(value) || 0;
    
    // Recalculate total
    if (field === 'jumlahBayar' || field === 'jumlahDispensasi') {
      updated[index].jumlahTotal = updated[index].jumlahBayar - updated[index].jumlahDispensasi;
    }
    
    setInvoiceList(updated);
  };

  const handleSave = () => {
    // Validasi data wajib
    if (!formData.namaCustomer || !formData.jumlah) {
      alert('Mohon lengkapi Nama Customer dan Jumlah');
      return;
    }

    const totalBayar = invoiceList.reduce((sum, inv) => sum + inv.jumlahTotal, 0);
    
    const data = {
      kodeCustomer: formData.kodeCustomer,
      namaCustomer: formData.namaCustomer,
      noGiro: formData.noGiro,
      tanggalJatuhTempo: formData.tanggalJatuhTempo,
      rekeningTujuan: formData.rekeningTujuan,
      jumlah: parseFloat(formData.jumlah),
      invoices: invoiceList.filter(inv => inv.jumlahTotal > 0),
      totalBayar,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    
    console.log('Data Penerimaan Resi:', data);
    alert(`Penerimaan resi berhasil disimpan!\nCustomer: ${formData.namaCustomer}\nNo. Giro: ${formData.noGiro}\nTotal: ${formatCurrency(totalBayar)}`);
  };

  const handleClose = () => {
    if (confirm('Apakah Anda yakin ingin menutup halaman ini?')) {
      window.history.back();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTotalInvoice = () => {
    return invoiceList.reduce((sum, inv) => sum + inv.jumlahInvoice, 0);
  };

  const getTotalBayar = () => {
    return invoiceList.reduce((sum, inv) => sum + inv.jumlahTotal, 0);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="w-full max-w-full mx-auto px-4">
        
        {/* Header Form - Responsive Full Width */}
        <div className="w-full bg-white shadow-sm border border-l-4 border-green-500 p-4 mb-3">
          {/* Form Input - Horizontal 1 Baris dari Kiri ke Kanan */}
          <div className="flex flex-wrap gap-4 items-end mb-4">
            {/* Nama Customer dengan Autocomplete */}
            <div className="relative customer-autocomplete flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Customer</label>
              <input
                type="text"
                name="namaCustomer"
                value={formData.namaCustomer}
                onChange={handleCustomerInputChange}
                placeholder="Nama customer..."
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                autoComplete="off"
              />
              
              {/* Suggestion Dropdown */}
              {showSuggestions && customerSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {customerSuggestions.map((customer, index) => (
                    <div
                      key={customer.kode}
                      onClick={() => handleSelectCustomer(customer)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm text-gray-900">{customer.nama}</div>
                      <div className="text-xs text-gray-500">{customer.kode}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* No Giro / Cheque */}
            <div className="min-w-[140px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">No Giro / Cheque</label>
              <input
                type="text"
                name="noGiro"
                value={formData.noGiro}
                onChange={handleInputChange}
                placeholder="Nomor giro"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Rekening Tujuan */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rekening Tujuan</label>
              <input
                type="text"
                name="rekeningTujuan"
                value={formData.rekeningTujuan}
                onChange={handleInputChange}
                placeholder="No Rekening"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
              <input
                type="date"
                name="tanggalJatuhTempo"
                value={formData.tanggalJatuhTempo}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Jumlah */}
            <div className="min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
              <input
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          {/* Customer Info & Generate Button */}
          {formData.kodeCustomer && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <strong>Customer:</strong> {formData.namaCustomer} <span className="text-gray-600">({formData.kodeCustomer})</span>
              </p>
              <div className="mt-3 flex justify-center">
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  Generate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Table - Shows when customer is selected */}
      <div className="w-full max-w-full mx-auto px-4">
        {formData.kodeCustomer && (
          <div className="bg-white shadow-sm border">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Daftar Invoice Customer</h3>
              <p className="text-xs text-gray-600 mt-1">Pilih invoice yang akan dibayar dengan warkat ini</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">No</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom Invoice</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Tgl Invoice</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Tgl Jatuh Tempo</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Invoice</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sisa Invoice</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cover Giro</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Jumlah Bayar</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Jumlah Dispensasi</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceList.map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-center text-sm text-gray-900">{invoice.no}</td>
                      <td className="px-3 py-2 text-sm font-mono text-blue-600">{invoice.nomInvoice}</td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {formatDate(invoice.tglInvoice)}
                      </td>
                      <td className="px-3 py-2 text-center text-sm text-gray-900">
                        {formatDate(invoice.tglJatuhTempo)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(invoice.jumlahInvoice)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(invoice.sisaInvoice)}
                      </td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right font-medium">
                        {formatCurrency(invoice.coverGiro)}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={invoice.jumlahBayar}
                          onChange={(e) => handleInvoiceChange(index, 'jumlahBayar', e.target.value)}
                          max={invoice.sisaInvoice}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={invoice.jumlahDispensasi}
                          onChange={(e) => handleInvoiceChange(index, 'jumlahDispensasi', e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm text-green-600 text-right font-bold">
                        {formatCurrency(invoice.jumlahTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Action Buttons */}
            <div className="p-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Total Pembayaran: {formatCurrency(getTotalBayar())}
                </span>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Simpan Penerimaan Resi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State when no customer selected */}
        {!formData.kodeCustomer && (
          <div className="bg-white shadow-sm border p-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pilih Customer</h3>
            <p className="text-gray-600">Silahkan pilih customer untuk melihat daftar invoice</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenerimaanResi;
