import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function CustomerForm({ customer, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    KodeCust: '',
    NamaCust: '',
    KodeArea: '',
    Alamat: '',
    Telp: '',
    Contact: '',
    CreditLimit: '',
    JatuhTempo: '',
    Status: true,
    NoNPWP: '',
    NIK: '',
    NamaPajak: '',
    AlamatPajak: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

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
      if (customer) {
        // Update existing customer
        await axios.put(
          `${API_URL}/customers/${customer.KodeDivisi}/${customer.KodeCust}`,
          formData
        );
      } else {
        // Create new customer
        await axios.post(`${API_URL}/customers`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving customer:', error);
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
        <label>Kode Customer:</label>
        <input
          type="text"
          name="KodeCust"
          value={formData.KodeCust}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nama Customer:</label>
        <input type="text" name="NamaCust" value={formData.NamaCust} onChange={handleChange} />
      </div>
      <div>
        <label>Kode Area:</label>
        <input type="text" name="KodeArea" value={formData.KodeArea} onChange={handleChange} />
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
        <input type="text" name="Contact" value={formData.Contact} onChange={handleChange} />
      </div>
      <div>
        <label>Credit Limit:</label>
        <input
          type="number"
          name="CreditLimit"
          value={formData.CreditLimit}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Jatuh Tempo:</label>
        <input
          type="number"
          name="JatuhTempo"
          value={formData.JatuhTempo}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Status:</label>
        <input type="checkbox" name="Status" checked={formData.Status} onChange={handleChange} />
      </div>
      <div>
        <label>No NPWP:</label>
        <input type="text" name="NoNPWP" value={formData.NoNPWP} onChange={handleChange} />
      </div>
      <div>
        <label>NIK:</label>
        <input type="text" name="NIK" value={formData.NIK} onChange={handleChange} />
      </div>
      <div>
        <label>Nama Pajak:</label>
        <input type="text" name="NamaPajak" value={formData.NamaPajak} onChange={handleChange} />
      </div>
      <div>
        <label>Alamat Pajak:</label>
        <input
          type="text"
          name="AlamatPajak"
          value={formData.AlamatPajak}
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

export default CustomerForm;
