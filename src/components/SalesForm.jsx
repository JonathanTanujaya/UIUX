import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api.js';

function SalesForm({ sale, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeSales: '',
    namasales: '',
    alamat: '',
    nohp: '',
    target: '',
    status: true,
  });

  useEffect(() => {
    if (sale) {
      // Convert backend response to form format
      setFormData({
        KodeDivisi: sale.kodedivisi || '',
        KodeSales: sale.kodesales || '',
        namasales: sale.namasales || '',
        alamat: sale.alamat || '',
        nohp: sale.nohp || '',
        target: sale.target || '',
        status: sale.status !== undefined ? sale.status : true,
      });
    }
  }, [sale]);

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
      if (sale) {
        // Update existing sale
        await axios.put(`${API_BASE_URL}/sales/${sale.kodedivisi}/${sale.kodesales}`, formData);
      } else {
        // Create new sale
        await axios.post(`${API_BASE_URL}/sales`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving sales:', error);
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
        <label>Kode Sales:</label>
        <input
          type="text"
          name="KodeSales"
          value={formData.KodeSales}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nama Sales:</label>
        <input type="text" name="namasales" value={formData.namasales} onChange={handleChange} />
      </div>
      <div>
        <label>Alamat:</label>
        <input type="text" name="alamat" value={formData.alamat} onChange={handleChange} />
      </div>
      <div>
        <label>No HP:</label>
        <input type="text" name="nohp" value={formData.nohp} onChange={handleChange} />
      </div>
      <div>
        <label>Target:</label>
        <input type="number" name="target" value={formData.target} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default SalesForm;
