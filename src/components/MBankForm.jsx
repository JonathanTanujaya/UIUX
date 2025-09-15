import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MBankForm({ bank, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeBank: '',
    NamaBank: '',
    Status: true,
  });

  useEffect(() => {
    if (bank) {
      setFormData(bank);
    }
  }, [bank]);

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
      if (bank) {
        // Update existing bank
        await axios.put(`${API_URL}/mbank/${bank.KodeDivisi}/${bank.KodeBank}`, formData);
      } else {
        // Create new bank
        await axios.post(`${API_URL}/mbank`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving bank:', error);
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
        <label>Kode Bank:</label>
        <input
          type="text"
          name="KodeBank"
          value={formData.KodeBank}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nama Bank:</label>
        <input type="text" name="NamaBank" value={formData.NamaBank} onChange={handleChange} />
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

export default MBankForm;
