import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MCOAForm({ coa, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeCOA: '',
    NamaCOA: '',
    SaldoNormal: '',
  });

  useEffect(() => {
    if (coa) {
      setFormData(coa);
    }
  }, [coa]);

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
      if (coa) {
        // Update existing COA
        await axios.put(`${API_URL}/mcoa/${coa.KodeCOA}`, formData);
      } else {
        // Create new COA
        await axios.post(`${API_URL}/mcoa`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving COA:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Kode COA:</label>
        <input
          type="text"
          name="KodeCOA"
          value={formData.KodeCOA}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nama COA:</label>
        <input type="text" name="NamaCOA" value={formData.NamaCOA} onChange={handleChange} />
      </div>
      <div>
        <label>Saldo Normal:</label>
        <input
          type="text"
          name="SaldoNormal"
          value={formData.SaldoNormal}
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

export default MCOAForm;
