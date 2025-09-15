import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MTransForm({ mtrans, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeTrans: '',
    Transaksi: '',
  });

  useEffect(() => {
    if (mtrans) {
      setFormData(mtrans);
    }
  }, [mtrans]);

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
      if (mtrans) {
        // Update existing mtrans
        await axios.put(`${API_URL}/mtrans/${mtrans.KodeTrans}`, formData);
      } else {
        // Create new mtrans
        await axios.post(`${API_URL}/mtrans`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving MTrans:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Kode Transaksi:</label>
        <input
          type="text"
          name="KodeTrans"
          value={formData.KodeTrans}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Transaksi:</label>
        <input type="text" name="Transaksi" value={formData.Transaksi} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MTransForm;
