import React, { useState, useEffect } from 'react';
import { checklistAPI } from '../../../services/api';
import '../../../design-system.css';

const MasterChecklist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_checklist: '',
    kategori: '',
    deskripsi: '',
    status: 'aktif',
  });
  const [filters, setFilters] = useState({
    kategori: '',
    status: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await checklistAPI.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching checklist data:', error);
      // Fallback to sample data if API fails
      const sampleData = [
        {
          id: 1,
          nama_checklist: 'Checklist Pemeriksaan Barang Masuk',
          kategori: 'Penerimaan',
          deskripsi: 'Checklist untuk pemeriksaan barang yang masuk ke gudang',
          status: 'aktif',
          created_at: '2024-01-15',
        },
        {
          id: 2,
          nama_checklist: 'Checklist Pengiriman',
          kategori: 'Pengiriman',
          deskripsi: 'Checklist untuk proses pengiriman barang',
          status: 'aktif',
          created_at: '2024-01-16',
        },
        {
          id: 3,
          nama_checklist: 'Checklist Quality Control',
          kategori: 'QC',
          deskripsi: 'Checklist untuk quality control produk',
          status: 'aktif',
          created_at: '2024-01-17',
        },
      ];
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await checklistAPI.update(editingId, formData);
        setData(prev =>
          prev.map(item => (item.id === editingId ? { ...item, ...formData } : item))
        );
        alert('Data berhasil diupdate!');
      } else {
        const response = await checklistAPI.create(formData);
        const newItem = response.data || {
          id: Date.now(),
          ...formData,
          created_at: new Date().toISOString().split('T')[0],
        };
        setData(prev => [...prev, newItem]);
        alert('Data berhasil ditambahkan!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving checklist:', error);
      alert('Error saving checklist');
    }
  };

  const handleEdit = item => {
    setFormData({
      nama_checklist: item.nama_checklist,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      status: item.status,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await checklistAPI.delete(id);
        setData(prev => prev.filter(item => item.id !== id));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting checklist:', error);
        alert('Error deleting checklist');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nama_checklist: '',
      kategori: '',
      deskripsi: '',
      status: 'aktif',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredData = data.filter(item => {
    return (
      (!filters.kategori || item.kategori === filters.kategori) &&
      (!filters.status || item.status === filters.status)
    );
  });

  const getStatusBadge = status => {
    return (
      <span className={`badge ${status === 'aktif' ? 'badge-success' : 'badge-secondary'}`}>
        {status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
      </span>
    );
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <div className="filter-section">
            <div className="filter-group">
              <select
                name="kategori"
                value={filters.kategori}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Semua Kategori</option>
                <option value="Penerimaan">Penerimaan</option>
                <option value="Pengiriman">Pengiriman</option>
                <option value="QC">Quality Control</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
              </select>
            </div>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Tambah Checklist
            </button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama Checklist</th>
                    <th>Kategori</th>
                    <th>Deskripsi</th>
                    <th>Status</th>
                    <th>Tanggal Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr key={item.id}>
                      <td>{item.nama_checklist}</td>
                      <td>{item.kategori}</td>
                      <td>{item.deskripsi}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>{item.created_at}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="no-data">
                  <p>Tidak ada data checklist.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Checklist' : 'Tambah Checklist'}</h3>
              <button onClick={resetForm} className="btn-close">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nama Checklist *</label>
                  <input
                    type="text"
                    value={formData.nama_checklist}
                    onChange={e => setFormData({ ...formData, nama_checklist: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategori *</label>
                  <select
                    value={formData.kategori}
                    onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Penerimaan">Penerimaan</option>
                    <option value="Pengiriman">Pengiriman</option>
                    <option value="QC">Quality Control</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="form-control"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterChecklist;
