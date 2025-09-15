import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function MasterUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    Username: '',
    Nama: '',
    Password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

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
      if (user) {
        // Update existing user
        await axios.put(`${API_URL}/master-user/${user.KodeDivisi}/${user.Username}`, formData);
      } else {
        // Create new user
        await axios.post(`${API_URL}/master-user`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving user:', error);
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
        <label>Username:</label>
        <input
          type="text"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nama:</label>
        <input type="text" name="Nama" value={formData.Nama} onChange={handleChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="Password" value={formData.Password} onChange={handleChange} />
      </div>
      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default MasterUserForm;
