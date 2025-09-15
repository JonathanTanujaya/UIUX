import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MTTForm({ mtt, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    NoTT: '',
    Tanggal: '',
    KodeCust: '',
    Keterangan: '',
  });

  useEffect(() => {
    if (mtt) {
      setFormData(mtt);
    }
  }, [mtt]);

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
      if (mtt) {
        // Update existing MTT
        await axios.put(`${API_URL}/mtt/${mtt.id}`, formData);
      } else {
        // Create new MTT
        await axios.post(`${API_URL}/mtt`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving MTT:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>No TT:</label>
        <input type="text" name="NoTT" value={formData.NoTT} onChange={handleChange} />
      </div>
      <div>
        <label>Tanggal:</label>
        <input type="date" name="Tanggal" value={formData.Tanggal} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Customer:</label>
        <input type="text" name="KodeCust" value={formData.KodeCust} onChange={handleChange} />
      </div>
      <div>
        <label>Keterangan:</label>
        <input type="text" name="Keterangan" value={formData.Keterangan} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MTTForm;
