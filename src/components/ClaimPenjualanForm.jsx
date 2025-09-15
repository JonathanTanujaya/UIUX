import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function ClaimPenjualanForm({ claim, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    NoClaim: '',
    TglClaim: '',
    KodeCust: '',
    Keterangan: '',
    Status: '',
    // For ClaimPenjualanDetail
    NoInvoice: '',
    KodeBarang: '',
    QtyClaim: '',
    StatusDetail: '',
  });

  useEffect(() => {
    if (claim) {
      setFormData(claim);
    }
  }, [claim]);

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
      if (claim) {
        // Update existing claim
        await axios.put(`${API_URL}/claims/${claim.KodeDivisi}/${claim.NoClaim}`, formData);
      } else {
        // Create new claim
        await axios.post(`${API_URL}/claims`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving claim:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{claim ? 'Edit' : 'Tambah'} Klaim Penjualan</h2>
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
        <label>No Klaim:</label>
        <input
          type="text"
          name="NoClaim"
          value={formData.NoClaim}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tgl Klaim:</label>
        <input type="date" name="TglClaim" value={formData.TglClaim} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Customer:</label>
        <input type="text" name="KodeCust" value={formData.KodeCust} onChange={handleChange} />
      </div>
      <div>
        <label>Keterangan:</label>
        <input type="text" name="Keterangan" value={formData.Keterangan} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="Status" value={formData.Status} onChange={handleChange} />
      </div>

      <h3>Detail Klaim Penjualan</h3>
      <div>
        <label>No Invoice:</label>
        <input type="text" name="NoInvoice" value={formData.NoInvoice} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Barang:</label>
        <input type="text" name="KodeBarang" value={formData.KodeBarang} onChange={handleChange} />
      </div>
      <div>
        <label>Qty Klaim:</label>
        <input type="number" name="QtyClaim" value={formData.QtyClaim} onChange={handleChange} />
      </div>
      <div>
        <label>Status Detail:</label>
        <input
          type="text"
          name="StatusDetail"
          value={formData.StatusDetail}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default ClaimPenjualanForm;
