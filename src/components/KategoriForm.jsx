import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api.js';

function KategoriForm({ kategori, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeKategori: '',
    Kategori: '',
    Status: true,
  });

  useEffect(() => {
    if (kategori) {
      // Convert lowercase fields from backend to PascalCase for form
      setFormData({
        KodeDivisi: kategori.kodedivisi || '',
        KodeKategori: kategori.kodekategori || '',
        Kategori: kategori.kategori || '',
        Status: kategori.status !== undefined ? kategori.status : true,
      });
    }
  }, [kategori]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (kategori) {
        // Update existing kategori
        await axios.put(
          `${API_BASE_URL}/kategori/${kategori.kodedivisi}/${kategori.kodekategori}`,
          formData
        );
      } else {
        // Create new kategori
        await axios.post(`${API_BASE_URL}/kategori`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving kategori:', error);
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
        <label>Kode Kategori:</label>
        <input
          type="text"
          name="KodeKategori"
          value={formData.KodeKategori}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Kategori:</label>
        <input type="text" name="Kategori" value={formData.Kategori} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="checkbox" name="Status" checked={formData.Status} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default KategoriForm;
