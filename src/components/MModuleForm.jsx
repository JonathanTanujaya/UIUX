import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MModuleForm({ module, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    NamaModule: '',
    btID: '',
    Modal: false,
  });

  useEffect(() => {
    if (module) {
      setFormData(module);
    }
  }, [module]);

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
      if (module) {
        // Update existing module
        await axios.put(`${API_URL}/mmodule/${module.id}`, formData);
      } else {
        // Create new module
        await axios.post(`${API_URL}/mmodule`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nama Modul:</label>
        <input type="text" name="NamaModule" value={formData.NamaModule} onChange={handleChange} />
      </div>
      <div>
        <label>BT ID:</label>
        <input type="text" name="btID" value={formData.btID} onChange={handleChange} />
      </div>
      <div>
        <label>Modal:</label>
        <input type="checkbox" name="Modal" checked={formData.Modal} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MModuleForm;
