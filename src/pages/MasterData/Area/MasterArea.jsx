import React, { useState, useEffect } from 'react';
import { areasAPI } from '../../../services/api';
import '../../../design-system.css';

const MasterArea = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    kode_area: '',
    nama_area: '',
    wilayah: '',
    provinsi: '',
    keterangan: '',
    status: 'Aktif',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await areasAPI.getAll();

      // Handle API response structure: {success: true, data: [...]}
      let dataArray = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        dataArray = response.data;
      }

      setData(dataArray);
    } catch (error) {
      console.error('Error fetching area data:', error);
      // Fallback to sample data if API fails
      const sampleData = [
        {
          id: 1,
          kode_area: 'JKT',
          nama_area: 'Jakarta',
          wilayah: 'DKI Jakarta',
          provinsi: 'DKI Jakarta',
          keterangan: 'Area Jakarta dan sekitarnya',
          status: 'Aktif',
        },
        {
          id: 2,
          kode_area: 'BDG',
          nama_area: 'Bandung',
          wilayah: 'Jawa Barat',
          provinsi: 'Jawa Barat',
          keterangan: 'Area Bandung dan sekitarnya',
          status: 'Aktif',
        },
        {
          id: 3,
          kode_area: 'SBY',
          nama_area: 'Surabaya',
          wilayah: 'Jawa Timur',
          provinsi: 'Jawa Timur',
          keterangan: 'Area Surabaya dan sekitarnya',
          status: 'Aktif',
        },
      ];
      setData(sampleData);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        await areasAPI.update(editingItem.id, formData);
        setData(prev =>
          prev.map(item =>
            item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
          )
        );
        alert('Data area berhasil diupdate!');
      } else {
        const response = await areasAPI.create(formData);
        const newItem = response.data || { ...formData, id: Date.now() };
        setData(prev => [...prev, newItem]);
        alert('Data area berhasil ditambahkan!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving area:', error);
      alert('Error saving area');
    }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await areasAPI.delete(id);
        setData(prev => prev.filter(item => item.id !== id));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting area:', error);
        alert('Error deleting area');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      kode_area: '',
      nama_area: '',
      wilayah: '',
      provinsi: '',
      keterangan: '',
      status: 'Aktif',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div className="page-container">
      <div className="page-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Tutup Form' : 'Tambah Area'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">{editingItem ? 'Edit Area' : 'Tambah Area'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Kode Area</label>
                  <input
                    type="text"
                    name="kode_area"
                    value={formData.kode_area}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Area</label>
                  <input
                    type="text"
                    name="nama_area"
                    value={formData.nama_area}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Wilayah</label>
                  <input
                    type="text"
                    name="wilayah"
                    value={formData.wilayah}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Provinsi</label>
                  <select
                    name="provinsi"
                    value={formData.provinsi}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Pilih Provinsi</option>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Banten">Banten</option>
                    <option value="Sumatera Utara">Sumatera Utara</option>
                    <option value="Sumatera Selatan">Sumatera Selatan</option>
                    <option value="Kalimantan Timur">Kalimantan Timur</option>
                    <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Keterangan</label>
                <textarea
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                ></textarea>
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
          <h3 className="card-title">Data Area</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Kode Area</th>
                  <th>Nama Area</th>
                  <th>Wilayah</th>
                  <th>Provinsi</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) &&
                  data.map(item => (
                    <tr key={item.id}>
                      <td>{item.kode_area}</td>
                      <td>{item.nama_area}</td>
                      <td>{item.wilayah}</td>
                      <td>{item.provinsi}</td>
                      <td>
                        <span
                          className={`badge ${item.status === 'Aktif' ? 'badge-success' : 'badge-secondary'}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>{item.keterangan}</td>
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
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {(!Array.isArray(data) || data.length === 0) && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {!Array.isArray(data) ? 'Error loading data' : 'Tidak ada data area.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterArea;
