import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MResiForm({ resi, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    NoResi: '',
    NoRekeningTujuan: '',
    TglPembayaran: '',
    KodeCust: '',
    Jumlah: '',
    SisaResi: '',
    Keterangan: '',
    Status: '',
  });

  useEffect(() => {
    if (resi) {
      setFormData(resi);
    }
  }, [resi]);

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
      if (resi) {
        // Update existing resi
        await axios.put(`${API_URL}/mresi/${resi.KodeDivisi}/${resi.NoResi}`, formData);
      } else {
        // Create new resi
        await axios.post(`${API_URL}/mresi`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving resi:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>No Resi:</label>
        <input type="text" name="NoResi" value={formData.NoResi} onChange={handleChange} required />
      </div>
      <div>
        <label>No Rekening Tujuan:</label>
        <input
          type="text"
          name="NoRekeningTujuan"
          value={formData.NoRekeningTujuan}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tgl Pembayaran:</label>
        <input
          type="text"
          name="TglPembayaran"
          value={formData.TglPembayaran}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Kode Customer:</label>
        <input type="text" name="KodeCust" value={formData.KodeCust} onChange={handleChange} />
      </div>
      <div>
        <label>Jumlah:</label>
        <input type="number" name="Jumlah" value={formData.Jumlah} onChange={handleChange} />
      </div>
      <div>
        <label>Sisa Resi:</label>
        <input type="number" name="SisaResi" value={formData.SisaResi} onChange={handleChange} />
      </div>
      <div>
        <label>Keterangan:</label>
        <textarea name="Keterangan" value={formData.Keterangan} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="Status" value={formData.Status} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MResiForm;
