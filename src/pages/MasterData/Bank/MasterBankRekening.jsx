import React, { useState, useEffect } from 'react';
import { banksAPI } from '../../../services/api';
import '../../../design-system.css';

const MasterBankRekening = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'saldo'
  const [formData, setFormData] = useState({
    no_rekening: '',
    kode_bank: '',
    nama_bank: '',
    atas_nama: '',
    status_rekening: true,
    saldo: '0',
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
          no_rekening: '1234567890',
          kode_bank: 'BCA',
          nama_bank: 'Bank Central Asia',
          atas_nama: 'PT. Contoh Perusahaan',
          status_rekening: true,
          saldo: 1000000.00,
        },
        {
          no_rekening: '0987654321',
          kode_bank: 'BNI',
          nama_bank: 'Bank Negara Indonesia',
          atas_nama: 'PT. Contoh Perusahaan',
          status_rekening: true,
          saldo: 500000.00,
        },
      ];
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        await banksAPI.update(editingItem.no_rekening, formData);
        setData(prev =>
          prev.map(item =>
            item.no_rekening === editingItem.no_rekening ? { ...formData } : item
          )
        );
        alert('Data rekening bank berhasil diupdate!');
      } else {
        const response = await banksAPI.create(formData);
        const newItem = response.data || formData;
        setData(prev => [...prev, newItem]);
        alert('Data rekening bank berhasil ditambahkan!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving bank account:', error);
      alert('Error saving bank account');
    }
  };

  const handleEdit = item => {
    setEditingItem(item);
    setFormData({
      no_rekening: item.no_rekening,
      kode_bank: item.kode_bank,
      nama_bank: item.nama_bank,
      atas_nama: item.atas_nama,
      status_rekening: item.status_rekening,
      saldo: item.saldo || '0',
    });
    setShowForm(true);
  };

  const handleDelete = async (no_rekening) => {
    if (confirm('Yakin ingin menghapus data rekening ini?')) {
      try {
        await banksAPI.delete(no_rekening);
        setData(prev => prev.filter(item => item.no_rekening !== no_rekening));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting bank account:', error);
        alert('Error deleting bank account');
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      no_rekening: '',
      kode_bank: '',
      nama_bank: '',
      atas_nama: '',
      status_rekening: true,
      saldo: '0',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    return status ? (
      <span className="badge badge-success">Aktif</span>
    ) : (
      <span className="badge badge-danger">Non-Aktif</span>
    );
  };

  if (loading)
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Master Bank & Rekening</h1>
        <p className="page-subtitle">Kelola data bank dan rekening perusahaan</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 Daftar Rekening
        </button>
        <button 
          className={`tab-button ${activeTab === 'saldo' ? 'active' : ''}`}
          onClick={() => setActiveTab('saldo')}
        >
          💰 Monitoring Saldo
        </button>
      </div>

      {/* Actions */}
      <div className="page-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Tutup Form' : '+ Tambah Rekening Bank'}
        </button>
        <button className="btn btn-secondary" onClick={fetchData}>
          🔄 Refresh
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title">
              {editingItem ? '✏️ Edit Rekening Bank' : '➕ Tambah Rekening Bank'}
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">No. Rekening *</label>
                  <input
                    type="text"
                    name="no_rekening"
                    value={formData.no_rekening}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Masukkan nomor rekening"
                    required
                    disabled={editingItem} // No rekening tidak bisa diubah saat edit
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kode Bank *</label>
                  <input
                    type="text"
                    name="kode_bank"
                    value={formData.kode_bank}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Contoh: BCA, BNI, BRI"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Bank *</label>
                  <input
                    type="text"
                    name="nama_bank"
                    value={formData.nama_bank}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Contoh: Bank Central Asia"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Atas Nama *</label>
                  <input
                    type="text"
                    name="atas_nama"
                    value={formData.atas_nama}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nama pemegang rekening"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Saldo Awal</label>
                  <input
                    type="number"
                    name="saldo"
                    value={formData.saldo}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="status_rekening"
                      checked={formData.status_rekening}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span>Rekening Aktif</span>
                  </div>
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

      {/* Content based on active tab */}
      {activeTab === 'list' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📋 Daftar Rekening Bank</h3>
            <div className="card-actions">
              <span className="data-count">{data.length} rekening</span>
            </div>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No. Rekening</th>
                    <th>Bank</th>
                    <th>Atas Nama</th>
                    <th>Saldo</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.no_rekening}>
                      <td>
                        <div className="cell-with-icon">
                          🏦 {item.no_rekening}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">{item.nama_bank}</div>
                          <div className="text-sm text-gray-500">{item.kode_bank}</div>
                        </div>
                      </td>
                      <td>{item.atas_nama}</td>
                      <td>
                        <span className="font-mono text-green-600">
                          {formatCurrency(item.saldo)}
                        </span>
                      </td>
                      <td>{getStatusBadge(item.status_rekening)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.no_rekening)}
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="empty-state">
                          <div className="empty-icon">🏦</div>
                          <p>Belum ada data rekening bank</p>
                          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                            Tambah Rekening Pertama
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'saldo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(item => (
            <div key={item.no_rekening} className="card">
              <div className="card-header">
                <h4 className="card-title">{item.nama_bank}</h4>
                {getStatusBadge(item.status_rekening)}
              </div>
              <div className="card-body">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">No. Rekening:</span>
                    <p className="font-mono">{item.no_rekening}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Atas Nama:</span>
                    <p>{item.atas_nama}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Saldo:</span>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(item.saldo)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="action-buttons">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(item)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {/* Future: Open transaction history */}}
                  >
                    📊 History
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full">
              <div className="card">
                <div className="card-body text-center py-8">
                  <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <p>Belum ada data saldo bank</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MasterBankRekening;
