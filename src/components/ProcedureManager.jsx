import React, { useState } from 'react';

const ProcedureManager = () => {
  const [activeProcedure, setActiveProcedure] = useState('invoice');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    kode_divisi: '',
    no_invoice: '',
    items: [{ kode_barang: '', qty: '', harga: '' }]
  });

  // Part Penerimaan Form State
  const [partPenerimaanForm, setPartPenerimaanForm] = useState({
    kode_divisi: '',
    no_penerimaan: '',
    kode_supplier: '',
    items: [{ kode_barang: '', qty: '', harga: '' }]
  });

  // Retur Sales Form State
  const [returSalesForm, setReturSalesForm] = useState({
    kode_divisi: '',
    no_retur: '',
    no_invoice: '',
    items: [{ kode_barang: '', qty: '', alasan: '' }]
  });

  // Cancel Invoice Form State
  const [cancelInvoiceForm, setCancelInvoiceForm] = useState({
    kode_divisi: '',
    no_invoice: ''
  });

  // Stock Opname Form State
  const [stokOpnameForm, setStokOpnameForm] = useState({
    kode_divisi: '',
    kode_barang: '',
    qty_fisik: ''
  });

  // Generate Number Form State
  const [generateNumberForm, setGenerateNumberForm] = useState({
    kode_trans: '',
    kode_divisi: ''
  });

  const procedures = [
    { id: 'invoice', label: 'Create Invoice' },
    { id: 'part-penerimaan', label: 'Part Penerimaan' },
    { id: 'retur-sales', label: 'Retur Sales' },
    { id: 'cancel-invoice', label: 'Cancel Invoice' },
    { id: 'stok-opname', label: 'Stock Opname' },
    { id: 'generate-number', label: 'Generate Number' },
  ];

  const executeInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/procedures/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceForm)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const executePartPenerimaan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/procedures/part-penerimaan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partPenerimaanForm)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const executeReturSales = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/procedures/retur-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returSalesForm)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const executeCancelInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/procedures/batalkan-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelInvoiceForm)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const executeStokOpname = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/procedures/stok-opname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stokOpnameForm)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const executeGenerateNumber = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/procedures/generate-nomor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateNumberForm)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const addItemToInvoice = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { kode_barang: '', qty: '', harga: '' }]
    });
  };

  const removeItemFromInvoice = (index) => {
    const newItems = invoiceForm.items.filter((_, i) => i !== index);
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const updateInvoiceItem = (index, field, value) => {
    const newItems = [...invoiceForm.items];
    newItems[index][field] = value;
    setInvoiceForm({ ...invoiceForm, items: newItems });
  };

  const renderInvoiceForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Kode Divisi</label>
          <input
            type="text"
            value={invoiceForm.kode_divisi}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, kode_divisi: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">No Invoice</label>
          <input
            type="text"
            value={invoiceForm.no_invoice}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, no_invoice: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Items</label>
          <button
            type="button"
            onClick={addItemToInvoice}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Add Item
          </button>
        </div>
        {invoiceForm.items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              placeholder="Kode Barang"
              value={item.kode_barang}
              onChange={(e) => updateInvoiceItem(index, 'kode_barang', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.qty}
              onChange={(e) => updateInvoiceItem(index, 'qty', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="number"
              placeholder="Harga"
              value={item.harga}
              onChange={(e) => updateInvoiceItem(index, 'harga', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <button
              type="button"
              onClick={() => removeItemFromInvoice(index)}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={executeInvoice}
        disabled={loading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Processing...' : 'Create Invoice'}
      </button>
    </div>
  );

  const renderStokOpnameForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Kode Divisi</label>
          <input
            type="text"
            value={stokOpnameForm.kode_divisi}
            onChange={(e) => setStokOpnameForm({ ...stokOpnameForm, kode_divisi: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kode Barang</label>
          <input
            type="text"
            value={stokOpnameForm.kode_barang}
            onChange={(e) => setStokOpnameForm({ ...stokOpnameForm, kode_barang: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Qty Fisik</label>
          <input
            type="number"
            value={stokOpnameForm.qty_fisik}
            onChange={(e) => setStokOpnameForm({ ...stokOpnameForm, qty_fisik: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <button
        onClick={executeStokOpname}
        disabled={loading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Processing...' : 'Execute Stock Opname'}
      </button>
    </div>
  );

  const renderActiveForm = () => {
    switch (activeProcedure) {
      case 'invoice':
        return renderInvoiceForm();
      case 'stok-opname':
        return renderStokOpnameForm();
      // Add other forms here
      default:
        return <div>Form for {activeProcedure} not implemented yet</div>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Procedure Manager</h1>
        
        {/* Procedure Selection Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {procedures.map((procedure) => (
              <button
                key={procedure.id}
                onClick={() => setActiveProcedure(procedure.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeProcedure === procedure.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {procedure.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Procedure Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {procedures.find(p => p.id === activeProcedure)?.label}
        </h2>
        {renderActiveForm()}
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Result</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProcedureManager;
