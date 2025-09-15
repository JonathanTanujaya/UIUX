import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function InvoiceForm({ invoice, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    NoInvoice: '',
    TglFaktur: '',
    KodeCust: '',
    KodeSales: '',
    Tipe: '',
    JatuhTempo: '',
    Total: '',
    Disc: '',
    Pajak: '',
    GrandTotal: '',
    SisaInvoice: '',
    Ket: '',
    Status: '',
    username: '',
    TT: '',
    // For InvoiceDetail
    KodeBarang: '',
    QtySupply: '',
    HargaJual: '',
    Diskon1: '',
    Diskon2: '',
    HargaNett: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (invoice) {
        // Update existing invoice
        await axios.put(`${API_URL}/invoices/${invoice.KodeDivisi}/${invoice.NoInvoice}`, formData);
      } else {
        // Create new invoice
        await axios.post(`${API_URL}/invoices`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{invoice ? 'Edit' : 'Tambah'} Invoice</h2>
      <div>
        <label>Kode Divisi:</label>
        <input
          type="text"
          name="KodeDivisi"
          value={formData.KodeDivisi}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>No Invoice:</label>
        <input
          type="text"
          name="NoInvoice"
          value={formData.NoInvoice}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tgl Faktur:</label>
        <input type="date" name="TglFaktur" value={formData.TglFaktur} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Customer:</label>
        <input type="text" name="KodeCust" value={formData.KodeCust} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Sales:</label>
        <input type="text" name="KodeSales" value={formData.KodeSales} onChange={handleChange} />
      </div>
      <div>
        <label>Tipe:</label>
        <input type="text" name="Tipe" value={formData.Tipe} onChange={handleChange} />
      </div>
      <div>
        <label>Jatuh Tempo:</label>
        <input type="date" name="JatuhTempo" value={formData.JatuhTempo} onChange={handleChange} />
      </div>
      <div>
        <label>Total:</label>
        <input type="number" name="Total" value={formData.Total} onChange={handleChange} />
      </div>
      <div>
        <label>Disc:</label>
        <input type="number" name="Disc" value={formData.Disc} onChange={handleChange} />
      </div>
      <div>
        <label>Pajak:</label>
        <input type="number" name="Pajak" value={formData.Pajak} onChange={handleChange} />
      </div>
      <div>
        <label>Grand Total:</label>
        <input
          type="number"
          name="GrandTotal"
          value={formData.GrandTotal}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sisa Invoice:</label>
        <input
          type="number"
          name="SisaInvoice"
          value={formData.SisaInvoice}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Keterangan:</label>
        <input type="text" name="Ket" value={formData.Ket} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="Status" value={formData.Status} onChange={handleChange} />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
      </div>
      <div>
        <label>TT:</label>
        <input type="text" name="TT" value={formData.TT} onChange={handleChange} />
      </div>

      <h3>Detail Invoice</h3>
      <div>
        <label>Kode Barang:</label>
        <input type="text" name="KodeBarang" value={formData.KodeBarang} onChange={handleChange} />
      </div>
      <div>
        <label>Qty Supply:</label>
        <input type="number" name="QtySupply" value={formData.QtySupply} onChange={handleChange} />
      </div>
      <div>
        <label>Harga Jual:</label>
        <input type="number" name="HargaJual" value={formData.HargaJual} onChange={handleChange} />
      </div>
      <div>
        <label>Diskon 1:</label>
        <input type="number" name="Diskon1" value={formData.Diskon1} onChange={handleChange} />
      </div>
      <div>
        <label>Diskon 2:</label>
        <input type="number" name="Diskon2" value={formData.Diskon2} onChange={handleChange} />
      </div>
      <div>
        <label>Harga Nett:</label>
        <input type="number" name="HargaNett" value={formData.HargaNett} onChange={handleChange} />
      </div>

      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default InvoiceForm;
