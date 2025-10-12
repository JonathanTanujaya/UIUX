import React, { useState, useEffect } from 'react';
import { banksAPI } from '../../../services/api';
import '../../../design-system.css';

const MasterBank = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    kodedivisi: '01',
    kodebank: 'BANK', // Default value
    norekening: '0000000000', // Default value  
    atasnama: '',
    saldo: '0',
    status: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await banksAPI.getAll();
      
      const bankData = response.data || [];
      
      setData(bankData);
    } catch (error) {
      console.error('Error fetching bank data:', error);
      // Fallback to sample data if API fails
      const sampleData = [
        {
          kodedivisi: '01',
          kodebank: 'BCA',
          norekening: '1234567890',
          atasnama: 'Bank Central Asia',
          saldo: '1000000.00',
          status: true,
        },
      ];
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update dengan composite key
        await banksAPI.update(`${editingItem.kodedivisi}/${editingItem.kodebank}`, formData);
        setData(prev =>
          prev.map(item =>
            (item.kodedivisi === editingItem.kodedivisi && item.kodebank === editingItem.kodebank) 
              ? { ...formData } : item
          )
        );
        alert('Data bank berhasil diupdate!');
      } else {
        const response = await banksAPI.create(formData);
        const newItem = response.data || formData;
        setData(prev => [...prev, newItem]);
        alert('Data bank berhasil ditambahkan!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving bank:', error);
      alert('Error saving bank');
    }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setFormData({
      kodedivisi: item.kodedivisi,
      kodebank: item.kodebank,
      norekening: item.norekening,
      atasnama: item.atasnama,
      saldo: item.saldo || '0',
      status: item.status
    });
    setShowForm(true);
  };

  const handleDelete = async (kodedivisi, kodebank) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        // Backend menggunakan composite key, jadi perlu disesuaikan
        await banksAPI.delete(`${kodedivisi}/${kodebank}`);
        setData(prev => prev.filter(item => !(item.kodedivisi === kodedivisi && item.kodebank === kodebank)));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting bank:', error);
        alert('Error deleting bank');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      kodedivisi: '01',
      kodebank: 'BANK', // Default value
      norekening: '0000000000', // Default value
      atasnama: '',
      saldo: '0',
      status: true
    });
    setEditingItem(null);
    setShowForm(false);
  };

  if (loading)
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Tutup Form' : 'Tambah Bank'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">{editingItem ? 'Edit Bank' : 'Tambah Bank'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Kode Divisi</label>
                  <input
                    type="text"
                    name="kodedivisi"
                    value={formData.kodedivisi}
                    onChange={handleInputChange}
                    className="form-control"
                    maxLength="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Atas Nama</label>
                  <input
                    type="text"
                    name="atasnama"
                    value={formData.atasnama}
                    onChange={handleInputChange}
                    className="form-control"
                    maxLength="100"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Saldo</label>
                  <input
                    type="number"
                    name="saldo"
                    value={formData.saldo}
                    onChange={handleInputChange}
                    className="form-control"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value === 'true'}))}
                    className="form-control"
                  >
                    <option value={true}>Aktif</option>
                    <option value={false}>Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Data Bank</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama/Atas Nama</th>
                  <th>Saldo</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={`${item.kodedivisi}-${item.kodebank}`}>
                    <td>{item.atasnama}</td>
                    <td>{parseFloat(item.saldo || 0).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge ${item.status ? 'badge-success' : 'badge-danger'}`}>
                        {item.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.kodedivisi, item.kodebank)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterBank;
