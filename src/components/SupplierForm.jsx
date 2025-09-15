import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function SupplierForm({ supplier, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeSupplier: '',
    NamaSupplier: '',
    Alamat: '',
    Telp: '',
    contact: '',
    status: true,
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    }
  }, [supplier]);

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
      if (supplier) {
        // Update existing supplier
        await axios.put(
          `${API_URL}/supplier/${supplier.KodeDivisi}/${supplier.KodeSupplier}`,
          formData
        );
      } else {
        // Create new supplier
        await axios.post(`${API_URL}/supplier`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving supplier:', error);
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
        <label>Kode Supplier:</label>
        <input
          type="text"
          name="KodeSupplier"
          value={formData.KodeSupplier}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nama Supplier:</label>
        <input
          type="text"
          name="NamaSupplier"
          value={formData.NamaSupplier}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Alamat:</label>
        <input type="text" name="Alamat" value={formData.Alamat} onChange={handleChange} />
      </div>
      <div>
        <label>Telp:</label>
        <input type="text" name="Telp" value={formData.Telp} onChange={handleChange} />
      </div>
      <div>
        <label>Contact:</label>
        <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
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

export default SupplierForm;
