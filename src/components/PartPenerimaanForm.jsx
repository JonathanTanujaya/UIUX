import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function PartPenerimaanForm({ penerimaan, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    NoPenerimaan: '',
    TglPenerimaan: '',
    KodeValas: '',
    Kurs: '',
    KodeSupplier: '',
    JatuhTempo: '',
    NoFaktur: '',
    Total: '',
    Discount: '',
    Pajak: '',
    GrandTotal: '',
    Status: '',
    // For PartPenerimaanDetail
    KodeBarang: '',
    QtySupply: '',
    Harga: '',
    Diskon1: '',
    Diskon2: '',
    HargaNett: '',
  });

  useEffect(() => {
    if (penerimaan) {
      setFormData(penerimaan);
    }
  }, [penerimaan]);

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
      if (penerimaan) {
        // Update existing penerimaan
        await axios.put(
          `${API_URL}/part-penerimaan/${penerimaan.KodeDivisi}/${penerimaan.NoPenerimaan}`,
          formData
        );
      } else {
        // Create new penerimaan
        await axios.post(`${API_URL}/part-penerimaan`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving penerimaan:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{penerimaan ? 'Edit' : 'Tambah'} Penerimaan Barang</h2>
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
        <label>No Penerimaan:</label>
        <input
          type="text"
          name="NoPenerimaan"
          value={formData.NoPenerimaan}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tgl Penerimaan:</label>
        <input
          type="date"
          name="TglPenerimaan"
          value={formData.TglPenerimaan}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Kode Valas:</label>
        <input type="text" name="KodeValas" value={formData.KodeValas} onChange={handleChange} />
      </div>
      <div>
        <label>Kurs:</label>
        <input type="number" name="Kurs" value={formData.Kurs} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Supplier:</label>
        <input
          type="text"
          name="KodeSupplier"
          value={formData.KodeSupplier}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Jatuh Tempo:</label>
        <input type="date" name="JatuhTempo" value={formData.JatuhTempo} onChange={handleChange} />
      </div>
      <div>
        <label>No Faktur:</label>
        <input type="text" name="NoFaktur" value={formData.NoFaktur} onChange={handleChange} />
      </div>
      <div>
        <label>Total:</label>
        <input type="number" name="Total" value={formData.Total} onChange={handleChange} />
      </div>
      <div>
        <label>Discount:</label>
        <input type="number" name="Discount" value={formData.Discount} onChange={handleChange} />
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
        <label>Status:</label>
        <input type="text" name="Status" value={formData.Status} onChange={handleChange} />
      </div>

      <h3>Detail Penerimaan</h3>
      <div>
        <label>Kode Barang:</label>
        <input type="text" name="KodeBarang" value={formData.KodeBarang} onChange={handleChange} />
      </div>
      <div>
        <label>Qty Supply:</label>
        <input type="number" name="QtySupply" value={formData.QtySupply} onChange={handleChange} />
      </div>
      <div>
        <label>Harga:</label>
        <input type="number" name="Harga" value={formData.Harga} onChange={handleChange} />
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

export default PartPenerimaanForm;
