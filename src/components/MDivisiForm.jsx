import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MDivisiForm({ divisi, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    Divisi: '',
  });

  useEffect(() => {
    if (divisi) {
      setFormData(divisi);
    }
  }, [divisi]);

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
      if (divisi) {
        // Update existing divisi
        await axios.put(`${API_URL}/mdivisi/${divisi.KodeDivisi}`, formData);
      } else {
        // Create new divisi
        await axios.post(`${API_URL}/mdivisi`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving divisi:', error);
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
        <label>Divisi:</label>
        <input type="text" name="Divisi" value={formData.Divisi} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MDivisiForm;
