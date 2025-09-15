import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MDokumenForm({ dokumen, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeDok: '',
    Nomor: '',
  });

  useEffect(() => {
    if (dokumen) {
      setFormData(dokumen);
    }
  }, [dokumen]);

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
      if (dokumen) {
        // Update existing dokumen
        await axios.put(`${API_URL}/mdokumen/${dokumen.KodeDivisi}/${dokumen.KodeDok}`, formData);
      } else {
        // Create new dokumen
        await axios.post(`${API_URL}/mdokumen`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving dokumen:', error);
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
        <label>Kode Dokumen:</label>
        <input
          type="text"
          name="KodeDok"
          value={formData.KodeDok}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nomor:</label>
        <input type="text" name="Nomor" value={formData.Nomor} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MDokumenForm;
