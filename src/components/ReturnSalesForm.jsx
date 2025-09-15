import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function ReturnSalesForm({ returnSales, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    NoRetur: '',
    TglRetur: '',
    KodeCust: '',
    Total: '',
    SisaRetur: '',
    Keterangan: '',
    Status: '',
    TT: '',
    // For ReturnSalesDetail
    NoInvoice: '',
    KodeBarang: '',
    QtyRetur: '',
    HargaNett: '',
  });

  useEffect(() => {
    if (returnSales) {
      setFormData(returnSales);
    }
  }, [returnSales]);

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
      if (returnSales) {
        // Update existing return sales
        await axios.put(
          `${API_URL}/return-sales/${returnSales.KodeDivisi}/${returnSales.NoRetur}`,
          formData
        );
      } else {
        // Create new return sales
        await axios.post(`${API_URL}/return-sales`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving return sales:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{returnSales ? 'Edit' : 'Tambah'} Retur Penjualan</h2>
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
        <label>No Retur:</label>
        <input
          type="text"
          name="NoRetur"
          value={formData.NoRetur}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tgl Retur:</label>
        <input type="date" name="TglRetur" value={formData.TglRetur} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Customer:</label>
        <input type="text" name="KodeCust" value={formData.KodeCust} onChange={handleChange} />
      </div>
      <div>
        <label>Total:</label>
        <input type="number" name="Total" value={formData.Total} onChange={handleChange} />
      </div>
      <div>
        <label>Sisa Retur:</label>
        <input type="number" name="SisaRetur" value={formData.SisaRetur} onChange={handleChange} />
      </div>
      <div>
        <label>Keterangan:</label>
        <input type="text" name="Keterangan" value={formData.Keterangan} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="Status" value={formData.Status} onChange={handleChange} />
      </div>
      <div>
        <label>TT:</label>
        <input type="text" name="TT" value={formData.TT} onChange={handleChange} />
      </div>

      <h3>Detail Retur Penjualan</h3>
      <div>
        <label>No Invoice:</label>
        <input type="text" name="NoInvoice" value={formData.NoInvoice} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Barang:</label>
        <input type="text" name="KodeBarang" value={formData.KodeBarang} onChange={handleChange} />
      </div>
      <div>
        <label>Qty Retur:</label>
        <input type="number" name="QtyRetur" value={formData.QtyRetur} onChange={handleChange} />
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

export default ReturnSalesForm;
